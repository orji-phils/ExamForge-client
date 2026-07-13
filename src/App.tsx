import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SocketConnection } from "./context/SocketConnection";
import { Toaster } from "react-hot-toast";
import { SelectNav } from "./SelectNav";
import { Home } from "./pages/home";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { SendResetToken } from "./pages/SendPasswordToken";
import { UserUpdate } from "./pages/UserUpdate";
import { ActivateAccount } from "./pages/ActivateAccount";
import { ResetPassword } from "./pages/ResetPassword";
import { MasterPrivateRoute } from "./userComponent/privateRoutes/MasterPrivateRoute";
import { MasterDashboard } from "./pages/masterPages/MasterDashboard";
import { UpgradeRequests } from "./pages/masterPages/upgrades/UpgradeRequests";
import { UserManagement } from "./pages/masterPages/accountManagement/UserManagement";
import { AdminPrivateRoute } from "./userComponent/privateRoutes/AdminPrivateRoute";
import { AdminDashboard } from "./pages/adminPages/AdminDashboard";
import { UserPrivateRoute } from "./userComponent/privateRoutes/UserPrivateRoute";
import { UserDashboard } from "./pages/userPages/UserDashboard";
import { AdminMasterPrivateRoute } from "./userComponent/privateRoutes/AdminMasterPrivateRoute";
import { UploadPastQuestion } from "./pages/adminPages/UploadPastQuestion";
import { DeletePastQuestion } from "./pages/adminPages/DeletePastQuestion";
import { MoreInfo } from "./pages/masterPages/accountManagement/MoreInfo";
import { UserTable } from "./pages/masterPages/accountManagement/UserTable";
import { PrivateRoute } from "./userComponent/privateRoutes/PrivateRoute";
import { Practice } from "./pages/practicePages/Practice";
import { PracticeHistory } from "./pages/practicePages/PracticeHistory";
import { RandomPractice } from "./pages/practicePages/RandomPractice";
import { Profile } from "./pages/Profile";
import { UserProvider } from "./context/UserContext";

export default function App () {
  return (
    <BrowserRouter>
      <UserProvider>
        <SocketConnection/>
        <Toaster position="bottom-right" />
        <SelectNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<SendResetToken />} />
          <Route path="/userUpdate" element={<UserUpdate />} />
          <Route path="/activateAccount" element={<ActivateAccount />} />
          <Route path="/resetPassword" element={<ResetPassword />} />

          <Route element={<MasterPrivateRoute />}>
            <Route path="/masterDashboard" element={<MasterDashboard />} />
            <Route path="/upgradeRequests" element={<UpgradeRequests />} />
            <Route path="/userManagement" element={<UserManagement />} />
          </Route>

          <Route element={<AdminPrivateRoute />}>
            <Route path="/adminDashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<UserPrivateRoute />}>
            <Route path="/userDashboard" element={<UserDashboard />} />
          </Route>

          <Route element={<AdminMasterPrivateRoute />}>
            <Route path="/uploadPastQuestion" element={<UploadPastQuestion />} />
            <Route path="/deletePastQuestion" element={<DeletePastQuestion />} />
            <Route path="/moreInfo/:userId" element={<MoreInfo />} />
            <Route path="/userTable/:userType" element={<UserTable userType="" pageHeader="" pageInfo="" data={[]} />} />
          </Route>

          <Route element={<PrivateRoute />}>
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:recordId" element={<Practice />} />
          <Route path="/practiceHistory" element={<PracticeHistory />} />
          <Route path="/randomPractice" element={<RandomPractice />} />
          <Route path="/randomPractice/:recordId" element={<RandomPractice />} />
          <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}