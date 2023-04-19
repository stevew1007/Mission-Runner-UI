import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import PropTypes from "prop-types";

export default function PublicRoute({ children }) {
    const { user } = useUser();

    if (user === undefined) {
        return null;
    } else if (user) {
        return <Navigate to="/" />;
    } else {
        return children;
    }
}

PublicRoute.propTypes = {
    children: PropTypes.any,
};
