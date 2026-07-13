import { Box, Grid, Heading, Text, Stat, Button, Table, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveUser } from "../../context/ActiveUserContext";
import type { Activity, UpgradeRequest } from "../../types";
import axiosInstance from "../../axiosInstance";
import { approveRequest, rejectRequest } from "../../functions/upgradeFunctions";
import { dateFormat } from "../../functions/otherFunctions";
import { useTitle } from "../../context/TitleContext";

export const MasterDashboard = () => {
    const navigate = useNavigate();
    const stats = useActiveUser();
    useTitle("Master Dashboard - ExamForge");

    const [dashboardData, setDashboardData] = useState({
      userCount: 0,
      adminCount: 0,
      masterCount: 0,
      questionCount: 0,
      pendingCount: 0,
      pending: [],
      adminActivities: []
    });
    const [isLoading, setIsLoading] = useState(false);

    // fetch all master dashboard data
    useEffect(() => {
      setIsLoading(true);
      axiosInstance.get(`/dashboard/master`)
      .then(res => setDashboardData(res.data))
      .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" h="60vh">
            <Spinner size="lg" />
            <Text mt={4}>Loading your dashboard...</Text>
          </Box>
        );
      }

      return (
    <Box p={6}>

      {/* Header */}
      <Box mb={6}>
        <Heading size="lg">Master Dashboard</Heading>
        <Text color="gray.500">System control, monitoring & approvals</Text>
      </Box>

      {/* 🚨 PRIORITY: Upgrade Requests */}
      <Box mb={6} p={4} borderRadius="lg" bg="red.50">
        <Heading size="md">
          Pending Upgrade Requests ({dashboardData?.pendingCount})
        </Heading>

        {dashboardData.pending.length ? (
          <>
            {dashboardData.pending.slice(0, 3).map((req: UpgradeRequest) => (
              <Text key={req.userId} mt={2}>
                ⚠️ {req.userName} requested admin access
              </Text>
            ))}

            <Button mt={3} colorScheme="red" onClick={() => navigate("/upgradeRequests")}>
              Review All Requests
            </Button>
          </>
        ) : (
          <Text mt={2}>No pending requests</Text>
        )}
      </Box>

      {/* 📊 SYSTEM TOTALS */}
      <Grid templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(4, 1fr)"
        }} gap={4} mb={6}>
        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Total Users</Stat.Label>
          <Stat.ValueText>{dashboardData.userCount}</Stat.ValueText>
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Total Admins</Stat.Label>
          <Stat.ValueText>{dashboardData.adminCount!}</Stat.ValueText>
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Total Masters</Stat.Label>
          <Stat.ValueText>{dashboardData.masterCount!}</Stat.ValueText>
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Total Questions</Stat.Label>
          <Stat.ValueText>{dashboardData.questionCount}</Stat.ValueText>
        </Stat.Root>
      </Grid>

      {/* 📈 ACTIVITY STATS */}
      <Grid templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(4, 1fr)"
        }} gap={4} mb={6}>
        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Active Users</Stat.Label>
          <Stat.ValueText>{stats?.users}</Stat.ValueText>
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Active Admins</Stat.Label>
          <Stat.ValueText>{stats?.admins}</Stat.ValueText>
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Active Masters</Stat.Label>
          <Stat.ValueText>{stats?.masters}</Stat.ValueText>
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Pending Requests</Stat.Label>
          <Stat.ValueText>{dashboardData.pendingCount}</Stat.ValueText>
        </Stat.Root>
      </Grid>

      {/* ⚡ MASTER CONTROLS */}
      <Grid templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(4, 1fr)"
        }} gap={4} mb={6}>
        <Button colorScheme="purple" onClick={() => navigate("/userManagement")}>
          Manage Roles
        </Button>

        <Button colorScheme="blue" onClick={() => navigate("/auditLogs")}>
          View Audit Logs
        </Button>

        <Button colorScheme="red" variant="outline">
          View System Logs
        </Button>

        <Button colorScheme="orange">
          Announcements
        </Button>
      </Grid>

      {/* 📋 FULL REQUEST TABLE */}
      <Box p={4} borderRadius="lg" boxShadow="sm" mb={6}>
        <Heading size="md" mb={4}>All Upgrade Requests</Heading>

        {dashboardData.pending.length ? (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Username</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {dashboardData.pending.map((p: UpgradeRequest) => (
                <Table.Row key={p.userId}>
                  <Table.Cell>{p.userName}</Table.Cell>
                  <Table.Cell>{p.email}</Table.Cell>
                  <Table.Cell>
                    <Button
                      size="sm"
                      colorScheme="green"
                      mr={2}
                      onClick={() => approveRequest(p.userId, p.userName)}
                    >
                      Approve
                    </Button>

                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => rejectRequest(p.userId, p.userName)}
                    >
                      Reject
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        ) : (
          <Text>No new upgrade requests</Text>
        )}
      </Box>

      {/* 📜 SYSTEM ACTIVITY LOG */}
      <Box p={4} borderRadius="lg" boxShadow="sm">
        <Heading size="md" mb={4}>System Activity Log</Heading>

        {dashboardData.adminActivities.length ? (
          dashboardData.adminActivities.map((activity: Activity) => (
            <Text key={activity.id}>
              • {activity.description} — {dateFormat(activity.created_date)}
            </Text>
          ))
        ) : (
          <Text>No new activity recorded yet</Text>
        )}
      </Box>

    </Box>
  );
}
