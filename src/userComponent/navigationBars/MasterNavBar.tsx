import { Link } from "react-router-dom"
import { Box, Button, Flex, Menu, Portal, Spacer } from "@chakra-ui/react";
import { useUser } from "../../context/UserContext";
import { signOut } from "../../functions/otherFunctions";

export const MasterNavBar = () => {
    const { user, updateUser } = useUser();

    return (
        <Box as={"nav"}>
            <Flex>
                <Box>
                    <Link to={"/"}>
                    Home</Link>
                </Box>
                <Spacer />
                <Box>
                    {user ? (
                        <Box>
                            <Menu.Root>
                                <Menu.Trigger asChild>
                                    <Button>
                                        {user?. userName?.toLocaleUpperCase()}
                                    </Button>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content>
                                            <Menu.Item value="masterDashboard">
                                                <Link to={"/masterDashboard"}>Dashboard</Link>
                                            </Menu.Item>
                                            <Menu.Item value="practice">
                                                <Link to={"/practice"}>Start Practice</Link>
                                            </Menu.Item>
                                            <Menu.Item value="/randomPractice">
                                                <Link to={"/randomPractice"}>Start similation practice</Link>
                                            </Menu.Item>
                                            <Menu.Item value="/practiceHistory">
                                                <Link to={"/practiceHistory"}>View practice history</Link>
                                            </Menu.Item>
                                            <Menu.Item value="uploadPastQuestion">
                                                <Link to={"/uploadPastQuestion"}>Upload past question</Link>
                                            </Menu.Item>
                                            <Menu.Item value="deletePastQuestion">
                                                <Link to={"/deletePastQuestion"}>Delete past question</Link>
                                            </Menu.Item>
                                            <Menu.Item value="upgrade">
                                                <Link to={"/upgradeRequests"}>Upgrades</Link>
                                            </Menu.Item>
                                            <Menu.Item value="userManagement">
                                                <Link to={"/userManagement"}>Manage Users</Link>
                                            </Menu.Item>
                                            <Menu.Item value="profile">
                                                <Link to={"/profile"}>Profile</Link>
                                            </Menu.Item>
                                            <Menu.Item value="sign out" onClick={() =>signOut(updateUser(null))}>
                                                Log out
                                            </Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                        </Box>
                    ) : (
                        <Link to={"/signin"}>
                            Sign in
                        </Link>
                    )}
                </Box>
            </Flex>
        </Box>
    );
}