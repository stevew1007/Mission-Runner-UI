import { useUser } from "../contexts/UserProvider";
import PropTypes from 'prop-types';
import { useFlash } from "../contexts/FlashProvider";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const { user } = useUser();
    const flash = useFlash();

    if (user.role != "admin") {
        flash("您没有权限访问该页面", "error", 10);
        return <Navigate to="/dashboard"/>;
    } else {
        return children;
    }
}

AdminRoute.propTypes = {
    children: PropTypes.any
}