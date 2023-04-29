import { Box, Chip, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Body from "../../components/Body";
import { useGlobal } from "../../contexts/GlobalProvider";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserProvider";
import { created_field, expired_field, galaxy_field, id_field, title_field } from "../../data/columnsFieldSetting";

const Inprogress = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { api } = useGlobal();
    const { user } = useUser();
    const [runned, setRunned] = useState();
    const [published, setPublished] = useState();
    useEffect(() => {
        (async () => {
            let response = await api.get("/missions/runned");
            if (response.ok) {
                const results = await response.body;
                // console.log(results.data);
                let active_mission = results.data.filter(
                    (mission) => mission.status != "done"
                );
                // console.log('paid_mission::: ', paid_mission);
                setRunned(active_mission);
                // console.log('runned::: ', active_mission);
            } else {
                setRunned(null);
            }
            response = await api.get("/missions/published");
            if (response.ok) {
                const results = await response.body;
                // console.log(results.data);
                let active_mission = results.data.filter(
                    (mission) => mission.status != "done"
                );
                // console.log('paid_mission::: ', paid_mission);
                setPublished(active_mission);
                // console.log('published::: ', results.data, active_mission);
            } else {
                setPublished(null);
            }
        })();
    }, [api, user]);

    const col = [
        id_field,
        // name_field,
        title_field,
        {
            field: "publisher",
            headerName: "发布者",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { publisher } }) => {
                // console.log(mission_id);
                return <Box>{publisher.owner.username}</Box>;
            },
        },
        {
            field: "runner",
            headerName: "打手",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { runner } }) => {
                // console.log(runner);
                return (
                    runner === null?
                    <Box>--</Box>: <Box>{runner.username}</Box>
                );
            },
        },
        galaxy_field,
        created_field,
        expired_field,
        {
            field: "bounty",
            headerName: "打手费",
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

    return (
        <Body topbar={true} title="进行中" subtitle="卧槽, 得一个月tm刷4333个点">
            {(published != undefined && published.length > 0) && <Typography variant="h7">我发布的任务：</Typography>}
            {(published != undefined && published.length > 0) && <Box
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
                    checkboxSelection
                    rows={published === undefined?[]:published}
                    columns={col}
                />
            </Box>}
            {(runned != undefined && runned.length > 0) && <Typography variant="h7">我接受的任务：</Typography>}
            {(runned != undefined && runned.length > 0) && <Box
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
                    checkboxSelection
                    rows={runned === undefined?[]:runned}
                    columns={col}
                />
            </Box>}
        </Body>
    );
};

export default Inprogress;
