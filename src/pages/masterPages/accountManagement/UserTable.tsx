import { useEffect, useState } from "react";
import { Badge, Box, Button, Flex, Heading, HStack, Image, Spinner, Stack, Table, Text } from "@chakra-ui/react";
import { dateFormat } from "../../../functions/otherFunctions";
import { deleteUser, getUsers, suspendAccount } from "../../../functions/userFunction";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { useColorModeValue } from "../../../components/ui/color-mode";
import type { MultiUserForm, UserRoleForm } from "../../../userComponent/schemas/user.schema";
import { useTitle } from "../../../context/TitleContext";

export const UserTable = ({ 
    userType, 
    pageHeader, 
    pageInfo, 
    data
}: { 
    userType: UserRoleForm; 
    pageHeader: string;
    pageInfo: string;
    data: MultiUserForm;
}) => {
  useTitle(`${pageHeader} - Account Management`);

    const navigate = useNavigate();
    const { user } = useUser();
    const selectedUserType = useParams();
    userType = selectedUserType.userType as UserRoleForm || userType;

    const [userData, setUserData] = useState<MultiUserForm>(data || []);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!userType) return;
        setIsLoading(true);
        setUserData([]);
getUsers(userType)
        .then(data => {
            data && setUserData(data)
        }).finally(
            () => setIsLoading(false)
        );
    }, [userType]);

    if (isLoading) {
        return (
        <Box>
            <Spinner />
            <Text> Loading data. Please wait</Text>
        </Box>
        );
    }

    return (
  <Box p={6}>
    {/* Header Section */}
    <Stack gap={2} mb={6}>
      <Heading size="lg">{pageHeader}</Heading>
      <Text color="gray.500">{pageInfo}</Text>
    </Stack>

    {/* Loading State */}
    {isLoading ? (
      <Flex justify="center" align="center" py={10}>
        <Spinner size="lg" />
      </Flex>
    ) : userData.length ? (
      <Box overflowX="auto" borderRadius="lg" borderWidth="1px">
        <Table.Root>
          <Table.Header>
            <Table.Row bg={useColorModeValue("gray.50", "gray.700")}>
              <Table.ColumnHeader>Profile</Table.ColumnHeader>
              <Table.ColumnHeader>User</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Role</Table.ColumnHeader>
              <Table.ColumnHeader>Joined</Table.ColumnHeader>

              {userType !== "user" && (
                <Table.ColumnHeader>Since</Table.ColumnHeader>
              )}

              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {userData.map((u) => (
              <Table.Row key={u.id} _hover={{ bg: "gray.50" }}>
                {/* Profile */}
                <Table.Cell>
                  {u.profilePicture ? (
                    <Image
                      src={u.profilePicture}
                      boxSize="40px"
                      borderRadius="full"
                      objectFit="cover"
                    />
                  ) : (
                    <Text fontSize="sm" color="gray.400">
                      No image
                    </Text>
                  )}
                </Table.Cell>

                {/* Username */}
                <Table.Cell fontWeight="medium">
                  {u.userName}
                </Table.Cell>

                {/* Email */}
                <Table.Cell color="gray.600">
                  {u.email}
                </Table.Cell>

                {/* Role */}
                <Table.Cell>
                  <Badge colorScheme="purple">
                    {u.role}
                  </Badge>
                </Table.Cell>

                {/* Created */}
                <Table.Cell fontSize="sm">
                  {dateFormat(u.created_date!)}
                </Table.Cell>

                {/* Optional role date */}
                {userType !== "user" && (
                  <Table.Cell fontSize="sm">
                    {dateFormat(u.modified_date!)}
                  </Table.Cell>
                )}

                {/* Actions */}
                <Table.Cell>
                  <HStack gap={2} flexWrap="wrap">
                    {/* admin users cannot suspend other admins */}
                    {user?.role === "admin" && u.role !== "admin" && (
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        onClick={() =>
                          suspendAccount(u.id!, u.userName!)
                        }
                      >
                        Suspend Account
                      </Button>
                    )}

                    {/* master users cannot suspend other masters */}
                    {user?.role === "master" && u.role !== "master" && (
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        onClick={() =>
                          suspendAccount(u.id!, u.userName!)
                        }
                      >
                        Suspend Account
                      </Button>
                    )}

                    {/* only over all user can suspend masters */}
                    {user?.id === 1 && u.role === "master" && (
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        onClick={() =>
                          suspendAccount(u.id!, u.userName!)
                        }
                      >
                        Suspend Master Account
                      </Button>
                    )}

                    {/* only masters can delete user and admin accounts */}
                    {user?.role === "master" && u.role !== "master" && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() =>
                          deleteUser(u.id!, u.userName!)
                        }
                      >
                        Delete Account
                      </Button>
                    )}

                    {/* only an over all master can delete other master accounts */}
                    {u.role === "master" && user?.id === 1 && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() =>
                          deleteUser(u.id!, u.userName!)
                        }
                      >
                        Delete Master Account
                      </Button>
                    )}

                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() =>
                        navigate(`/moreInfo/${u.id}`)
                      }
                    >
                      More Info
                    </Button>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    ) : (
      <Box textAlign="center" py={10}>
        <Text color="gray.500">
          No {userType} found.
        </Text>
      </Box>
    )}
  </Box>
);
}