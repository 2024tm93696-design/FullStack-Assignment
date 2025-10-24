import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import config from '../config'
import KeyIcon from "@mui/icons-material/Key";
import Alert from '@mui/material/Alert';
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import logoEq from "../../images/logoEq.webp";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Grid, Typography, Box } from "@mui/material";
import "../../Assets/dashboard.css";


function ChangePassword() {
	const [message, setMessage] = useState(false)
	const [alert, setAlert] = useState("")
	const navigate = useNavigate();
	const role = localStorage.getItem('role') || 'USER';
	const name = localStorage.getItem('name') || 'User Name';
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

	const formik = useFormik({
		initialValues: {
			oldpassword: "",
			newpassword: "",
			cpassword: ""
		},
		onSubmit: async (values) => {
			const user = JSON.parse(localStorage.getItem("userDetails")) || {};
			const data = {
				oldpassword: values.oldpassword,
				newpassword: values.newpassword,
				role: role
			}
			await axios.post(`${config.auth}/changePassword/${user.email}`, data).then(({ data }) => {
				setMessage(true)
				setTimeout(() => {
					handleLogout()
				}, 1000);

			}).catch((err) => {
				console.log(err)
				setAlert("Old Password is Incorrect")
			})


		},
		validate: (values) => {
			let errors = {}

			if (!values.oldpassword.length) {
				errors.oldpassword = "Old Password is Required"
			}
			if (values.newpassword.length <= 8) {
				errors.newpassword = "min length of password required is 8"
			}
			if (!values.newpassword.length) {
				errors.newpassword = "Password is Required*"
			}
			if (!values.cpassword.length) {
				errors.cpassword = "Confirm Password is Required*"
			}
			if (values.newpassword !== values.cpassword) {
				errors.newpassword = "Password and Confirm should be same"
			}


			return errors
		}
	});

	return (
		<div>
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
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
			<div className="container-fluid body-login">
				<div className=" login-flex ">
					<div className="column rounded bg-white login-flex-col-2 p-4">
						<div className="text-center login-flex-col-div-2 mt-5">
							<h3 className="login-h4 fw-bold">Change Password</h3>
							<br />


							<form onSubmit={formik.handleSubmit}>


								<div>
									<KeyIcon style={{ fontSize: "32px", opacity: "0.8" }} />
									<input
										type="password"
										name="oldpassword"
										id="oldpassword"
										className="email-input mt-2"
										onChange={formik.handleChange}
										value={formik.values.oldpassword}
										placeholder=" Enter Old Password"
									/>
									<br />

									<KeyIcon style={{ fontSize: "32px", opacity: "0.8" }} />
									<input
										type="password"
										name="newpassword"
										id="newpassword"
										className="email-input mt-2"
										onChange={formik.handleChange}
										value={formik.values.newpassword}
										placeholder=" Enter New Password"
									/>
									<br />

									<KeyIcon style={{ fontSize: "32px", opacity: "0.8" }} />
									<input
										type="password"
										name="cpassword"
										id="cpassword"
										className="email-input mt-2"
										onChange={formik.handleChange}
										value={formik.values.cpassword}
										placeholder=" Confirm Password"
									/>

									<br />
									<button className="btn btn-signin mt-2" type="submit">
										submit
									</button>

									{formik.errors.oldpassword ? <Alert severity="error" className="login-alert d-flex justify-content-center align-items-center mt-1 ">  {formik.errors.oldpassword} </Alert>

										: null}

									{formik.errors.newpassword ? <Alert severity="error" className="login-alert d-flex justify-content-center align-items-center mt-1 ">  {formik.errors.newpassword} </Alert>

										: null}
									{formik.errors.cpassword ? <Alert severity="error" className="login-alert d-flex justify-content-center align-items-center mt-1 ">  {formik.errors.cpassword} </Alert>

										: null}

									{alert ?
										<Alert severity="error" className="login-alert d-flex justify-content-center align-items-center mt-1 ">{alert}</Alert>
										:
										null

									}

									{message ? <div className="alert alert-success alert-dismissible fade show mt-5" role="alert">
										<strong>Password Changed Successfully</strong>

									</div>
										: null
									}

								</div>
								<br />
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChangePassword;