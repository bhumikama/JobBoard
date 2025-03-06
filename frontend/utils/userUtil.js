export function returnPathByRole(role) {
  const validRoles = ["recruiter", "job_seeker"];
  if (!validRoles.includes(role)) {
    throw new Error("User is not authorized");
  }
  switch (role) {
    case "recruiter":
      return "/recruiter-dashboard";
    default:
      return "/";
  }
}
