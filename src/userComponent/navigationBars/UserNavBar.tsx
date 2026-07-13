import { Link } from "react-router-dom";
import { Box, Button, Flex, Menu, Portal, Spacer } from "@chakra-ui/react";
import { useUser } from "../../context/UserContext";
import { signOut } from "../../functions/otherFunctions";

export const UserNavBar = () => {
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
                                            {user?.userName?.toLocaleUpperCase()}
                                        </Button>
                                    </Menu.Trigger>
                                    <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content>
                                            <Menu.Item value="userDashboard">
                                                <Link to={"/userDashboard"}>Dashboard</Link>
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
                                            <Menu.Item value="profile">
                                                <Link to={"/profile"}>Profile</Link>
                                            </Menu.Item>
                                            <Menu.Item value="sign out" onClick={() => signOut(updateUser(null))}>
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