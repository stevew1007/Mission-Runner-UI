import { useLocation, Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import PropTypes from 'prop-types';

export default function PrivateRoute({ children }) {
    const { user } = useUser();
    const location = useLocation();

    if (user === undefined) {
        const url = location.pathname + location.search + location.hash;
        return <Navigate to="/login" state={{ next: url }} />;
    } else if (user) {
        return children;
    } else {
        const url = location.pathname + location.search + location.hash;
        return <Navigate to="/dashboard" state={{ next: url }} />;
    }
}

PrivateRoute.propTypes = {
    children: PropTypes.any
}
