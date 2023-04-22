import {
    Box,
    Chip,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Body from "../../components/Body";
import { useEffect, useState } from "react";
import { useGlobal } from "../../contexts/GlobalProvider";
import moment from "moment";
import { useUser } from "../../contexts/UserProvider";
import { useFlash } from "../../contexts/FlashProvider";


const AdminActivateAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user, toggleUpdateUser } = useUser();
    const { api } = useGlobal();
    const [accounts, setAccounts] = useState();
    const flash = useFlash();

    useEffect(() => {
        (async () => {
            const response = await api.get("/admin/accounts");
            if (response.ok) {
                const results = await response.body;
                setAccounts(results.data);
                // console.log(results.data);
            } else {
                setAccounts(null);
            }
        })();
    }, [api, user]);

    const columns = [
        {
            field: "id",
            headerName: "ID",
            headerAlign: "center",
            align: "center",
            flex: 0.5,
        },
        {
            field: "name",
            headerName: "账号名",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "owner",
            headerName: "所有者",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { owner } }) => {
                return <Typography>{owner.username}</Typography>;
            },
        },
        {
            field: "filler",
            headerName: "",
            flex: 1,
        },
        {
            field: "lp_point",
            headerName: "LP点",
            type: "number",
            headerAlign: "right",
            align: "right",
            flex: 1,
            editable: true,
        },
        {
            field: "activated",
            headerName: "激活状态",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { ...data } }) => {
                return (
                    <Tooltip
                        title={
                            data.activated ? "点击禁用此账户" : "点击激活此账号"
                        }
                    >
                        <div>
                            <Chip
                                id={data.id}
                                label={
                                    data.activated === true
                                        ? "已激活"
                                        : "未激活"
                                }
                                color={
                                    data.activated === true
                                        ? "success"
                                        : undefined
                                }
                                variant={
                                    data.activated === true
                                        ? undefined
                                        : "outlined"
                                }
                                onClick={() => {
                                    (async () => {
                                        const response = await api.post(
                                            `/admin/accounts/${data.id}/${
                                                data.activated === true
                                                    ? "deactivate"
                                                    : "activate"
                                            }`
                                        );
                                        if (response.ok) {
                                            flash("设置成功", "success", 10);
                                            toggleUpdateUser();
                                        } else {
                                            flash(
                                                `设置失败 HTTP ${response.status}`,
                                                "error",
                                                10
                                            );
                                        }
                                    })();
                                }}
                            />
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            field: "created",
            headerName: "登记时间",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { created } }) => {
                return <Box>{moment(created).fromNow()}</Box>;
            },
        },
    ];

    return (
        <Body topbar={true} title="激活管理" subtitle="哪个敢惹我，我就让他打不成燃烧">
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
                    rows={accounts === undefined ? [] : accounts}
                    loading={accounts === undefined}
                    columns={columns}
                />
            </Box>
        </Body>
    );
};

export default AdminActivateAccount;
