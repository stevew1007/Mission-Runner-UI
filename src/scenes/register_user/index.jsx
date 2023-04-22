import {
    Box,
    Typography,
    useTheme,
    styled,
    Link,
    AppBar,
    Toolbar,
    IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useGlobal } from "../../contexts/GlobalProvider";
import RegUserForm from "./reg_user_form";
import FlashMessage from "../../components/FlashMessage";

const StyledContent = styled("div")(({ theme }) => ({
    maxWidth: 480,
    margin: "auto",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(12, 0),
}));

const RegisterUserPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { toggleMode } = useGlobal();

    return (
        <Box>
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
                            <Link underline="none">
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
                            <IconButton onClick={() => toggleMode()}>
                                {theme.palette.mode === "dark" ? (
                                    <DarkModeOutlinedIcon />
                                ) : (
                                    <LightModeOutlinedIcon />
                                )}
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            <StyledContent>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    注册
                </Typography>

                <Typography variant="body2" sx={{ mt: "2px", mb: 2 }}>
                    已有账号？
                    <Link variant="subtitle2" href="/login">登录</Link>
                </Typography>
                <FlashMessage/>
                <RegUserForm/>
            </StyledContent>
        </Box>
    );
};

export default RegisterUserPage;
