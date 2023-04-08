import { Box } from "@mui/material";
import Topbar from "../scenes/global/Topbar";
import Header from "./Header";
import PropTypes from 'prop-types';

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

Body.propTypes = {
    topbar: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.any
}

export default Body;
