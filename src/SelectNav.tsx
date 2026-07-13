import { useUser } from "./context/UserContext"
import { AdminNavBar } from "./userComponent/navigationBars/AdminNavBar";
import { MasterNavBar } from "./userComponent/navigationBars/MasterNavBar";
import { UserNavBar } from "./userComponent/navigationBars/UserNavBar";

export const SelectNav = () => {
    const { user } = useUser();

    if (!user) {
        return null;
    }
    switch (user?.role) {
        case "master":
            return <MasterNavBar />
            break;

        case "admin":
            return <AdminNavBar />
            break;

        case "user":
            return <UserNavBar />
            break;
    
        default:
            return null;
            break;
    }
}