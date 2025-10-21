import React, { useState } from "react";
import "../../Assets/loginPage.css";
import logoEq from "../../images/logoEq.webp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyIcon from "@mui/icons-material/Key";
import { Snackbar, Alert } from '@mui/material';
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { useNavigate } from "react-router";
import config from '../config'
import axios from 'axios'
import { useFormik } from "formik";
import validator from 'validator'
import Selectcustom from "./Selectcustom";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

const options = [
	{ value: 'What was the name of your first pet?', label: 'What was the name of your first pet?' },
	{ value: 'In what city was your father born?', label: 'In what city was your father born?' },
	{ value: 'What was your childhood nickname?', label: 'What was your childhood nickname?' },
	{ value: 'What was your favorite sport?', label: 'What was your favorite sport?' }

]

function RegisterPage() {

	const [alert, setAlert] = useState(false)
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			enrollmentNum: "",
			name: "",
			email: "",
			sques: "",
			ans1: "",
			password: "",
			cpassword: "",
			role: "",
		},
		onSubmit: async (values) => {
			const data = {
				enrollmentNum: values.enrollmentNum,
				name: values.name,
				email: values.email,
				ans1: values.ans1,
				password: values.password,
				role: values.role,
			}

			await axios.post(`${config.auth}/register`, data).then(({ data }) => {
				console.log(data.message)
				navigate('/loginpage');
			}).catch((err) => {
				console.log(err)
				setAlert(true)
				navigate(0)
			})
		},
		validate: (values) => {
			let errors = {}
			console.log(values);

			if (!values.enrollmentNum) {
				errors.enrollmentNum = " enrollmentNum is Required*"
			}
			if (values.enrollmentNum.toString().length < 6) {
				errors.enrollmentNum = " Enrollment Number should be 6 digits long*"
			}
			if (!values.name.length) {
				errors.name = " Name is Required*"
			}
			if (!values.sques) {
				errors.sques = "Security Question required"
			}
			if (!values.email.length) {
				errors.email = "Email is Required*"
			} else {
				if (!validator.isEmail(values.email)) {
					errors.email = "Email is invalid*"
				}
			}
			if (!values.ans1.length) {
				errors.ans1 = "Answer for selected security question required"
			}
			if (values.password.length <= 8) {
				errors.password = "min length of password required is 8"
			}
			if (!values.password.length) {
				errors.password = "Password is Required*"
			}
			if (!values.cpassword.length) {
				errors.cpassword = "Confirm Password is Required*"
			}
			if (values.password !== values.cpassword) {
				errors.password = "Password and Confirm should be same"
			}
			if (!values.role) {
				errors.role = "Role is Required*"
			}
			return errors
		}
	});

	return (
		<div>
			<div className="container-fluid body-login">
				<div className=" login-flex rounded shadow">
					<div className="column rounded bg-white login-flex-col-2 p-4">
						<div className="text-center login-flex-col-div-2 mt-5">
							<h3 className="login-h4 fw-bold">Create Account</h3>
							<br />
							<form onSubmit={formik.handleSubmit}>
								<h6>Register As:</h6>
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
									style={{ fontSize: "30px", opacity: "0.7", marginRight: '5px' }}
								/>
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
									placeholder="Enrollment Number"
								/>
								<br />
								<PersonOutlineIcon
									style={{ fontSize: "30px", opacity: "0.7", marginRight: '5px' }}
								/>
								<input
									type="text"
									name="name"
									id="name"
									className="email-input"
									onChange={formik.handleChange}
									value={formik.values.name}
									placeholder="Name"
								/>

								<br />
								<MailOutlineIcon
									style={{ fontSize: "30px", opacity: "0.7", marginRight: '5px' }}
								/>
								<input
									type="email"
									name="email"
									id="email"
									className="email-input mt-2"
									onChange={formik.handleChange}
									value={formik.values.email}
									placeholder=" Email"
								/>
								<br />
								<Selectcustom
									className='email-input'
									onChange={value => formik.setFieldValue('sques', value.value)}
									value={formik.values.sques}
									options={options}

								/>

								<QuestionAnswerOutlinedIcon style={{ fontSize: "30px", opacity: "0.7", marginRight: '5px' }} />
								<input
									type="password"
									name="ans1"
									id="ans1"
									className="email-input mt-2"
									onChange={formik.handleChange}
									value={formik.values.ans1}
									placeholder=" Answer"
								/>
								<br />

								<KeyIcon style={{ fontSize: "30px", opacity: "0.7", marginRight: '5px' }} />
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

								<KeyIcon style={{ fontSize: "30px", opacity: "0.7", marginRight: '5px' }} />
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
								<br />
								<button className="btn btn-signin mt-2" type="submit" disabled={
									!formik.isValid ||
									!formik.dirty ||
									formik.isSubmitting
								}>
									Sign Up
								</button>
								{Object.values(formik.errors).length > 0 && (
									<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
										{Object.entries(formik.errors).map(([field, error], index) => (
											// formik.touched[field] && (
												<Snackbar
													key={index}
													open={true}
													autoHideDuration={3000}
													anchorOrigin={{ vertical: "top", horizontal: "right" }}
												>
													<Alert severity="error" sx={{ width: "100%" }}>
														{error}
													</Alert>
												</Snackbar>
											// )
										))}
									</div>
								)}

								{alert &&
									<>
										<Snackbar
											open={true}
											autoHideDuration={3000}
											anchorOrigin={{ vertical: "top", horizontal: "right" }}
										>
											<Alert severity="error" className="login-alert d-flex justify-content-center align-items-center mt-1 ">User with Specific Email id already exists</Alert>
										</Snackbar>
									</>
								}
							</form>
						</div>
					</div>

					<div className="column  rounded login-flex-col-1 p-4">
						<div className="text-center login-flex-col-div-1">
							<img src={logoEq} alt="logo" width={65} height={65} />
							<h3 className="text-white fw-bold logo-h3">Equiply</h3>
							<br />
							<br />
							<h5 className="text-white fw-bold ">Welcome Back!</h5>
							<br />
							<p className="text-white login-p ">
								{" "}
								Log in to continue managing your gear...
							</p>
							<br />
							<button
								className="btn btn-signup "
								onClick={() => {
									navigate("/loginpage");
								}}
							>
								Sign In
							</button>
						</div>
					</div>
				</div>
			</div>

		</div>
	);
}

export default RegisterPage;