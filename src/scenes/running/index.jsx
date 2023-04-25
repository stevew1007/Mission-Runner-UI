import * as yup from "yup";
import Body from "../../components/Body";
import { useGlobal } from "../../contexts/GlobalProvider";
import MissionMatcher from "../../components/MissionMatcher";
import moment from "moment";
import {
    account_name_field,
    account_status_field,
    created_field,
    error_field,
    expired_field,
    galaxy_field,
    id_field,
    mission_status_field,
    name_field,
    region_field,
} from "../../data/columnsFieldSetting";
import { useFlash } from "../../contexts/FlashProvider";
import { useState } from "react";

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
        .oneOf(["维纳尔", "	Venal"], "不在任务星系内")
        .required(),
    created: yup.date().max(new Date(), "坐标创建时间异常").required(),
    account_name: yup.string().required(),
});

const Running = () => {
    const { api } = useGlobal();
    const flash = useFlash();
    const [missions, setMissions] = useState();
    // setMissions();

    const checkPublishStatus = async (mission) => {
        const response = await api.get(`/missions/${mission.galaxy}`);
        if (response.ok) {
            const results = await response.body;
            // console.log(results);
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

    const updateMission = async (id, action) => {
        const response = await api.post(`/missions/${id}/${action}`);
        if (response.ok) {
            const ret = await api.get(`/missions/${id}`);
            if (ret.ok) {
                const result = await ret.body;
                return result;
            } else {
                return { error: "获取数据失败" };
            }

        } else {
            let message;
            switch (response.status) {
                case 401:
                    message = "非法操作";
                    break;
                case 403:
                    message = "任务已过期";
                    break;
                case 404:
                    message = "任务不存在";
                    break;
                default:
                    message = `HTTP ${response.status} Error`;
            }
            return { error: message };
        }
    };

    // const getAccountInfo = async (accountName) => {
    //     const response = await api.get(`/accounts/${accountName}`);
    //     if (response.ok) {
    //         const results = await response.body;
    //         // console.log(await response.body);
    //         return results;
    //     } else if (response.status === 401) {
    //         return { error: "没有账号所有权" };
    //     } else if (response.status === 404) {
    //         return { error: "账号不存在" };
    //     }
    // };

    const validateMission = (mission) => {
        try {
            missionSchema.validateSync(mission, { abortEarly: false });

            const withStatus = { ...mission, mission_status: "unknown" };
            return withStatus;
        } catch (error) {
            // console.log(error);
            const validationError = error.inner
                .map((e) => e.message)
                .concat(error.message);
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

                    let ret = await checkPublishStatus(mission_checked);
                    // console.log(`处理完成:${index}`);
                    // console.log(ret);
                    if (ret.match) {
                        mission_checked.mission_status = ret.status;
                        ret.status != "published" &&
                            (mission_checked.error = "任务状态错误");
                        mission_checked.mission_id = ret.id;
                        mission_checked.published = ret.published;
                        mission_checked.expired = ret.expired;
                        mission_checked.bounty = ret.bounty;
                        mission_checked.info = ret;
                    } else {
                        ret.error != undefined
                            ? (mission_checked.error = ret.error)
                            : (mission_checked.error = "未匹配到任务");
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
        // console.log(await missions)
        let missions_deepcopy = JSON.parse(JSON.stringify(missions));

        let accept_dc = missions_deepcopy.filter(
            (mission) =>
                !mission.error && mission.mission_status === "published"
        );
        let success_count = 0;
        let failure_count = 0;
        // console.log(accept_dc)
        if (accept_dc.length === 0) {
            flash("没有可以接受的任务", "info", 10);
        } else {
            await Promise.all(
                accept_dc.map(async (mission, index) => {
                    console.log(`处理任务:${index}`);
                    // console.log(mission.account_id)
                    console.log(mission)
                    // console.log(msg);
                    const ret = await updateMission(
                        mission.mission_id,
                        "accepted"
                    );
                    console.log(`接受完成:${index}`);
                    console.log(ret);
                    if (ret.error != undefined) {
                        mission.mission_status = "error";
                        mission.error = ret.error;
                        failure_count += 0;
                    } else {
                        mission.mission_status = ret.status;
                        mission.mission_id = ret.id;
                        mission.published = ret.published;
                        mission.expired = ret.expired;
                        mission.bounty = ret.bounty;
                        success_count += 1;
                    }
                    console.log(`处理完成:${index}`);
                    console.log(ret);
                    return mission;
                })
            );
            setMissions(missions_deepcopy);
            if (failure_count > 0) {
                flash(
                    `成功接受${success_count}个任务，失败${failure_count}个。请检查输入`,
                    "error",
                    10
                );
            } else {
                flash(`成功接受${success_count}个任务`, "success", 10);
            }
        }

        // console.log(`处理结束！${result}`);
        // console.log(missions_deepcopy);
        // const missions_update = missions.map((val) => {
        //     if (val.mission_status === "not_published") {
        //         return { ...val, mission_status: "published" };
        //     }
        //     return val;
        // });
        setMissions(missions_deepcopy);
    };

    const handleSelected = () => {};

    const columns = [
        id_field,
        name_field,
        // account_name_field,
        // accid_field,
        // account_status_field,
        galaxy_field,
        region_field,
        created_field,
        expired_field,
        mission_status_field,
    ];

    const rejCol = [
        id_field,
        name_field,
        // account_name_field,
        // accid_field,
        // account_status_field,
        galaxy_field,
        region_field,
        created_field,
        expired_field,
        // mission_status_field,
        error_field,
    ];

    return (
        <Body topbar={true} title="接受任务" subtitle="点多，速来">
            <MissionMatcher
                keyword="接受"
                columns={columns}
                rejCol={rejCol}
                handleParsing={handleParsing}
                handleAll={handleAll}
                handleSelected={handleSelected}
                missions={missions}
            />
        </Body>
    );
};

export default Running;
