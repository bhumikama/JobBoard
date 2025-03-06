"use client";
import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import dateFormat from "@/utils/dateFormat";
import { useGetAppliedJobs } from "@/app/hooks/useGetAppliedJobs";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    whiteSpace: "nowrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function AppliedJobsTable() {
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const queryClient = useQueryClient();

  const cachedApplications = queryClient.getQueryData(["appliedJobs"]);

  const {
    data: appliedJobs,
    isLoading,
    error,
  } = useGetAppliedJobs({
    enabled: !cachedApplications,
  });

  const allAppliedJobs = cachedApplications || appliedJobs;

  useEffect(() => {
    if (error?.message === "Session expired") {
      router.replace("/login");
    }
  }, [error, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Job Role</StyledTableCell>
            <StyledTableCell>Company Name</StyledTableCell>
            {!isSmallScreen && (
              <StyledTableCell align="right">Date</StyledTableCell>
            )}
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allAppliedJobs?.length > 0 ? (
            allAppliedJobs.map((appliedJob, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {appliedJob.job?.title}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {appliedJob.job.company?.name}
                </StyledTableCell>
                {!isSmallScreen && (
                  <StyledTableCell align="right">
                    {dateFormat(appliedJob.createdAt)}
                  </StyledTableCell>
                )}
                <StyledTableCell align="right">
                  <Badge
                    className={`${
                      appliedJob?.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={4} align="center">
                You have not applied for any jobs yet
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
