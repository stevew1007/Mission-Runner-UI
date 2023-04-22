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

const StyledContent = styled("div")(({ theme }) => ({
    maxWidth: 400,
    margin: "auto",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(12, 0),
}));

const Invalid = () => {
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
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                   HTTP 404 找不到页面
                </Typography>
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                    
                </Typography>
            </StyledContent>
        </Box>
    );
};

export default Invalid;
