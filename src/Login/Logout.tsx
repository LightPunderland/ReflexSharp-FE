import { useEffect } from "react";
import { Navigate } from "react-router-dom";

interface LogoutProps {

    onLogout: () => void;

}

const Logout: React.FC<LogoutProps> = ({ onLogout }) => {

    useEffect(() => {
        onLogout();
    }, [onLogout])
    return <Navigate to="/" replace />;

};

export default Logout;
