import React from "react";
import config from "../config"
import axios from 'axios'
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import logoEq from "../../images/logoEq.webp";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Grid, Typography, Box } from "@mui/material";
import dashboard from "../../images/dashboard.jpg";
import teacher from "../../images/teacher.jpg"
import admin from "../../images/admin.jpg"
import "../../Assets/dashboard.css";

const DashboardNavbar = () => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		// your logout logic here
		await axios.get(`${config.auth}/logout`).then(({ data }) => {
			console.log(data, 'succ');
			navigate('/loginpage');
		}
		).catch(function (error) {
			// handle error
			console.log("Error is: " + error);
			navigate(0)
		})
		console.log("Logged out");
		handleMenuClose();
	};
	function stringToColor(string) {
		let hash = 0;
		let i;

		/* eslint-disable no-bitwise */
		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */

		return color;
	}

	function stringAvatar(name) {
		return {
			sx: {
				bgcolor: stringToColor(name),
			},
			children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
		};
	}

	const name = localStorage.getItem('name') || 'User Name';
	const role = localStorage.getItem('role') || 'USER';

	return (
		<>
			<AppBar
				position="sticky"
				sx={{
					backgroundColor: role==="Student"? "#94effdff" : role ===  "Teacher"?"#d3e2c4ff":"#bcad92ff" ,
					boxShadow: "none",
					padding: "0 10px",
				}}
			>
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					<Box display="flex" alignItems="center" gap={1}>
						<img
							src={logoEq}
							alt="Equiply logo"
							style={{ width: 35, height: 35, borderRadius: "8px" }}
						/>
						<Typography
							variant="h6"
							component="div"
							sx={{ fontWeight: 600, letterSpacing: "0.5px", color: "#333" }}
						>
							Equiply
						</Typography>
					</Box>

					<Box>
						<Tooltip title="Profile settings" className="nav-profile">
							<Typography sx={{ ml: 1 }} className="title">Hi, {name.split(' ')[0]}</Typography>
							<IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
								<Avatar {...stringAvatar(name)} />
							</IconButton>
						</Tooltip>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
						>
							<MenuItem onClick={()=> {navigate("/changePassword")}}>Change Password</MenuItem>
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
			<Box
				sx={{
					position: "relative",
					height: "70vh",
					backgroundImage: `url(${role==="Student"?dashboard:role=== "Teacher"?teacher: admin})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "white",
					overflow: "hidden",
				}}
			>
				{/* Dark overlay */}
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.45)",
						backdropFilter: "brightness(0.7)",
						zIndex: 1,
					}}
				/>

				<Box
					sx={{
						position: "relative",
						zIndex: 2,
						textAlign: "center",
						px: 3,
						maxWidth: "700px",
					}}
				>
					<Typography
						variant="h4"
						sx={{ fontWeight: 600, mb: 2, textShadow: "2px 2px 4px rgba(0,0,0,0.5)" , color:"rgba(244, 213, 213, 0.84)", textAlign:"center"}}
					>
						Hello {role === "Student"?"Student":  role=== "Teacher" ? "Staff": role} !
					</Typography>
					<Typography
						variant="h3"
						sx={{ fontWeight: 700, mb: 2, textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
					>
						Welcome to Equiply 🎓
					</Typography>

					<Typography
						variant="h5"
						sx={{ mb: 2, textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}
					>
						Smart School Equipment Management System
					</Typography>

					<Typography
						variant="body1"
						sx={{ fontSize: "1.1rem", textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}
					>
						Stay on top of your resource needs — request new equipment and manage returns seamlessly.
					</Typography>
				</Box>
			</Box>
		</>
	);
};

export default DashboardNavbar;
