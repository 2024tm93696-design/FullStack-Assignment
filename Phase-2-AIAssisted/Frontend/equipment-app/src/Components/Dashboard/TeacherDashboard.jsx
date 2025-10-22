import { useEffect, useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import "../../Assets/dashboard.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import Home from "../DashboardTabs/Home";
import MyEquipment from "../DashboardTabs/MyEquipment";
import MyRequests from "../DashboardTabs/MyRequests";
import { Box, useMediaQuery, Snackbar, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../Footer";
import axios from "axios";

const TeacherDashboard = () => {
	const [requests, setRequests] = useState([]);
	const [errorAlert, setErrorAlert] = useState(false);
	const [error, setError] = useState("Something went wrong. Please try again later.");
	const navigate = useNavigate();
	const location = useLocation();
	const user = JSON.parse(localStorage.getItem("userDetails")) || {};
	const isSmallScreen = useMediaQuery("(max-width:600px)");

	// Mapping tabs to URL hashes
	const tabHashes = ["#home", "#my-equipment", "#my-requests"];

	// Determine initial tab from URL hash
	const initialTab = tabHashes.indexOf(location.hash);
	const [value, setValue] = useState(initialTab === -1 ? 0 : initialTab);

	// Update tab if user navigates via URL
	useEffect(() => {
		const hashIndex = tabHashes.indexOf(location.hash);
		if (hashIndex !== -1 && hashIndex !== value) {
			setValue(hashIndex);
		}
	}, [location.hash]); // runs when URL hash changes

	const handleChange = (event, newValue) => {
		setValue(newValue);
		navigate(tabHashes[newValue]); // update URL hash
	};

	useEffect(() => {
		const fetchData = async () => {
			const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
			await axios.get(`http://localhost:5000/api/v1/teacherRequests/${userDetails.enrollmentNum}`).then((response) => {
				localStorage.setItem('requests', JSON.stringify(response.data));
				setRequests(response.data || []);
				setErrorAlert(false);
			}).catch((error) => {
				console.error("Error fetching equipments:", error);
				setError(error);
				setErrorAlert(true);
			})
		}
		fetchData()
	}, []);

	return (
		<div style={{ backgroundColor: "rgba(247, 251, 241, 0.88)" }}>
			<DashboardNavbar />

			<Tabs
				value={value}
				onChange={handleChange}
				aria-label="icon label tabs example"
				centered
				variant={isSmallScreen ? "scrollable" : "fullWidth"}
				scrollButtons={isSmallScreen ? "auto" : false}
				allowScrollButtonsMobile
			>
				<Tab icon={<HomeOutlinedIcon />} label="HOME" className="home-tab" />
				<Tab icon={<HandymanOutlinedIcon />} label="MY EQUIPMENTS" className="home-tab" />
				<Tab icon={<RequestPageOutlinedIcon />} label="MY REQUESTS" className="home-tab" />
			</Tabs>

			<Box sx={{ mt: 3 }} >
				{value === 0 && <Home />}
				{value === 1 && <MyEquipment />}
				{value === 2 && <MyRequests />}
			</Box>
			{errorAlert && <Snackbar
				open={true}
				autoHideDuration={7000}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert severity="error" className="login-alert d-flex justify-content-center align-items-center mt-1 ">{error}</Alert>
			</Snackbar>
			}
			<Footer role={user?.role} />
		</div>
	);
};

export default TeacherDashboard;
