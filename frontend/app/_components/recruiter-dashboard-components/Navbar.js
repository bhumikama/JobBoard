"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { useLogOut } from "@/app/hooks/useLogOut";

function Navbar() {
  const isMobile = useMediaQuery("(max-width:740px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mutate: logOut } = useLogOut();
  const router = useRouter();

  const handleLogout = () => {
    logOut();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#000" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              color: "white",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <Link href={"/recruiter-dashboard"}>JobHunt</Link>
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer}
                sx={{ display: { xs: "block", sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                open={drawerOpen}
                onClose={toggleDrawer}
                anchor="left"
                sx={{ width: 250 }}
              >
                <List>
                  <ListItem
                    button
                    component={Link}
                    href="/recruiter-dashboard/companies"
                  >
                    Companies
                  </ListItem>
                  <ListItem
                    button
                    component={Link}
                    href="/recruiter-dashboard/jobs"
                  >
                    Jobs
                  </ListItem>
                  <ListItem button onClick={handleLogout}>
                    Logout
                  </ListItem>
                </List>
              </Drawer>
            </>
          ) : (
            <div>
              <Link href="/recruiter-dashboard/companies">
                <Button
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                >
                  Companies
                </Button>
              </Link>

              <Link href="/recruiter-dashboard/jobs">
                <Button
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                >
                  Jobs
                </Button>
              </Link>

              <Button
                sx={{
                  color: "white",
                  border: "2px solid white",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "black",
                    border: "2px solid black",
                  },
                  borderRadius: "2px",
                  padding: "4px 8px",
                  marginLeft: "2px",
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
