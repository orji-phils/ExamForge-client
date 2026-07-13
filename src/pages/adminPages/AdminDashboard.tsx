import { Box, Grid, GridItem, Heading, Text, Stat, Button, Table, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useActiveUser } from "../../context/ActiveUserContext";
import type { Activity, Users } from "../../types";
import axios from "../../axiosInstance";
import { dateFormat } from "../../functions/otherFunctions";
import { useTitle } from "../../context/TitleContext";

export const AdminDashboard = () => {
  useTitle("Admin Dashboard - ExamForge");
  const navigate = useNavigate();
  const stats = useActiveUser();

  const [dashboardData, setDashboardData] = useState({
    userCount: 0,
    adminCount: 0,
    questionCount: 0,
    alerts: [],
    recentUsers: [],
    recentActivities: [],
    platformActivities: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // fetch all admin dashboard data
  useEffect(() => {
    setIsLoading(true);

    axios.get(`/dashboard/admin`)
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
        <Heading as={"h1"} size="lg">Admin Dashboard</Heading>
        <Text color="gray.500">Monitor system activity and manage platform</Text>
      </Box>

      {/* 🚨 Attention Section */}
      <Box mb={6} p={4} borderRadius="lg" bg="orange.50" border="1px solid #fbd38d">
        {dashboardData.alerts?.length ? (
          <>
            <Heading size="md">Attention Needed</Heading>

            {dashboardData.alerts.map((alert: Activity) => (
              <Text key={alert?.id} mt={2}>⚠️ {alert.description}</Text>
            ))}

            <Button mt={3} colorScheme="orange" size="sm">
              Review Issues
            </Button>
          </>
        ) : (
          <Text mt={2}>No urgent issues</Text>
        )}
      </Box>

      {/* Stats */}
      <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Total Users</Stat.Label>
          <Stat.ValueText>{dashboardData.userCount}</Stat.ValueText>
          <Stat.HelpText>All registered users</Stat.HelpText>
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Active Users</Stat.Label>
          <Stat.ValueText>{stats?.users}</Stat.ValueText>
          <Stat.HelpText>Currently online</Stat.HelpText>
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Questions</Stat.Label>
          <Stat.ValueText>{dashboardData.questionCount}</Stat.ValueText>
          <Stat.HelpText>Total uploaded</Stat.HelpText>
        </Stat.Root>
      </Grid>

      {/* Secondary Stats */}
      <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Total Admins</Stat.Label>
          <Stat.ValueText>{dashboardData.adminCount}</Stat.ValueText>
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Active Admins</Stat.Label>
          <Stat.ValueText>{stats?.admins}</Stat.ValueText>
        </Stat.Root>
      </Grid>

      {/* Quick Actions */}
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
        <Button colorScheme="purple" onClick={() => navigate("/userTable/user")}>
          Manage Users
        </Button>

        <Button colorScheme="blue" onClick={() => navigate("/uploadPastQuestion")}>
          Upload Questions
        </Button>

        <Button colorScheme="red" variant="outline" onClick={() => navigate("/deletePastQuestion")}>
          Delete Questions
        </Button>

        <Button colorScheme="gray">
          View Reports
        </Button>
      </Grid>

      {/* Main Section */}
      <Grid templateColumns="2fr 1fr" gap={6}>

        {/* Recent Users */}
        <GridItem p={4} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4}>Recent Users</Heading>

          {dashboardData.recentUsers.length ? (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Username</Table.ColumnHeader>
                  <Table.ColumnHeader>Email</Table.ColumnHeader>
                  <Table.ColumnHeader>Role</Table.ColumnHeader>
                  <Table.ColumnHeader>Joined</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {dashboardData.recentUsers.map((user: Users) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.userName}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>{dateFormat(user.created_date!)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          ) : (
            <Text>No recent users</Text>
          )}
        </GridItem>

        {/* Alerts / Platform Activity */}
        <GridItem p={4} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4}>Platform Activity</Heading>
          {dashboardData.platformActivities.map((platform, index) => 
            <Text key={index}>• {platform}</Text>
          )}
        </GridItem>
      </Grid>

      {/* Recent Activity */}
      <Box mt={6} p={4} borderRadius="lg" boxShadow="sm">
        <Heading size="md" mb={4}>Recent Activity</Heading>

        {dashboardData.recentActivities.length ? (
          dashboardData.recentActivities.map((activity: Activity) => (
            <Text key={activity.id}>
              • {activity.description} — {dateFormat(activity.created_date)}
            </Text>
          ))
        ) : (
          <Text>No recent activity yet</Text>
        )}
      </Box>

    </Box>
  );
}
