import { Box, Button, Heading, Image, Spinner, Table, Text } from "@chakra-ui/react";
import { dateFormat } from "../../../functions/otherFunctions";
import { useEffect, useState } from "react";
import { approveRequest, deleteRequest, getUpgradeRequests, rejectRequest, restoreAdmin, revokeAccess } from "../../../functions/upgradeFunctions";
import { useUser } from "../../../context/UserContext";
import type { MultiUpgradeForm, StatusForm } from "../../../userComponent/schemas/upgrades.schema";
import { useTitle } from "../../../context/TitleContext";

export const UpgradeTable = ({ 
    status,
    pageHeader,
    pageInfo,
    data,
}: { 
    status: StatusForm;
    pageHeader: string;
    pageInfo: string;
    data: MultiUpgradeForm;
}) => {
  const { user } = useUser();
  useTitle(`${pageHeader} - Account Management`);

  const [retrievedData, setRetrievedData] = useState<MultiUpgradeForm>(data || []);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setRetrievedData([]);

        getUpgradeRequests(status)
        .then(data => {
            data && setRetrievedData(data);
        }).finally(
            () => setIsLoading(false)
        );
    }, [status]);

    if (isLoading) {
        return (
            <Box>
                <Spinner />
                <Text> Loading data. Please wait</Text>
            </Box>
        );
    }

    return (
  <Box p={6} display="flex" flexDirection="column" gap={4}>
    {/* HEADER SECTION */}
    <Box>
      <Heading size="lg">{pageHeader}</Heading>
      <Text color="gray.500" mt={1}>
        {pageInfo}
      </Text>
    </Box>

    {/* TABLE OR EMPTY STATE */}
    {retrievedData.length ? (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflowX="auto"
        boxShadow="sm"
      >
        <Table.Root>
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader>Profile</Table.ColumnHeader>
              <Table.ColumnHeader>User</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Joined</Table.ColumnHeader>
              <Table.ColumnHeader>Requested</Table.ColumnHeader>

              {status !== "pending" && (
                <Table.ColumnHeader>
                  {status === "approved"
                    ? "Approved On"
                    : status === "revoked"
                    ? "Revoked On"
                    : "Rejected On"}
                </Table.ColumnHeader>
              )}

              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {retrievedData.map((data) => (
              <Table.Row
                key={data.userId}
                _hover={{ bg: "gray.50" }}
              >
                {/* PROFILE */}
                <Table.Cell>
                  {data.profilePicture ? (
                    <Image
                      src={data.profilePicture}
                      alt={`${data.userName}'s profile`}
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

                {/* USER */}
                <Table.Cell fontWeight="medium">
                  {data.userName}
                </Table.Cell>

                {/* EMAIL */}
                <Table.Cell color="gray.600">
                  {data.email}
                </Table.Cell>

                {/* JOINED */}
                <Table.Cell fontSize="sm">
                  {dateFormat(data.created_date)}
                </Table.Cell>

                {/* REQUESTED */}
                <Table.Cell fontSize="sm">
                  {dateFormat(data.request_date!)}
                </Table.Cell>

                {/* RESPONSE DATE */}
                {status !== "pending" && (
                  <Table.Cell fontSize="sm">
                    {dateFormat(data.response_date!)}
                  </Table.Cell>
                )}

                {/* STATUS */}
                <Table.Cell>
                  <Box
                    px={2}
                    py={1}
                    borderRadius="md"
                    bg={
                      data.status === "approved"
                        ? "green.100"
                        : data.status === "pending"
                        ? "yellow.100"
                        : data.status === "revoked"
                        ? "orange.100"
                        : "red.100"
                    }
                    color={
                      data.status === "approved"
                        ? "green.700"
                        : data.status === "pending"
                        ? "yellow.700"
                        : data.status === "revoked"
                        ? "orange.700"
                        : "red.700"
                    }
                    fontSize="sm"
                    textAlign="center"
                  >
                    {data.status}
                  </Box>
                </Table.Cell>

                {/* ACTIONS */}
                <Table.Cell>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {/* any master can approve or reject user upgrade request */}
                    {status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() =>
                            approveRequest(data.userId, data.userName)
                          }
                        >
                          Approve Request
                        </Button>

                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() =>
                            rejectRequest(data.userId, data.userName)
                          }
                        >
                          Reject Request
                        </Button>
                      </>
                    ) : status === "approved" && user?.role === "master" && data.role !== "master" && (
                      <Button
                        size="sm"
                        colorScheme="orange"
                        onClick={() =>
                          revokeAccess(data.userId, data.userName)
                        }
                      >
                        Revoke Access
                      </Button>
                    )}

                    {status === "revoked" && (
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() =>
                          restoreAdmin(data.userId, data.userName)
                        }
                      >
                        Restore to Admin
                        </Button>
                    )}

                    {user?.id === 1 && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => deleteRequest(data.userId, data.userName)}
                      >
                        Delete Request
                      </Button>
                    )}
                  </Box>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    ) : (
      <Box textAlign="center" py={10}>
        <Text color="gray.500">
          No {status} requests available right now.
        </Text>
      </Box>
    )}
  </Box>
    );
}