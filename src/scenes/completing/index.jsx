import { Box, Typography, TextField, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import Body from "../../components/Body";
import MissionMatcher from "../../components/MissionMatcher";

const Completeing = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Body topbar={true} title="确认完成" subtitle="在等宝贝打手打完再来一波">
            <MissionMatcher 
                keyword="完成" 
                identified={mockDataTeam} 
                // cannotid={mockDataTeam}
            />
        </Body>
    );
};

export default Completeing;