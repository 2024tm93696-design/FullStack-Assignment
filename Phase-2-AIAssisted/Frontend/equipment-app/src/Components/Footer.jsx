import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = ({ role }) => {
  const currentYear = new Date().getFullYear();

  const footerName = {
    Student: ["Home", "My Equipments", "My Requests"],
    Teacher: ["Home", "Equipments History", "My Requests"],
    Admin: ["Home","My Requests", "EquipmentsHistory"],
  };
    const footerLinks = {
    Student: ["/studentDashboard#home", "/studentDashboard#my-equipment", "/studentDashboard#my-requests"],
    Teacher: ["/teacherDashboard#home", "/teacherDashboard#my-equipment", "/teacherDashboard#my-requests"],
    Admin: ["/adminDashboard#admin-home", "/adminDashboard#admin-requests", "/adminDashboard#equipment-history"],
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        backgroundColor: "#413e3eff",
        color: "white",
        py: 2,
        px: 3,
        textAlign: "center",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Divider sx={{ mb: 1 }} />

      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
        {role ? `${role} Portal` : "Equipment Management System"}
      </Typography>

      <Typography variant="caption" color="white">
        {footerName[role]?.map((link, index) => (
        <Link to={footerLinks[role][index]} style={{textDecoration:"none", color: "white", fontWeight:"bold"}}>
        {link}&nbsp;{index < 2 ? "|" : ""}&nbsp;
        </Link>
        ))}

      </Typography>

      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        © {currentYear} School Equipment Management System. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
