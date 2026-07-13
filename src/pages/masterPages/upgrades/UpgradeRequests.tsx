import { Box, Button, Field, Input, NativeSelect, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { UpgradeTable } from "./UpgradeTable";
import { upgradeSchema, type MultiUpgradeForm, type StatusForm, type UserNameForm } from "../../../userComponent/schemas/upgrades.schema";
import { getUpgradeData } from "../../../functions/upgradeFunctions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTitle } from "../../../context/TitleContext";
import type z from "zod";

export const UpgradeRequests = () => {
  const { handleSubmit, formState: { errors } } = useForm<
z.input<typeof upgradeSchema>,
any,
z.output<typeof upgradeSchema>
  >({
    resolver: zodResolver(upgradeSchema)
  });
  useTitle("Upgrade Requests - Account Management");

  const [status, setStatus] = useState<StatusForm>("");
  const [userName, setUserName] = useState<UserNameForm>("");
  const [upgradeData, setUpgradeData] = useState<MultiUpgradeForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getData = () => {
    setIsLoading(true);

    getUpgradeData(userName)
    .then(data => {
      data && setUpgradeData(data)
    }).finally(
      () => setIsLoading(false)
    );

  }

  if (isLoading) {
    return(
      <Box>
        <Spinner />
        <Text>Fetching user's upgrade data... Please wait.</Text>
      </Box>
    );
  }

    return (
        <Box>
          <form onSubmit={handleSubmit(getData)}>
            <Field.Root invalid={!!errors.userName}>
              <label htmlFor="userName">
                <Text>Search by user name</Text>
              </label>
              <Input 
              type="search" 
              id="userName" 
              onBlur={(e) => setUserName(e.target.value)}
              placeholder="Search by user name" 
              />
              <Field.ErrorText>{errors.userName?.message}</Field.ErrorText>
            </Field.Root>

            <Button
            type="submit"
            >
              Search
            </Button>
          </form>

            <NativeSelect.Root>
                <NativeSelect.Field
                onChange={(e) => setStatus(e.target.value as StatusForm)}
                >
                    <option value="">Filter by status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="revoked">Revoked</option>
                    <option value="rejected">Rejected</option>
                </NativeSelect.Field>
            </NativeSelect.Root>

            {status !== "" && 
            <UpgradeTable 
            status={status} 
            pageHeader={
              status === "pending" ? "Admin Access Requests" 
              : status === "approved" ? "Active Administrators" 
              : status === "revoked" ? "Revoked Administrator Access" 
              : "Rejected Admin Access Requests"
            }
            pageInfo={
              status === "pending" ? "Approve or reject users requesting elevated system privileges." 
              : status === "approved" ? "Monitor administrator performance and manage account privileges." 
              : status === "revoked" ? "Users whose administrator privileges were revoked." 
              : "Rejected users requesting elevated system privileges."
            }

            data={upgradeData!}
            />}
        </Box>
    );
}