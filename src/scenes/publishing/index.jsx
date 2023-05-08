import * as yup from "yup";
import Body from "../../components/Body";
import MissionMatcher from "../../components/MissionMatcher";
import { useGlobal } from "../../contexts/GlobalProvider";
// import { useState, useEffect } from "react";
import moment from "moment";
import { useFlash } from "../../contexts/FlashProvider";
import {
    account_name_field,
    account_status_field,
    bounty_field,
    created_field,
    error_field,
    expired_field,
    galaxy_field,
    id_field,
    mission_status_field,
    name_field,
    region_field,
} from "../../data/columnsFieldSetting";
import { useState } from "react";
// import { mockDataMission } from "../../data/mockData";

const missionSchema = yup.object().shape({
    id: yup.number().required(),
    name: yup
        .string()
        .test("checkformat", "任务名格式错误", (value) => {
            let expression = [
                /^(Sansha|Angel|Serpentis|Guristas|Blood Raider) Anomic Site \( Warp Gate \)*?$/,
                /^(萨沙|天使|天蛇|古斯塔斯|血袭者)?混乱地点\*? \( 跃迁门\*? \)$/,
                /^(Warp Gate)\*?/,
                /^(跃迁门)\*?$/,
            ];
            return expression.some((e) => e.test(value));
        })
        .required(),
    type: yup.string().required(),
    galaxy: yup
        .string()
        .oneOf(
            [
                "9-8BL8",
                "MQFX-Q",
                "N5Y-4N",
                "6W-HRH",
                "CSOA-B",
                "K3JR-J",
                "D-8SI1",
                "9-266Q",
                "H-PA29",
                "P-FSQE",
                "1-Y6KI",
                "YP-J33",
            ],
            "不在任务星系内"
        )
        .required(),
    region: yup
        .string()
        .oneOf(["维纳尔", "Venal"], "不在任务星域内")
        .required(),
    created: yup.date().max(new Date(), "坐标创建时间异常").required(),
    account_name: yup.string().required(),
});

