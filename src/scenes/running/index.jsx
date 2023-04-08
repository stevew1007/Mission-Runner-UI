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

const Running = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Body topbar={true} title="接受任务" subtitle="点多，速来">
            <MissionMatcher 
                keyword="接受" 
                identified={mockDataTeam} 
                cannotid={mockDataTeam}
                />
        </Body>
    );
};

export default Running;
