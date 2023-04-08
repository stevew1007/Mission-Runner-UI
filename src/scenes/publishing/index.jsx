import { Box, Typography, TextField, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Body from "../../components/Body";
import MissionMatcher from "../../components/MissionMatcher";

const Publishing = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Body topbar={true} title="发布任务" subtitle="求求老板们快去做点吧">
            <MissionMatcher keyword="发布" identified={mockDataTeam} />
        </Body>
    );
};

export default Publishing;
