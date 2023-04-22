import { useUser } from "../contexts/UserProvider";
import PropTypes from 'prop-types';
import { useFlash } from "../contexts/FlashProvider";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const { user } = useUser();
    const flash = useFlash();

    if (user.role === "admin") {
        // Admin will have access as well
        return children;
    } else if (user.role === "mission_runner") {
        return children
    } else {
        flash("您没有权限访问该页面", "error", 10);
        return <Navigate to="/dashboard"/>;
    }
}

AdminRoute.propTypes = {
    children: PropTypes.any
}