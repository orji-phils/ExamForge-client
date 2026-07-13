import { Box, Grid, GridItem, Heading, Text, Button, Stat, Table, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import { useUser } from "../../context/UserContext";
import type { Activity, PracticeType } from "../../types";
import { dateFormat } from "../../functions/otherFunctions";
import { PerformanceChart } from "../../functions/Chart";
import { useTitle } from "../../context/TitleContext";

type DashboardType = {
  highestScore: number;
  lastScore: number;
  totalPractice: number;
  practiceHistory: PracticeType[];
  recentActivities: Activity[];
  recentPractices: PracticeType[];
  weakestPractice: PracticeType | null;
}

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  useTitle(`Dashboard - ${user?.userName || "User"} - ExamForge`);

  const [dashboardData, setDashboardData] = useState<DashboardType>({
    highestScore: 0,
    lastScore: 0,
    totalPractice: 0,
    practiceHistory: [],
    recentActivities: [],
    recentPractices: [],
    weakestPractice: null
  });
  const [isLoading, setIsLoading] = useState(false);

  // fetch all user data
  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);

    axios.get(
      `/dashboard/user`
    ).then(res => {
      setDashboardData(res.data)
    }).finally(
      () => setIsLoading(false)
    );
  }, [])

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" h="60vh">
  <Spinner size="lg" />
  <Text mt={4}>Loading your dashboard...</Text>
</Box>
    );
  }

    const firstScore = dashboardData.practiceHistory[0]?.score;
  const lastScoreHistory = dashboardData.practiceHistory[dashboardData.practiceHistory.length - 1]?.score;

  return (
    <Box p={6}>
      {/* Header */}
      <Box mb={6}>
        <Heading size="lg">Welcome back, {user?.userName} 👋</Heading>
        <Text color="gray.500">Here’s your learning progress</Text>
      </Box>

      {/* Stats */}
      <Grid templateColumns={{
  base: "1fr",
  md: "repeat(3, 1fr)"
}} gap={4} mb={6}>
        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Last Score</Stat.Label>
          {dashboardData.totalPractice ? (
            <Stat.ValueText>{dashboardData.lastScore}%</Stat.ValueText>
          ) : (
            <Stat.HelpText>No attempts yet</Stat.HelpText>
          )}
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Total Practices</Stat.Label>
          {dashboardData.totalPractice ? (
            <Stat.ValueText>{dashboardData.totalPractice}</Stat.ValueText>
          ) : (
            <Stat.HelpText>No practice yet</Stat.HelpText>
          )}
        </Stat.Root>

        <Stat.Root p={4} borderRadius="lg" boxShadow="sm">
          <Stat.Label>Best Score</Stat.Label>
          {dashboardData.highestScore !== null ? (
            <Stat.ValueText>{dashboardData.highestScore}%</Stat.ValueText>
          ) : (
            <Stat.HelpText>No score yet</Stat.HelpText>
          )}
        </Stat.Root>
      </Grid>

      {/* Performance Trend */}
      <Box mb={6} p={4} borderRadius="lg" boxShadow="sm">
        <Heading size="md" mb={4}>Performance Trend</Heading>

        {dashboardData.practiceHistory.length ? (
          <>
            <PerformanceChart data={dashboardData.practiceHistory} />

            <Text mt={3}>
              {dashboardData.practiceHistory.length >= 2 ? (
                lastScoreHistory! > firstScore!
                  ? `Your score improved from ${firstScore}% to ${lastScoreHistory}%.`
                  : lastScoreHistory! < firstScore!
                  ? `Your score dropped from ${firstScore}% to ${lastScoreHistory}%. Consider revising.`
                  : `Your performance remained consistent at ${lastScoreHistory}%.`
              ) : (
                "Not enough data to show trend yet."
              )}
            </Text>

            {/* Accessibility summary */}
            <Text mt={2} fontSize="sm" color="gray.600">
              Latest score: {lastScoreHistory ?? "N/A"}%. Previous: {firstScore ?? "N/A"}%.
            </Text>
          </>
        ) : (
          <Text>No performance data yet. Start practicing to see your progress.</Text>
        )}
      </Box>

      {/* Quick Actions */}
      <Grid templateColumns={{
  base: "1fr",
  lg: "2fr 1fr"
}} gap={4} mb={6}>
        <Button colorScheme="purple" size="lg" onClick={() => navigate("/practice")}>
          Start Practice
        </Button>

        <Button colorScheme="blue" size="lg" onClick={() => navigate("/randomPractice")}>
          Start Simulation
        </Button>

        <Button colorScheme="orange" size="lg" onClick={() => navigate("/practiceHistory")}>
          View Practice History
        </Button>
      </Grid>

      {/* Main Section */}
      <Grid templateColumns={{
  base: "1fr",
  lg: "2fr 1fr"
}} gap={6}>
        {/* Recent Practices Table */}
        <GridItem p={4} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4}>Recent Practices</Heading>

          {dashboardData.recentPractices.length ? (
            <Box overflowX="auto">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Subject</Table.ColumnHeader>
                    <Table.ColumnHeader>Score</Table.ColumnHeader>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Year</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dashboardData.recentPractices.map((p: PracticeType) => (
                    <Table.Row key={p.id}>
                      <Table.Cell>{p.subject}</Table.Cell>
                      <Table.Cell>{p.score}%</Table.Cell>
                      <Table.Cell>{p.examType}</Table.Cell>
                      <Table.Cell>{p.year}</Table.Cell>
                      <Table.Cell>{dateFormat(p.modified_date!)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          ) : (
            <Text>No practice history yet.</Text>
          )}
        </GridItem>

        {/* Recommendations */}
        <GridItem p={4} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4}>Recommendations</Heading>

          {!dashboardData.recentPractices.length ? (
            <Text>👉 Start practicing to unlock personalised insights</Text>
          ) : (
            <Box>
              {dashboardData.weakestPractice && (
                <Text mb={2}>👉 Focus more on {dashboardData.weakestPractice.subject}</Text>
              )}

              {dashboardData.lastScore <= 50 && (
                <Text mb={2}>👉 Your last score was low. Review before retrying</Text>
              )}
            </Box>
          )}

          <Text mt={2}>👉 Try a full simulation test</Text>
        </GridItem>
      </Grid>

      {/* Recent Activity */}
      <Box mt={6} p={4} borderRadius="lg" boxShadow="sm">
        <Heading size="md" mb={4}>Recent Activity</Heading>

        {dashboardData.recentActivities.length ? (
          dashboardData.recentActivities.map((a: Activity) => (
            <Text key={a.id}>
              • {a.description} — {dateFormat(a.created_date)}
            </Text>
          ))
        ) : (
          <Text>No recent activity yet.</Text>
        )}
      </Box>
    </Box>
  );
}
