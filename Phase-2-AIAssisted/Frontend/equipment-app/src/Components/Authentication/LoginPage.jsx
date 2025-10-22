import React, { useState, useEffect } from "react";
import "../../Assets/loginPage.css";
import logoEq from "../../images/logoEq.webp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import KeyIcon from "@mui/icons-material/Key";
import { Snackbar, Alert, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputAdornment, IconButton } from "@mui/material";
import config from "../config"
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import validator from 'validator'
import axios from 'axios'


function LoginPage() {

	const navigate = useNavigate();
	const [alert, setAlert] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const formik = useFormik({
		initialValues: {
			enrollmentNum: "",
			email: "",
			password: "",
			role: "",
		},
		onSubmit: async ({ enrollmentNum, email, password, role }) => {
			await axios.post(`${config.auth}/login`, { enrollmentNum, email, password, role }, {
				headers: {
					"Content-Type": "application/json"
				}, withCredentials: true
			}).then(({ data }) => {
				console.log(data, 'succ');

				localStorage.setItem('username', data.username);
				localStorage.setItem('loginby', 'authdb')
				localStorage.setItem('role', data.role);
				localStorage.setItem('name', data.name);
				localStorage.setItem('userDetails', JSON.stringify(data.user));
				if (data.message === "User login success") {
					if (data.role === "Admin") {
						navigate('/adminDashboard');
					} else if (data.role === "Teacher") {
						navigate('/teacherDashboard');
					} else {
						navigate('/studentDashboard');
					}
				}
			}
			).catch(function (error) {
				// handle error
				console.log("Error is: " + error);
				setAlert(true)
				setErrorMessage("Invalid Credentials, User Not Found")
				setTimeout(()=>{
					setAlert(false)
				}, 4000)
			})

		},

		validate: (values) => {
			let errors = {}
			if (!values.email.length) {
				errors.email = "Email is Required*"
			} else {
				if (!validator.isEmail(values.email)) {
					errors.email = "Email is invalid*"
				}
			}
			if (values.password.length <= 8) {
				errors.password = "min length of password required is 8"
			}
			if (!values.password.length) {
				errors.password = "Password is Required*"
			}
			if (!values.enrollmentNum) {
				errors.enrollmentNum = "enrollmentNum is Required*"
			}
			if (values.enrollmentNum.toString().length < 6) {
				errors.enrollmentNum = " Enrollment Number should be 6 digits long*"
			}
			if (!values.role) {
				errors.role = "Role is Required*"
			}
			return errors;
		},
	});

	return (
		<div>
			<div className="container-fluid body-login">
				<div className=" login-flex rounded">
					<div className="column shadow rounded login-flex-col-1 p-4">
						<div className="text-center login-flex-col-div-1">
							<img src={logoEq} alt="logo" width={65} height={65} />
							<h3 className="text-white fw-bold logo-h3">Equiply</h3>
							<br />
							<br />
							<h5 className="text-white fw-bold ">Hello, Student!</h5>
							<br />
							<p className="text-white login-p ">
								<span className="text-white fw-bolder">
									Haven't created your account with us yet?
								</span>
								<br />
								Create your account to manage and track equipment seamlessly...
							</p>
							<br />
							<button
								className="btn btn-signup "
								onClick={() => {
									navigate("/registerpage");
								}}
							>
								Sign Up
							</button>
						</div>
					</div>

					<div className="column rounded bg-white login-flex-col-2 p-4">
						<div className="text-center login-flex-col-div-2 mt-5">
							<h3 className="login-h4 fw-bold">Sign in to Equiply</h3>
							<form onSubmit={formik.handleSubmit} style={{ width: "400px", margin: "auto" }}>

								{/* Role selection */}
								<FormControl component="fieldset" fullWidth margin="normal">
									<FormLabel component="legend" sx={{fontWeight:"bold"}}>Login As</FormLabel>
									<RadioGroup
										row
										name="role"
										value={formik.values.role}
										onChange={formik.handleChange}
										sx={{display:"flex", justifyContent:"center"}}
									>
										<FormControlLabel value="Student" control={<Radio />} label="Student" />
										<FormControlLabel value="Teacher" control={<Radio />} label="Staff" />
										<FormControlLabel value="Admin" control={<Radio />} label="Admin" />
									</RadioGroup>
									{formik.touched.role && formik.errors.role && (
										<p style={{ color: "red", marginTop: "4px" }}>{formik.errors.role}</p>
									)}
								</FormControl>

								{/* Enrollment Number */}
								<TextField
									fullWidth
									id="enrollmentNum"
									name="enrollmentNum"
									label="Enrollment Number"
									variant="outlined"
									type="number"
									value={formik.values.enrollmentNum}
									onChange={formik.handleChange}
									error={formik.touched.enrollmentNum && Boolean(formik.errors.enrollmentNum)}
									helperText={formik.touched.enrollmentNum && formik.errors.enrollmentNum}
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<BadgeOutlinedIcon />
											</InputAdornment>
										),
									}}
								/>

								{/* Email */}
								<TextField
									fullWidth
									id="email"
									name="email"
									label="Email"
									variant="outlined"
									type="email"
									value={formik.values.email}
									onChange={formik.handleChange}
									error={formik.touched.email && Boolean(formik.errors.email)}
									helperText={formik.touched.email && formik.errors.email}
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<MailOutlineIcon />
											</InputAdornment>
										),
									}}
								/>

								{/* Password */}
								<TextField
									fullWidth
									id="password"
									name="password"
									label="Password"
									variant="outlined"
									type="password"
									value={formik.values.password}
									onChange={formik.handleChange}
									error={formik.touched.password && Boolean(formik.errors.password)}
									helperText={formik.touched.password && formik.errors.password}
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<KeyIcon />
											</InputAdornment>
										),
									}}
								/>

								<button
									type="submit"
									disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
									className="btn btn-signin mt-3"
								>
									Sign In
								</button>
							</form>

							{alert &&
								<>
									<Snackbar
										open={true}
										autoHideDuration={7000}
										anchorOrigin={{ vertical: "top", horizontal: "right" }}
									>
										<Alert severity="error" className="d-flex justify-content-center align-items-center mt-1 w-4">{errorMessage}</Alert>
									</Snackbar>
								</>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
