import { mockDataTeam } from "../../data/mockData";
import * as yup from "yup";
import Body from "../../components/Body";
import MissionMatcher from "../../components/MissionMatcher";
import { useGlobal } from "../../contexts/GlobalProvider";
// import { useState, useEffect } from "react";
import { Box, Chip } from "@mui/material";
import moment from "moment";

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

const Publishing = () => {
    // const theme = useTheme();
    // const colors = tokens(theme.palette.mode);
    const { api, setMissions } = useGlobal();

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

    const validateMission = (mission) => {
        try {
            missionSchema.validateSync(mission, { abortEarly: false });

            const withStatus = { ...mission, mission_status: "not_published" };
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
                const ret = await getAccountInfo(mission_checked.account_name); // await here

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
                return mission_checked;
            })
        );

        // console.log(missions_checked);
        setMissions(missions_checked);
    };

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

    const id_field = {
        field: "id",
        headerName: "ID",
        flex: 0.5,
        renderCell: ({ row: { id, mission_status } }) => {
            return mission_status === "not_published" ? (
                <Box>--</Box>
            ) : (
                <Box>{id}</Box>
            );
        },
    };
    const name_field = {
        field: "name",
        headerName: "Name",
        flex: 2.2,
        cellClassName: "name-column--cell",
    };
    // const mission_type_field = {
    //     field: "mission_type",
    //     headerName: "任务类型",
    //     flex: 3,
    //     renderCell: ({ row: { name } }) => {
    //         let pattern = [
    //             /^(Sansha|Angel|Serpentis|Guristas|Blood Raider) Anomic Site \( Warp Gate \)*?$/,
    //             /^(萨沙|天使|古斯塔斯|血袭者)?混乱地点\*? \( 跃迁门\*? \)$/,
    //             /^(Warp Gate)\*?/,
    //             /^(跃迁门)\*?$/,
    //         ];
    //         let output = pattern.map((value) => {
    //             let result = name.match(value);
    //             if (result != null) {
    //                 // console.log(result[1]);
    //                 return result[1];
    //             }
    //         });
    //         return <Box>{output}</Box>;
    //     },
    // };
    const account_name_field = {
        field: "account_name",
        headerName: "发布账号",
        headerAlign: "center",
        align: "center",
        flex: 1.5,
    };
    const account_status_field = {
        field: "account_status",
        headerName: "账号状态",
        headerAlign: "center",
        align: "center",
        flex: 1.5,
        renderCell: ({ row: { account_status } }) => {
            const checkStatus = () => {
                if (account_status === "已激活") {
                    return {
                        label: "已激活",
                        color: "success",
                        variant: "outlined",
                    };
                } else if (account_status === "未激活") {
                    return { label: "未激活", variant: "outlined" };
                } else if (account_status === "错误") {
                    return {
                        label: "错误",
                        color: "error",
                        variant: "outlined",
                    };
                } else return { lable: "检查中", variant: "outlined" };
            };
            // let status = checkStatus();
            return (
                <Chip
                    label={checkStatus().label}
                    color={checkStatus().color}
                    variant="outlined"
                />
            );
        },
    };
    const galaxy_field = {
        field: "galaxy",
        headerName: "星系",
        headerAlign: "center",
        align: "center",
    };
    const region_field = {
        field: "region",
        headerName: "星域",
        headerAlign: "center",
        align: "center",
        flex: 1,
    };
    const created_field = {
        field: "created",
        headerName: "信标创建",
        type: "number",
        headerAlign: "center",
        align: "center",
        flex: 1,
        renderCell: ({ row: { created } }) => {
            // console.log(created)
            return <Box>{moment(created).fromNow()}</Box>;
        },
    };
    const expired_field = {
        field: "expired",
        headerName: "过期时间",
        type: "number",
        headerAlign: "center",
        align: "center",
        flex: 1,
        renderCell: ({ row: { expired, mission_status } }) => {
            return mission_status === "not_published" ? (
                <Box>--</Box>
            ) : (
                <Box>{moment(expired).fromNow()}</Box>
            );
        },
    };
    const mission_status_field = {
        field: "status",
        headerName: "发布状态",
        headerAlign: "center",
        align: "center",
        flex: 1,
        renderCell: ({ row: { mission_status } }) => {
            // console.log(mission_status);
            const checkStatus = () => {
                if (mission_status === " published") {
                    return {
                        label: "发布成功",
                        color: "success",
                        variant: "outlined",
                    };
                } else if (mission_status === "not_published") {
                    return { label: "未发布", variant: "outlined" };
                } else if (mission_status === "fault") {
                    return {
                        label: "发布错误",
                        color: "error",
                        variant: "outlined",
                    };
                } else return { lable: "检查中", variant: "outlined" };
            };
            // let status = checkStatus();
            return (
                <Chip
                    label={checkStatus().label}
                    color={checkStatus().color}
                    variant="outlined"
                />
            );
        },
    };
    const error_field = {
        field: "error",
        headerName: "报错",
        headerAlign: "center",
        align: "center",
        flex: 1,
    };

    // const accid_field = {
    //     field: "account_id",
    //     headerName: "ACC ID",
    //     headerAlign: "center",
    //     align: "center",
    //     flex: 1,
    // };


    const columns = [
        id_field,
        name_field,
        account_name_field,
        // accid_field,
        account_status_field,
        galaxy_field,
        region_field,
        created_field,
        expired_field,
        mission_status_field,
    ];

    const rejCol = [
        id_field,
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
                identified={mockDataTeam}
                handleParsing={handleParsing}
                columns={columns}
                rejCol={rejCol}
            />
        </Body>
    );
};

export default Publishing;
