import React, { useState, useEffect } from "react";
import "../../Assets/loginPage.css";
import { Link } from "react-router-dom";
import logoEq from "../../images/logoEq.webp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import KeyIcon from "@mui/icons-material/Key";
import { Snackbar, Alert } from '@mui/material';
import config from "../config"
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import validator from 'validator'
import axios from 'axios'


function LoginPage() {

	const navigate = useNavigate();
	const [alert, setAlert] = useState(false)
	const [error, setError] = useState("")
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
				setError(error)
				setAlert(true)
				navigate(0)
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
							<br />
							<br />
							<form onSubmit={formik.handleSubmit}>
								<h6>Login As:</h6>
								<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
									<input
										type="radio"
										name="role"
										id="role"
										className="email-input mt-2"
										value="Student"
										onChange={formik.handleChange}
										checked={formik.values.role === "Student"}
										placeholder=" Choose your role"
									/>
									<PersonOutlineIcon
										style={{ fontSize: "25px", opacity: "0.7", marginRight: '1px' }}
									/>
									<label htmlFor="role">Student</label>
									<br />

									<input
										type="radio"
										name="role"
										id="role"
										className="email-input mt-2"
										value="Teacher"
										onChange={formik.handleChange}
										checked={formik.values.role === "Teacher"}
										placeholder=" Choose your role"
									/>
									<PersonOutlineIcon
										style={{ fontSize: "25px", opacity: "0.7", marginRight: '1px' }}
									/>
									<label htmlFor="role">Staff</label>
									<br />
									<input
										type="radio"
										name="role"
										id="role"
										className="email-input mt-2"
										value="Admin"
										onChange={formik.handleChange}
										checked={formik.values.role === "Admin"}
										placeholder=" Choose your role"
									/>
									<PersonOutlineIcon
										style={{ fontSize: "25px", opacity: "0.7", marginRight: '1px' }}
									/>
									<label htmlFor="role">Admin</label>
								</div>
								<br />
								<BadgeOutlinedIcon
									style={{ fontSize: "32px", opacity: "0.8" }}
								/>{" "}
								<input
									type="number"
									name="enrollmentNum"
									id="enrollmentNum"
									className="email-input"
									onChange={formik.handleChange}
									value={formik.values.enrollmentNum}
									min={100000}
									max={999999}
									pattern="\d{6}"
									placeholder=" Enrollment Number"
								/>
								<br />
								<MailOutlineIcon
									style={{ fontSize: "32px", opacity: "0.8" }}
								/>{" "}
								<input
									type="email"
									name="email"
									id="email"
									className="email-input"

									onChange={formik.handleChange}
									value={formik.values.email}
									placeholder=" Email"
								/>
								<br />
								<KeyIcon style={{ fontSize: "32px", opacity: "0.8" }} />{" "}
								<input
									type="password"
									name="password"
									id="password"
									className="email-input mt-2"
									onChange={formik.handleChange}
									value={formik.values.password}
									placeholder=" Password"
								/>
								<br />
								<br />
								<Link className="btn google-btn" to='/forgetpassword'>
									Forget your password?
								</Link>
								<br />
								<button className="btn btn-signin mt-2 button" type="submit" disabled={formik.errors.length > 0}>
									Sign In
								</button>
								{Object.values(formik.errors).length > 0 &&
									Object.entries(formik.errors).map(([field, error], index) => (
										formik.touched[field] &&
										<Snackbar
											key={index}
											open={true}
											autoHideDuration={3000}
											anchorOrigin={{ vertical: "top", horizontal: "right" }}
											sx={{ top: `${index * 70 + 10}px` }}
										>
											<Alert severity="error" sx={{ width: "100%" }}>
												{error}
											</Alert>
										</Snackbar>
									))
								}
							</form>

							{alert &&
								<>
									<Snackbar
										open={true}
										autoHideDuration={7000}
										anchorOrigin={{ vertical: "top", horizontal: "right" }}
									>
										<Alert severity="error" className="login-alert d-flex justify-content-center align-items-center mt-1 ">{error}</Alert>
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
