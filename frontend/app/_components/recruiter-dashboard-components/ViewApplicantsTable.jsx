"use client";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import dateFormat from "@/utils/dateFormat";
import { useApplicants } from "@/app/hooks/useApplicants";
import { useUpdateApplication } from "@/app/hooks/useUpdateApplication";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.components?.MuiTableCell?.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${theme.components?.MuiTableCell?.body}`]: {
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

const statusMessages = ["accepted", "rejected"];

export default function ViewApplicantsTable() {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  if (!id) return null;

  const { data: applicants, isLoading, error } = useApplicants(id);
  const { mutate: updateApplication } = useUpdateApplication();

  const statusHandler = (status, applicationId) => {
    updateApplication({ jobId: id, applicationId, status });
  };

  useEffect(() => {
    if (error?.message === "Session expired") {
      router.replace("/login");
    }
  }, [error, router]);

  if (isLoading) return <p className="text-center py-4">Loading...</p>;

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto", mt: 4 }}>
      <Table sx={{ minWidth: 700 }} aria-label="Applicants Table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Full Name</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Resume</StyledTableCell>
            {!isSmallScreen && (
              <StyledTableCell align="right">Applied Date</StyledTableCell>
            )}
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applicants?.length > 0 ? (
            applicants.map((applicant, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {applicant?.user?.name}
                </StyledTableCell>
                <StyledTableCell>{applicant?.user?.email}</StyledTableCell>
                <StyledTableCell>
                  {applicant?.resumeUrl ? (
                    <a
                      className="text-blue-600 cursor-pointer"
                      href={applicant?.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`${applicant?.user?.name}.pdf`}
                    </a>
                  ) : (
                    <span>NA</span>
                  )}
                </StyledTableCell>
                {!isSmallScreen && (
                  <StyledTableCell align="right">
                    {dateFormat(applicant?.createdAt)}
                  </StyledTableCell>
                )}
                <StyledTableCell align="right">
                  <ToggleButtonGroup
                    spacing={{ xs: 0, md: 1, lg: 2 }}
                    value={applicant.status}
                    exclusive
                    onChange={(_, newStatus) =>
                      newStatus && statusHandler(newStatus, applicant?.id)
                    }
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      gap: 1,
                    }}
                  >
                    {statusMessages.map((status) => (
                      <ToggleButton
                        key={status}
                        value={status}
                        selected={applicant.status === status}
                        sx={{
                          minWidth: 50,
                          bgcolor:
                            applicant.status === status
                              ? "primary.main"
                              : "grey.400",
                          color: applicant.status === status ? "#fff" : "black",
                          border:
                            applicant.status === status
                              ? "2px solid #1976d2"
                              : "2px solid gray",
                          "&.Mui-selected": {
                            bgcolor: "primary.main",
                            color: "#fff",
                            border: "2px solid #1976d2",
                            "&:hover": {
                              bgcolor: "primary.dark",
                            },
                          },
                          "&:hover": {
                            bgcolor:
                              applicant.status === status
                                ? "primary.dark"
                                : "grey.400",
                          },
                        }}
                      >
                        {status}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={5} align="center">
                No applicants found for this job.
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
