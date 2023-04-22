
import { mockDataTeam } from "../../data/mockData";

import Body from "../../components/Body";
import MissionMatcher from "../../components/MissionMatcher";

const Publishing = () => {
    // const theme = useTheme();
    // const colors = tokens(theme.palette.mode);

    return (
        <Body topbar={true} title="发布任务" subtitle="求求老板们快去做点吧">
            <MissionMatcher keyword="发布" identified={mockDataTeam} />
        </Body>
    );
};

export default Publishing;
