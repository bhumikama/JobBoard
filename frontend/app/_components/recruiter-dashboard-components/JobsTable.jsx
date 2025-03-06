"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Popover,
  Typography,
  Button,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { useApiRequest } from "@/app/hooks/useApiRequest";
import { useDeleteJob } from "@/app/hooks/useDeleteJob";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

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

const JobsTable = () => {
  const router = useRouter();
  const { makeApiRequest, error } = useApiRequest();
  const { mutate: deleteJob, isLoading: isDeleting } = useDeleteJob(); 
  const [allJobs, setAllJobs] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    const fetchJobsByRecruiter = async () => {
      try {
        const response = await makeApiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/recruiter/all`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        setAllJobs(response);
      } catch (error) {
        if (error.message.includes("No jobs found for this recruiter")) {
          setAllJobs([]);
        } else {
          console.error("Error fetching jobs", error.message);
          toast.error(error.message || "Failed to fetch jobs");
        }
      }
    };
    fetchJobsByRecruiter();
  }, []);

  useEffect(() => {
    if (error?.message === "Session Expired") {
      router.replace("/login");
    }
  }, [error, router]);

  const handleClick = (event, jobId) => {
    setAnchorEl(event.currentTarget);
    setSelectedJobId(jobId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedJobId(null);
  };

  const handleDeleteJob = () => {
    if (confirm("Are you sure you want to delete this job?")) {
      deleteJob(selectedJobId);
      handleClose();
    }
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              allJobs?.map((job) => (
                <TableRow key={job.id}>
                  <TableCell component="th" scope="row">
                    {job?.company?.name}
                  </TableCell>
                  <TableCell>{job?.title}</TableCell>
                  <TableCell>
                    {job?.createdAt
                      ? new Date(job.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(event) => handleClick(event, job.id)}
                      color="primary"
                    >
                      <MoreHorizIcon />
                    </IconButton>
                    <Popover
                      open={Boolean(anchorEl) && selectedJobId === job.id}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <Typography
                        sx={{ padding: 2, cursor: "pointer" }}
                        onClick={() =>
                          router.push(
                            `/recruiter-dashboard/jobs/${job.id}/applicants`
                          )
                        }
                      >
                        View Applicants
                      </Typography>
                      <Button
                        startIcon={<DeleteIcon />}
                        sx={{
                          color: "red",
                          padding: "10px",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
                        }}
                        onClick={handleDeleteJob}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete Job"}
                      </Button>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default JobsTable;
