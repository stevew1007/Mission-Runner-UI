import {
    Box,
    Typography,
    useTheme,
    styled,
    Menu,
    Button,
    alpha,
    MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Body from "../../components/Body";
import { useEffect, useState } from "react";
import { useGlobal } from "../../contexts/GlobalProvider";
import moment from "moment";
import { useUser } from "../../contexts/UserProvider";
import { useFlash } from "../../contexts/FlashProvider";
import { KeyboardArrowDown } from "@mui/icons-material";
// import FlashMessage from "../../components/FlashMessage";

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === "light"
                ? "rgb(55, 65, 81)"
                : theme.palette.grey[300],
        boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "& .MuiSvgIcon-root": {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            "&:active": {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                ),
            },
        },
    },
}));

const AdminSetRole = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user, toggleUpdateUser } = useUser();
    const { api } = useGlobal();
    const [users, setUsers] = useState();
    const flash = useFlash();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        // console.log(event);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    // console.log(users)

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

    const TranslateRole = (role) => {
        switch (role) {
            case "mission_publisher":
                return { label: "老板", color: "warning" };
            case "mission_runner":
                return { label: "打手", color: "success" };
            case "admin":
                return { label: "管理", color: "success" };
        }
    };

    const handleSetRole = async (id, value) => {
        // console.log(id, value);
        let tosend = {
            role: value,
        };
        const response = await api.put(`/admin/users/${id}/setrole`, tosend);
        if (response.ok) {
            flash("设置成功", "success", 10);
            toggleUpdateUser();
        } else {
            flash(`设置失败 HTTP ${response.status}`, "error", 10);
        }
    };

    const handlePaginationUpdate = async (params) => {
        // console.log(params);
        // const response = getAccountInfo(params.pageSize, params.page * params.pageSize);
        const response = await api.get("/admin/users", {
            limit: params.pageSize,
            offset: params.page * params.pageSize,
        });
        if (response.ok) {
            const results = await response.body;
            setUsers(results.data);
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
            const response = await api.get("/admin/users", {
                limit: paginationCtrl.pageSize,
                offset: paginationCtrl.page * paginationCtrl.pageSize,
            });
            if (response.ok) {
                const results = await response.body;
                setUsers(results.data);
                setPaginationModel(results.pagination);
            } else {
                setUsers(null);
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
            field: "username",
            headerName: "用户名",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "im_number",
            headerName: "QQ号",
            // type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
            editable: true,
        },
        {
            field: "email",
            headerName: "邮箱",
            // type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
            editable: true,
        },
        {
            field: "birthday",
            headerName: "注册时间",
            // type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { birthday } }) => {
                return <Box>{moment(birthday).fromNow()}</Box>;
            },
        },
        {
            field: "last_seen",
            headerName: "上次登录",
            // type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { last_seen } }) => {
                return <Box>{moment(last_seen).fromNow()}</Box>;
            },
        },
        {
            field: "role",
            headerName: "权限",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { id, role } }) => {
                // console.log(anchorEl ? anchorEl.id : null);
                let target_role = anchorEl
                    ? anchorEl.name
                    : "mission_publisher";
                return (
                    <div>
                        <Button
                            id={id}
                            name={role}
                            aria-controls={open ? "edit_role_menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            variant="outlined"
                            disableElevation
                            onClick={handleClick}
                            endIcon={<KeyboardArrowDown />}
                            color={TranslateRole(role).color}
                            disabled={user.id == id}
                        >
                            {TranslateRole(role).label}
                        </Button>
                        <StyledMenu
                            id="edit_role_menu"
                            MenuListProps={{
                                "aria-labelledby": "demo-customized-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            {target_role != "mission_publisher" && (
                                <MenuItem
                                    onClick={() =>
                                        handleSetRole(
                                            anchorEl.id,
                                            "mission_publisher"
                                        )
                                    }
                                    disableRipple
                                >
                                    老板
                                </MenuItem>
                            )}
                            {target_role != "mission_runner" && (
                                <MenuItem
                                    onClick={() =>
                                        handleSetRole(
                                            anchorEl.id,
                                            "mission_runner"
                                        )
                                    }
                                    disableRipple
                                >
                                    打手
                                </MenuItem>
                            )}
                            {target_role != "admin" && (
                                <MenuItem
                                    onClick={() =>
                                        handleSetRole(anchorEl.id, "admin")
                                    }
                                    disableRipple
                                >
                                    管理
                                </MenuItem>
                            )}
                        </StyledMenu>
                    </div>
                );
            },
        },
    ];

    return (
        <Body topbar={true} title="账号激活" subtitle="这个账号谁的啊">
            <Typography variant="body2" sx={{ mt: "2px", mb: 2 }}>
                {/* {accounts === null ?  : ""} */}
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
                    rows={users === undefined ? [] : users}
                    loading={users === undefined}
                    columns={columns}
                    paginationMode="server"
                    paginationModel={paginationCtrl}
                    pageSizeOptions={[10, 25, 50, 100]}
                    onPaginationModelChange={handlePaginationUpdate}
                    rowCount={
                        paginationModel.total === undefined
                            ? 0
                            : paginationModel.total
                    }
                />
            </Box>
        </Body>
    );
};

export default AdminSetRole;
