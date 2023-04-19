import {
    Box,
    IconButton,
    useTheme,
    Typography,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Divider,
    styled,
    Link,
    Tooltip,
    Avatar,
    Menu,
    MenuItem,
} from "@mui/material";
import { tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { NavLink } from "react-router-dom";
import { useGlobal } from "../../contexts/GlobalProvider";
import { useUser } from "../../contexts/UserProvider";
import PropTypes from "prop-types";
import { useState } from "react";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: `${drawerWidth}px`,
        }),
    })
);

const Topbar = ({ children }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { toggleMode, sidebarOpened, toggleSidebar } = useGlobal();
    const { user, logout } = useUser();
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: colors.grey[900],
                    }}
                >
                    {/* Titles */}
                    <Box display="flex" alignItems="center">
                        <Link underline="none" onClick={() => toggleSidebar()}>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                mr={2}
                                color={colors.grey[100]}
                            >
                                兔子基地
                            </Typography>
                        </Link>
                    </Box>

                    {/* Icons */}
                    <Box display="flex">
                        <Box
                            display="flex"
                            backgroundColor={colors.primary[400]}
                            borderRadius="3px"
                            marginRight={2}
                        >
                            <InputBase
                                sx={{ ml: 2, flex: 1 }}
                                placeholder="Search"
                            />
                            <IconButton type="button" sx={{ p: 1 }}>
                                <SearchIcon />
                            </IconButton>
                        </Box>
                        <IconButton onClick={() => toggleMode()}>
                            {theme.palette.mode === "dark" ? (
                                <DarkModeOutlinedIcon />
                            ) : (
                                <LightModeOutlinedIcon />
                            )}
                        </IconButton>
                        <IconButton>
                            <NotificationsOutlinedIcon />
                        </IconButton>
                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                // sx={{ ml: 2 }}
                                aria-controls={
                                    open ? "account-menu" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: user.background,
                                    }}
                                >
                                    {user.username != undefined
                                        ? user.username[0].toUpperCase()
                                        : ""}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: "visible",
                                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                    mt: 1.5,
                                    "& .MuiAvatar-root": {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    "&:before": {
                                        content: '""',
                                        display: "block",
                                        position: "absolute",
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: "background.paper",
                                        transform:
                                            "translateY(-50%) rotate(45deg)",
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{
                                horizontal: "right",
                                vertical: "top",
                            }}
                            anchorOrigin={{
                                horizontal: "right",
                                vertical: "bottom",
                            }}
                        >
                            <MenuItem>
                                <SettingsOutlinedIcon />
                                <Typography ml={1}>Setting</Typography>
                            </MenuItem>
                            <MenuItem onClick={logout}>
                                <LogoutOutlinedIcon />
                                <Typography ml={1}>Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "inherit",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={sidebarOpened}
            >
                <Box>
                    <Toolbar />
                    <Typography variant="h6" mt={2} ml={2}>
                        通用
                    </Typography>
                    <List sx={{ ml: 2 }}>
                        <ListItem disablePadding>
                            <ListItemButton component={NavLink} to="/dashboard">
                                统计数据
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to="/inprogress"
                            >
                                进行中
                            </ListItemButton>
                        </ListItem>
                        <ListItemButton
                            component={NavLink}
                            to="/register_account"
                        >
                            登记角色

                        </ListItemButton>
                    </List>
                    <Divider />
                    <Typography variant="h6" mt={2} ml={2}>
                        老板
                    </Typography>
                    <List sx={{ ml: 2 }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to="/publishing"
                            >
                                发布任务
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>费用结算</ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={NavLink} to="/account">
                                声望号
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <Typography variant="h6" mt={2} ml={2}>
                        打手
                    </Typography>
                    <List sx={{ ml: 2 }}>
                        <ListItem disablePadding>
                            <ListItemButton component={NavLink} to="/running">
                                接受任务
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to="/completing"
                            >
                                确认完成
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>账目收讫</ListItemButton>
                        </ListItem>
                    </List>
                    <Typography variant="h6" mt={2} ml={2}>
                        临时
                    </Typography>
                    {/* <List sx={{ ml: 2 }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to="/register_account"
                            >
                                注册角色
                            </ListItemButton>
                        </ListItem>
                    </List> */}
                </Box>
            </Drawer>
            <Main open={sidebarOpened}>{children}</Main>
        </Box>
    );
};

export default Topbar;

Topbar.propTypes = {
    children: PropTypes.any,
};