const Publishing = () => {

    const { api } = useGlobal();
    const flash = useFlash();
    const [missions, setMissions] = useState();
    const [bounty, setBounty] = useState({
        value: 13000000,
        error: false,
        helperText: " ",
        showRej: false,
    });
    // setMissions()

    const getAccountInfo = async (accountName) => {
        const response = await api.get(`/accounts/${accountName}`);
        if (response.ok) {
            const results = await response.body;
            // console.log(await response.body);
            return results;
        } else if (response.status === 401) {
            return { error: "没有账号所有权" };
        } else if (response.status === 404) {
            return { error: "账号不存在" };
        }
    };

    const publishMission = async (account_id, mission) => {
        const response = await api.post(
            `/accounts/${account_id}/publish_mission`,
            mission
        );
        if (response.ok) {
            const results = await response.body;
            return results;
        } else {
            let message;
            switch (response.status) {
                case 400:
                    // console.log(response);
                    if (
                        response.body.description ===
                        "Mission already published"
                    ) {
                        message = "请勿重复发送";
                    } else if (response.body.description ===
                        "Expired time is invalid"){
                        message = "过期时间错误";
                    } else
                    {
                        message = "任务格式错误";
                    }
                    break;
                case 401:
                    message = "没有账号所有权";
                    break;
                case 403:
                    message = "账号未激活";
                    break;
                case 404:
                    message = "账号不存在";
                    break;
                default:
                    message = `HTTP ${response.status} Error`;
            }
            return { error: message };
        }
    };

    const checkPublishStatus = async (mission) => {
        const response = await api.get(
            `/accounts/${mission.account_id}/missions`
        );
        if (response.ok) {
            const results = await response.body;
            // console.log(results)
            let result = {};
            results.data.some((entry) => {
                // console.log(entry);
                // console.log(mission);
                const check = [
                    mission.title === entry.name,
                    mission.galaxy === entry.galaxy,
                    moment(mission.created).utc().format() === entry.created,
                ];
                // console.log(check.every((e) => e))
                if (check.every((e) => e)) {
                    // console.log({ match: true, ...entry });
                    result = { match: true, ...entry };
                    return true;
                }
            });
            return result === {} ? { match: false } : result;
        } else if (response.status === 404) {
            return { match: false, error: "账号不存在" };
        }
    };

    const validateMission = (mission) => {
        try {
            missionSchema.validateSync(mission, { abortEarly: false });

            const withStatus = { ...mission, mission_status: "not_published" };
            return withStatus;
        } catch (error) {
            // console.log(error.inner)
            console.log(missionSchema.isValidSync(mission))
            const validationError = error.inner
                .map((e) => e.message)
                // .concat(error.message);
            console.log(validationError)
            const withError = { ...mission, error: validationError };
            return withError;
        }
    };

    const handleParsing = async (entryValue) => {
        const jsonfy = JSON.stringify(entryValue).replace(/^"(.*)"$/, "$1");
        const lst_str = jsonfy.split("\\n");
        const missions_checked = await Promise.all(
            lst_str.map(async (line, index) => {
                try {
                    let lineArray = line.split("\\t");
                    const mission = {
                        id: index,
                        name: lineArray[0],
                        type: lineArray[1],
                        // no_jump: lineArray[2],
                        galaxy: lineArray[3],
                        // system: lineArray[4],
                        region: lineArray[5],
                        created: lineArray[6],
                        account_name: lineArray[8],
                    };
                    const mission_checked = await validateMission(mission); // await here
                    let ret = await getAccountInfo(
                        mission_checked.account_name
                    ); // await here

                    if (ret.error != undefined) {
                        mission_checked.account_status = "错误";
                        mission_checked.error = ret.error;
                    }
                    if (ret.activated != undefined) {
                        mission_checked.account_id = ret.id;
                        if (ret.activated) {
                            mission_checked.account_status = "已激活";
                        } else {
                            mission_checked.account_status = "未激活";
                            mission_checked.error = "账号未激活";
                        }
                    }
                    if (mission_checked.account_status === "已激活") {
                        // console.log(`处理任务:${index}`);
                        ret = await checkPublishStatus(mission_checked);
                        // console.log(`处理完成:${index}`);
                        // console.log(ret);
                        if (ret.match) {
                            mission_checked.mission_status = ret.status;
                            mission_checked.mission_id = ret.id;
                            mission_checked.published = ret.published;
                            mission_checked.expired = ret.expired;
                            mission_checked.bounty = ret.bounty;
                        } else {
                            ret.error != undefined &&
                                (mission_checked.error = ret.error);
                        }
                    }
                    return mission_checked;
                } catch (error) {
                    error != undefined && console.log(error);
                }
            })
        );

        // console.log(missions_checked);
        setMissions(missions_checked);
    };

    const handleAll = async () => {
        let missions_deepcopy = JSON.parse(JSON.stringify(missions));

        let accept_dc = missions_deepcopy.filter(
            (mission) =>
                !mission.error && mission.mission_status === "not_published"
        );
        let success_count = 0;
        let failure_count = 0;
        // console.log(accept_dc)
        if (accept_dc.length === 0) {
            flash("没有可以发布的任务", "info", 10);
        } else {
            await Promise.all(
                accept_dc.map(async (mission) => {
                    // console.log(`处理任务:${index}`);
                    // console.log(mission.account_id)
                    // console.log(mission)
                    let msg = {
                        title: mission.name,
                        galaxy: mission.galaxy,
                        created: moment(mission.created).utc().format(),
                        expired: moment(mission.created)
                            .add(7, "days")
                            .utc()
                            .format(),
                        bounty: bounty.value,
                    };
                    // console.log(msg);
                    const ret = await publishMission(mission.account_id, msg);
                    // console.log(`发布完成:${index}`);
                    // console.log(ret);
                    if (ret.error != undefined) {
                        mission.mission_status = "error";
                        mission.error = ret.error;
                        failure_count++;
                    } else {
                        mission.mission_status = ret.status;
                        mission.mission_id = ret.id;
                        mission.published = ret.published;
                        mission.expired = ret.expired;
                        mission.bounty = ret.bounty;
                        success_count++;
                    }
                    // console.log(`处理完成:${index}`);
                    // console.log(ret);
                    return mission;
                })
            );
            setMissions(missions_deepcopy);
            if (failure_count > 0) {
                flash(
                    `成功发布${success_count}个任务，失败${failure_count}个。请检查输入`,
                    "error",
                    10
                );
            } else {
                flash(`成功发布${success_count}个任务`, "success", 10);
            }
        }
    };

    const handleSelected = () => {};

    // useEffect(() => {
    //     // console.log(missions
    //     (async () => {
    //         if (missions === undefined) {
    //             return [];
    //         }
    //         let mission_update = [...missions.accept];
    //         mission_update.forEach(async (val) => {
    //             if (val.account_status === undefined) {
    //                 const accountInfo = await getAccountInfo(val.account_name);
    //                 if (accountInfo.error) {
    //                     val.account_status = "错误";
    //                     val.error = "找不到账号名";
    //                 } else {
    //                     val.account_status = accountInfo.activated
    //                         ? "已激活"
    //                         : "未激活";
    //                 }
    //             }
    //             return val;
    //         });
    //         setValidMission(mission_update);
    //     })();
    // }, [missions]);

    const columns = [
        id_field,
        name_field,
        account_name_field,
        // accid_field,
        account_status_field,
        galaxy_field,
        region_field,
        bounty_field,
        created_field,
        expired_field,
        mission_status_field,
    ];

    const rejCol = [
        // id_field,
        name_field,
        account_name_field,
        // accid_field,
        account_status_field,
        galaxy_field,
        region_field,
        created_field,
        expired_field,
        // mission_status_field,
        error_field,
    ];

    return (
        <Body topbar={true} title="发布任务" subtitle="求求老板们快去做点吧">
            <MissionMatcher
                keyword="发布"
                columns={columns}
                rejCol={rejCol}
                handleParsing={handleParsing}
                handleAll={handleAll}
                handleSelected={handleSelected}
                missions={missions}
                bounty={bounty}
                setBounty={setBounty}
            />
        </Body>
    );
};

export default Publishing;
