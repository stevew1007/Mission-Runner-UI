import { Box, Chip, Tooltip, Typography, useTheme } from "@mui/material";
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
    const [paginationModel, setPaginationModel] = useState({
        limit: undefined,
        offset: undefined,
        count: undefined,
        total: undefined,
    });
    const [paginationCtrl, setPaginationCtrl] = useState({
        page: 0,
        pageSize: 50,
    });
    const flash = useFlash();

    const handlePaginationUpdate = async (params) => {
        // console.log(params);
        // const response = getAccountInfo(params.pageSize, params.page * params.pageSize);
        const response = await api.get("/admin/accounts", {
            limit: params.pageSize,
            offset: params.page * params.pageSize,
        });
        if (response.ok) {
            const results = await response.body;
            setAccounts(results.data);
            // setPaginationModel(results.pagination);
            {
                paginationModel != results.pagination &&
                    setPaginationModel(results.pagination);
            }
            setPaginationCtrl({
                page: params.page,
                pageSize: params.pageSize,
            });
        } else {
            flash(`更新分页失败 HTTP ${response.status}`, "error", 10);
        }
    };

    useEffect(() => {
        (async () => {
            const response = await api.get("/admin/accounts", {
                limit: paginationCtrl.pageSize,
                offset: paginationCtrl.page * paginationCtrl.pageSize,
            });
            if (response.ok) {
                const results = await response.body;
                setAccounts(results.data);
                setPaginationModel(results.pagination);
                // console.log(results.data);
            } else {
                setAccounts(null);
            }
        })();
    }, [api, user, paginationCtrl, setPaginationCtrl]);

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
        <Body
            topbar={true}
            title="激活管理"
            subtitle="哪个敢惹我，我就让他打不成燃烧"
        >
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
                    rows={
                        accounts === undefined || accounts === null
                            ? []
                            : accounts
                    }
                    loading={accounts === undefined}
                    paginationMode="server"
                    paginationModel={paginationCtrl}
                    pageSizeOptions={[10, 25, 50, 100]}
                    onPaginationModelChange={handlePaginationUpdate}
                    rowCount={
                        paginationModel.total === undefined
                            ? 0
                            : paginationModel.total
                    }
                    columns={columns}
                />
            </Box>
        </Body>
    );
};

export default AdminActivateAccount;
