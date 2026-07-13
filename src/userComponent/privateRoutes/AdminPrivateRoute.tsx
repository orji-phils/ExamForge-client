import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../../context/UserContext"

export const AdminPrivateRoute = () => {
    const { user } = useUser();
    return user?.role === "admin" ? <Outlet /> : <Navigate to={"/signin"} />;
}
