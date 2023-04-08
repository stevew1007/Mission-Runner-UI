import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme"
import PropTypes from 'prop-types';

const Header = ({title, subtitle}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    return (
        <Box mb="20px">
            <Typography 
                variant="h2" 
                color={colors.grey[100]} 
                fontWeight="bold"
                sx={{ mb: "5px" }}
            >
                {title}
            </Typography>
            <Typography
                variant="h5" 
                color={colors.greenAccent[300]} 
            >
                {subtitle}
            </Typography>
        </Box>
    )
}

Header.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string
}

export default Header

