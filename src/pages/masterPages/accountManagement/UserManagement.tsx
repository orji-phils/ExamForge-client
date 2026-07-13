import { Box, Button, Field, Heading, Input, NativeSelect, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react"
import { UserTable } from "./UserTable";
import { userSchema, type MultiUserForm, type UserNameForm, type UserRoleForm } from "../../../userComponent/schemas/user.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchUser } from "../../../functions/userFunction";
import { useTitle } from "../../../context/TitleContext";
import z from "zod";

export const UserManagement = () => {
  useTitle("User Management - Account Management");

  const { handleSubmit, formState: { errors } } = useForm<
  z.input<typeof userSchema>,
  any,
  z.output<typeof userSchema>
  >({
    resolver: zodResolver(userSchema)
  });

  const [userType, setUserType] = useState<UserRoleForm>("");
  const [userName, setUserName] = useState<UserNameForm>("");
  const [userData, setUserData] = useState<MultiUserForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUser = () => {
    setIsLoading(true);

    searchUser(userName)
    .then(data => {
      data && setUserData(data);
      data && setUserType(data[0].role!)
    }).finally (
      () => setIsLoading(false)
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Spinner />
        <Text>Searching user... Please wait.</Text>
      </Box>
    )
  }

    return (
  <Box p={6} display="flex" flexDirection="column" gap={6}>
    {/* HEADER */}
    <Box>
      <Heading fontSize="2xl" fontWeight="bold">
        User Management
      </Heading>

      <Text color="gray.500">
        Search, filter, and manage system users
      </Text>
    </Box>

    {/* FILTER PANEL */}
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      display="flex"
      flexDirection="column"
      gap={4}
    >
      {/* SEARCH */}
      <form onSubmit={(handleSubmit(getUser))} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Field.Root invalid={!!errors.userName} style={{ flex: 1, minWidth: "250px" }}>
          <label htmlFor="userName">
            <Text fontWeight="medium">Search by user name</Text>
          </label>

          <Input
            type="search"
            id="userName"
            onBlur={(e) => setUserName(e.target.value)}
            placeholder="Enter username..."
          />

          <Field.ErrorText>{errors.userName?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" colorScheme="purple">
          Search
        </Button>
      </form>

      {/* USER TYPE FILTER */}
      <Box>
        <Text mb={2} fontWeight="medium">
          Filter by user type
        </Text>

        <NativeSelect.Root>
          <NativeSelect.Field
            onChange={(e) => setUserType(e.target.value as UserRoleForm)}
          >
            <option value="">All Users</option>
            <option value="user">Regular Users</option>
            <option value="admin">Admin Users</option>
            <option value="master">Master Users</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Box>
    </Box>

    {/* RESULTS */}
    <Box>
      {userType !== "" && (
        <UserTable
          userType={userType}
          pageHeader={
            userType === "user"
              ? "Regular Users"
              : userType === "admin"
              ? "Admin Users"
              : "Master Users"
          }
          pageInfo={
            userType === "user"
              ? "Manage all registered users and their activity."
              : userType === "admin"
              ? "Manage system administrators and permissions."
              : "Full system controllers with highest privileges."
          }
          data={userData!}
        />
      )}
    </Box>
  </Box>
);
}