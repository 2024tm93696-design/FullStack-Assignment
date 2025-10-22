import React, { useState } from "react";
import "../../Assets/loginPage.css";
import logoEq from "../../images/logoEq.webp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyIcon from "@mui/icons-material/Key";
import {
	TextField,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	InputAdornment,
	Snackbar,
	Alert,
	MenuItem,
	Select,
} from "@mui/material";
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
	const [alertMessage, setAlertMessage] = useState("")
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
				setTimeout(() => {
					setAlert(false)
				}, 4000)
				setAlertMessage(data.message)
			}).catch((err) => {
				console.log(err)
				setAlert(true)
				setTimeout(() => {
					setAlert(false)
				}, 4000)
				setAlertMessage("User with this Email ID already exists")
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
							<h3 className="login-h4 fw-b">Create Account</h3>
							<form
								onSubmit={formik.handleSubmit}
								style={{ width: "420px", margin: "auto", display: "flex", flexDirection: "column" }}
							>
								{/* Role Selection */}
								<FormControl component="fieldset" fullWidth margin="normal">
									<FormLabel component="legend" style={{fontWeight:"bold"}}>Register As</FormLabel>
									<RadioGroup
										row
										name="role"
										value={formik.values.role}
										onChange={formik.handleChange}
										sx={{display:"flex", justifyContent:"center"}}
									>
										<FormControlLabel
											value="Student"
											control={<Radio />}
											label="Student"
										/>
										<FormControlLabel
											value="Teacher"
											control={<Radio />}
											label="Staff"
										/>
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
									type="number"
									value={formik.values.enrollmentNum}
									onChange={formik.handleChange}
									error={
										formik.touched.enrollmentNum && Boolean(formik.errors.enrollmentNum)
									}
									helperText={
										formik.touched.enrollmentNum && formik.errors.enrollmentNum
									}
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<BadgeOutlinedIcon />
											</InputAdornment>
										),
									}}
								/>

								{/* Name */}
								<TextField
									fullWidth
									id="name"
									name="name"
									label="Name"
									value={formik.values.name}
									onChange={formik.handleChange}
									error={formik.touched.name && Boolean(formik.errors.name)}
									helperText={formik.touched.name && formik.errors.name}
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<PersonOutlineIcon />
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

								{/* Security Question */}
								<FormControl fullWidth margin="normal">
									<FormLabel>Security Question</FormLabel>
									<Select
										id="sques"
										name="sques"
										value={formik.values.sques}
										onChange={formik.handleChange}
										displayEmpty
										error={formik.touched.sques && Boolean(formik.errors.sques)}
									>
										<MenuItem value="">
											<em>Select a question</em>
										</MenuItem>
										{options.map((opt) => (
											<MenuItem key={opt.value} value={opt.value}>
												{opt.label}
											</MenuItem>
										))}
									</Select>
									{formik.touched.sques && formik.errors.sques && (
										<p style={{ color: "red", marginTop: "4px" }}>{formik.errors.sques}</p>
									)}
								</FormControl>

								{/* Answer */}
								<TextField
									fullWidth
									id="ans1"
									name="ans1"
									label="Answer"
									value={formik.values.ans1}
									onChange={formik.handleChange}
									error={formik.touched.ans1 && Boolean(formik.errors.ans1)}
									helperText={formik.touched.ans1 && formik.errors.ans1}
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<QuestionAnswerOutlinedIcon />
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

								{/* Confirm Password */}
								<TextField
									fullWidth
									id="cpassword"
									name="cpassword"
									label="Confirm Password"
									type="password"
									value={formik.values.cpassword}
									onChange={formik.handleChange}
									error={formik.touched.cpassword && Boolean(formik.errors.cpassword)}
									helperText={formik.touched.cpassword && formik.errors.cpassword}
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<KeyIcon />
											</InputAdornment>
										),
									}}
								/>

								{/* Submit */}
								<button
									className="btn btn-signin mt-3"
									type="submit"
									disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
								>
									Sign Up
								</button>

								{/* Alerts */}
								{alert && (
									<Snackbar
										open={alert}
										autoHideDuration={3000}
										onClose={() => setAlert(false)}
										anchorOrigin={{ vertical: "top", horizontal: "right" }}
									>
										<Alert severity="error">
											{alertMessage}
										</Alert>
									</Snackbar>
								)}
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