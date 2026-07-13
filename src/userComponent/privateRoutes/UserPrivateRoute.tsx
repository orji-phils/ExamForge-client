import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../../context/UserContext"

export const UserPrivateRoute = () => {
    const { user } = useUser();
    return user?.role === "user" ? <Outlet /> : <Navigate to={"/signin"} />;
}