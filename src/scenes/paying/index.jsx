import { Box, Button, Chip, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Body from "../../components/Body";
import { useEffect, useState } from "react";
import { useGlobal } from "../../contexts/GlobalProvider";
import { useUser } from "../../contexts/UserProvider";
// import { useFlash } from "../../contexts/FlashProvider";
import {
    created_field,
    expired_field,
    galaxy_field,
    id_field,
    title_field,
} from "../../data/columnsFieldSetting";
import { useFlash } from "../../contexts/FlashProvider";
// import FlashMessage from "../../components/FlashMessage";

const Paying = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user, toggleUpdateUser } = useUser();
    const { api } = useGlobal();
    const flash = useFlash();
    const [missions, setMissions] = useState();
    const [payment, setPayment] = useState();

    // const [hoverID, setHoverID] = useState();
    // const flash = useFlash();

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
                case 400:
                    message = "非法操作";
                    break;
                case 401:
                    message = "任务不属于你";
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

    const handleGetBill = async () => {
        if (missions === undefined) {
            flash("没有可以处理的任务", "info", 10);
        } else {
            let missions_dc = JSON.parse(JSON.stringify(missions));
            let runner_to_pay = [];
            missions_dc.forEach((mission) => {
                // console.log(mission)
                // Check if mission.runner is in runner
                if (
                    !runner_to_pay.some((runner) => {
                        // console.log(runner)
                        return runner.id === mission.runner.id;
                    })
                ) {
                    // console.log(mission.runner)
                    let runner_dc = JSON.parse(JSON.stringify(mission.runner));
                    runner_dc.payable = mission.bounty;
                    runner_to_pay.push(runner_dc);
                } else {
                    let runner_index = runner_to_pay.findIndex(
                        (runner) => runner.id === mission.runner.id
                    );
                    runner_to_pay[runner_index].payable += mission.bounty;
                }
            });
            console.log(runner_to_pay);
            setPayment(runner_to_pay);
        }
    };

    const handleAll = async () => {
        // console.log(await missions)
        console.log(missions)
        let missions_deepcopy = JSON.parse(JSON.stringify(missions));
        let success_count = 0;
        let failure_count = 0;
        // console.log(accept_dc)
        if (missions.length === 0) {
            flash("没有可以标记结清的任务", "info", 10);
        } else {
            await Promise.all(
                missions.map(async (mission) => {
                    // console.log(`处理任务:${index}`);
                    // console.log(mission.account_id)
                    console.log(mission)
                    // console.log(msg);
                    const ret = await updateMission(
                        mission.id,
                        "paid"
                    );
                    // const ret
                    // console.log(`接受完成:${index}`);
                    // console.log(ret);
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
                    // console.log(`处理完成:${index}`);
                    // console.log(ret);
                    return mission;
                })
            );
            setMissions(missions_deepcopy);
            toggleUpdateUser();
            if (failure_count > 0) {
                flash(
                    `成功结清${success_count}个任务，失败${failure_count}个。请检查输入`,
                    "error",
                    10
                );
            } else {
                flash(`成功结清${success_count}个任务`, "success", 10);
            }
        }
        // setMissions(missions_deepcopy);
    };

    useEffect(() => {
        (async () => {
            const response = await api.get("/missions/state/completed");
            if (response.ok) {
                const results = await response.body;
                console.log(results.data);
                setMissions(results.data);
            } else {
                setMissions(null);
            }
        })();
    }, [api, user]);

    const completed_columns = [
        id_field,
        // name_field,
        title_field,
        {
            field: "publisher",
            headerName: "发布账号",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { publisher } }) => {
                // console.log(mission_id);
                return <Box>{publisher.name}</Box>;
            },
        },
        {
            field: "runner",
            headerName: "打手",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { runner } }) => {
                // console.log(mission_id);
                return <Box>{runner.username}</Box>;
            },
        },
        galaxy_field,
        created_field,
        expired_field,
        {
            field: "bounty",
            headerName: "奖金",
            headerAlign: "center",
            align: "right",
            type: "number",
            flex: 1.5,
            valueFormatter: ({ value }) => {
                return new Intl.NumberFormat("is-IS", {
                    style: "currency",
                    currency: "ISK",
                }).format(value);
            },
        },
        {
            field: "status",
            headerName: "发布状态",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { status } }) => {
                const checkStatus = () => {
                    switch (status) {
                        case "not_published":
                            return { label: "未发布", variant: "outlined" };
                        case "published":
                            return {
                                label: "发布中",
                                color: "success",
                                // variant: "outlined",
                            };
                        case "accepted":
                            return {
                                label: "已接受",
                                color: "success",
                                variant: "outlined",
                            };
                        case "completed":
                            return {
                                label: "已完成",
                                color: "success",
                                variant: "outlined",
                            };
                        case "paid":
                            return {
                                label: "已支付",
                                color: "success",
                                variant: "outlined",
                            };
                        case "archived":
                            return {
                                label: "已归档",
                                variant: "outlined",
                            };
                        case "done":
                            return {
                                label: "已付清",
                                variant: "outlined",
                            };
                        case "fault":
                            return {
                                label: "错误",
                                color: "error",
                                variant: "outlined",
                            };
                        default:
                            return {
                                lable: "检查中",
                                variant: "outlined",
                            };
                    }
                };
                // let status = checkStatus();
                // console.log(checkStatus());
                return (
                    <Chip
                        label={checkStatus().label}
                        color={checkStatus().color}
                        variant={checkStatus().variant}
                    />
                );
            },
        },
    ];

    const payment_col = [
        {
            field: "username",
            headerName: "打手",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "runner",
            headerName: "打手账号",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { default_account } }) => {
                // console.log(mission_id);
                return <Box>{default_account.name}</Box>;
            },
        },
        {
            field: "payable",
            headerName: "应付金额",
            headerAlign: "center",
            align: "right",
            flex: 1,
            type: "number",
            valueFormatter: ({ value }) => {
                return new Intl.NumberFormat("is-IS", {
                    style: "currency",
                    currency: "ISK",
                }).format(value);
            }
        },
        {
            field: "link",
            headerName: "",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { default_account } }) => {
                return (
                    <Button
                        color="success"
                        variant="outlined"
                        sx={{ml: 1, mr: 1}}
                        onClick={async () => {await navigator.clipboard.writeText(
                            `<font size="14" color="#ffd98d00"><a href="showinfo:1383//${default_account.esi_id}">${default_account.name}</a></font>`
                        )}}      
                    >
                        游戏内链接
                    </Button>
                )
            }
        }
    ];


    return (
        <Body
            topbar={true}
            title="费用结算"
            subtitle="快结账 老板们，文件夹就要满了"
        >
            <Typography variant="h7">已经标记完成的任务：</Typography>
            {/* <Typography variant="body2" sx={{ mt: "2px", mb: 2 }}> */}
            {/* {accounts === null ?  : ""} */}

            {/* {(accounts === undefined || accounts.length == 0) &&
                    "没有显示账号？"}
                <Typography variant="h7">
                    <Link variant="subtitle2" to="/register_account">
                        注册新账号
                    </Link>
                </Typography> */}
            {/* </Typography> */}
            <Box
                // m="10px 0 0 0"
                // height="50vh"
                borderRadius="4px"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        // backgroundColor: colors.primary[400],
                        // borderBottom: "1px #a3a3a3",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        // backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        // borderTop: "none",
                        // backgroundColor: colors.primary[400],
                        borderBottom: "1px #a3a3a3",
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid
                    autoHeight
                    // slotProps={{
                    //     row: {
                    //         onMouseEnter: (params) => {
                    //             // Get the corresponding account id for the selected row
                    //             // const rowID =
                    //             // const row = accounts[params.currentTarget.dataset.id]

                    //             setHoverID(
                    //                 missions[
                    //                     params.currentTarget.dataset.rowindex
                    //                 ].id
                    //             );
                    //             // console.log(
                    //             //     `Accounts No.${params.currentTarget.dataset.rowindex} is ${hoverID}`
                    //             // );
                    //             console.log(user.default_account_id);
                    //         },
                    //         onMouseLeave: () => {
                    //             setHoverID();
                    //         },
                    //     },
                    // }}
                    checkboxSelection
                    rows={missions === undefined ? [] : missions}
                    loading={missions === undefined}
                    columns={completed_columns}
                />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    // mt={2}
                    mb={3}
                >
                    <Box>
                        <Button
                            variant="outlined"
                            color="success"
                            // type="submit"
                            onClick={handleGetBill}
                        >
                            结算
                        </Button>
                    </Box>
                    <Box>
                        {/* <Button
                            variant="outlined"
                            disableElevation
                            color="success"
                            onClick={handleSelected}
                            sx={{ mr: 2 }}
                        >
                            {keyword}选中
                        </Button> */}
                        <Button
                            variant="contained"
                            disableElevation
                            color="success"
                            onClick={handleAll}
                            // color="primrary"
                        >
                            结清所有
                        </Button>
                    </Box>
                </Box>
                <DataGrid
                    autoHeight
                    checkboxSelection
                    sx={{ width: '50%'}}
                    rows={payment === undefined ? [] : payment}
                    loading={missions === undefined}
                    columns={payment_col}
                />
            </Box>
        </Body>
    );
};

export default Paying;
