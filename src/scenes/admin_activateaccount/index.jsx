import { Box, Chip, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Body from "../../components/Body";
import { useEffect, useState } from "react";
import { useGlobal } from "../../contexts/GlobalProvider";
import moment from "moment";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserProvider";
import { useFlash } from "../../contexts/FlashProvider";
// import FlashMessage from "../../components/FlashMessage";

const AdminActivateAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user, toggleUpdateUser } = useUser();
    const { api } = useGlobal();
    const [accounts, setAccounts] = useState();
    const [hoverID, setHoverID] = useState();
    const flash = useFlash();

    useEffect(() => {
        (async () => {
            const response = await api.get("/accounts");
            if (response.ok) {
                const results = await response.body;
                setAccounts(results.data);
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
            cellClassName: "name-column--cell",
        },
        {
            field: "filler",
            flex: 2,
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
            renderCell: ({ row: { activated } }) => {
                return (
                    <Chip
                        label={activated === true ? "已激活" : "未激活"}
                        color={activated === true ? "success" : undefined}
                        variant={activated === true ? undefined : "outlined"}
                    ></Chip>
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
        <Body topbar={true} title="账号登记" subtitle="又一位做点大老板出现咯">
            {/* <Typography variant="h7">我接受的任务：</Typography> */}
            <Typography variant="body2" sx={{ mt: "2px", mb: 2 }}>
                {/* {accounts === null ?  : ""} */}

                {(accounts === undefined || accounts.length == 0) &&
                    "没有显示账号？"}
                <Typography variant="h7">
                    <Link variant="subtitle2" to="/register_account">
                        注册新账号
                    </Link>
                </Typography>
            </Typography>
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
