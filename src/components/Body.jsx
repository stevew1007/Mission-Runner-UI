import { Box } from "@mui/material";
import Topbar from "../scenes/global/Topbar";
import Header from "./Header";

const Body = ({ topbar, title, subtitle, children }) => {
    return (
        <>
            {topbar ? (
                <Topbar>
                    <Box>
                        <Header title={title} subtitle={`“${subtitle}”`} />
                        {children}
                    </Box>
                </Topbar>
            ) : (
                <Box>
                    <Header title={title} subtitle={`“${subtitle}”`} />
                    {children}
                </Box>
            )}
        </>
    );
};

export default Body;
