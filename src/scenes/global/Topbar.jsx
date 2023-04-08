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
} from "@mui/material";
import { tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { NavLink } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import { useGlobal } from "../../contexts/GlobalProvider";
import { setMode, setSideBar } from "../../state";

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
                        <Link 
                            underline="none"
                            onClick={() => toggleSidebar()}
                        >
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
                        <IconButton onClick={() => dispatch(setMode())}>
                            {theme.palette.mode === "dark" ? (
                                <DarkModeOutlinedIcon />
                            ) : (
                                <LightModeOutlinedIcon />
                            )}
                        </IconButton>
                        <IconButton>
                            <NotificationsOutlinedIcon />
                        </IconButton>
                        <IconButton>
                            <SettingsOutlinedIcon />
                        </IconButton>
                        <IconButton>
                            <PersonOutlineOutlinedIcon />
                        </IconButton>
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
                        数据
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
                </Box>
            </Drawer>
            <Main open={sidebarOpened}>{children}</Main>
        </Box>
    );
};

export default Topbar;
