import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../../context/UserContext"

export const MasterPrivateRoute = () => {
    const { user } = useUser();
    return user?.role === "master" ? <Outlet /> : <Navigate to={"/signin"} />;
}