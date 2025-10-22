import { useEffect, useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import "../../Assets/dashboard.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import AdminHome from "../AdminTabs/AdminHome";
import AdminRequests from "../AdminTabs/AdminRequests";
import { Box, useMediaQuery, Snackbar, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import EquipmentHistory from "../AdminTabs/EquipmentHistory";
import Footer from "../Footer";

const AdminDashboard = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isSmallScreen = useMediaQuery("(max-width:600px)");
	const tabHashes = ["#admin-home", "#admin-requests", "#equipment-history"];
	const user = JSON.parse(localStorage.getItem("userDetails")) || {};
	const initialTab = tabHashes.indexOf(location.hash);
	const [value, setValue] = useState(initialTab === -1 ? 0 : initialTab);

	useEffect(() => {
		const hashIndex = tabHashes.indexOf(location.hash);
		if (hashIndex !== -1 && hashIndex !== value) {
			setValue(hashIndex);
		}
	}, [location.hash]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
		navigate(tabHashes[newValue]);
	};

	return (
		<div style={{ backgroundColor: "rgba(255, 250, 241, 1)" }}>
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
				<Tab icon={<RequestPageOutlinedIcon />} label="MY REQUESTS" className="home-tab" />
				<Tab icon={<RequestPageOutlinedIcon />} label="EQUIPMENT hISTORY" className="home-tab" />
			</Tabs>

			<Box sx={{ mt: 3 }} >
				{value === 0 && <AdminHome />}
				{value === 1 && <AdminRequests />}
				{value === 2 && <EquipmentHistory />}
			</Box>
			<Footer role={user?.role} />
		</div>
	);
};

export default AdminDashboard;