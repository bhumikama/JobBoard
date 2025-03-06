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
import { useCompanies } from "@/app/hooks/useCompanies";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

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

export default function CompanyTable() {
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleEdit = (id) => {
    router.push(`/recruiter-dashboard/companies/${id}`);
  };

  const queryClient = useQueryClient();

  const cachedCompanies = queryClient.getQueryData(["companies"]);

  const {
    data: companyList,
    isLoading,
    error,
  } = useCompanies({
    enabled: !cachedCompanies,
  });

  const companies = cachedCompanies || companyList;

  useEffect(() => {
    if (error?.message === "Session expired") {
      router.replace("/login");
    }
  }, [error, router]);

  if (isLoading) {
    return <div>Loading companies...</div>;
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Logo</StyledTableCell>
            <StyledTableCell>Company Name</StyledTableCell>
            {!isSmallScreen && (
              <StyledTableCell align="right">Published Date</StyledTableCell>
            )}
            <StyledTableCell align="right">Settings</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies?.length > 0 ? (
            companies.map((company, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  <Avatar>
                    <AvatarImage src={company.imageUrl} />
                  </Avatar>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {company.name}
                </StyledTableCell>
                {!isSmallScreen && (
                  <StyledTableCell align="right">
                    {dateFormat(company.createdAt)}
                  </StyledTableCell>
                )}
                <StyledTableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(company.id)}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={4} align="center">
                There are no companies found
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
