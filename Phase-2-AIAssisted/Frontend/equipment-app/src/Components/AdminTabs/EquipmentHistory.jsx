import { useState, useEffect } from "react";
import "../../Assets/admin.css"
import {
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	IconButton, Collapse, Box, Typography, Button, Switch, Paper
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from 'axios';

function CollapsibleRow({ row, allRequests, setObjects }) {
	const [open, setOpen] = useState(false);
	const equipmentHistory = allRequests.filter(
		(req) => req.equipment.id === row.id
	);

	return (
		<>
			<TableRow className="details">
				<TableCell>
					<IconButton size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell>{row.name}</TableCell>
				<TableCell>{row.category}</TableCell>
				<TableCell>{row.condition}</TableCell>
				<TableCell>{row.quantity}</TableCell>
				<TableCell>{row.availability}</TableCell>
			</TableRow>

			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "rgba(255, 248, 244, 1)" }} colSpan={9}>
					<Collapse in={open} timeout="auto" unmountOnExit >
						<Box sx={{ margin: 2 }}>
							<>
								{/* Equipment History */}
								<Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
									History
								</Typography>
								<Table size="small">
									<TableHead>
										<TableRow className="collapse-th">
											<TableCell>Equipment Name</TableCell>
											<TableCell>Category</TableCell>
											<TableCell>Request Date</TableCell>
											<TableCell>Return Date</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Role</TableCell>
											<TableCell>User Name</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{equipmentHistory.map((h, idx) => (
											<TableRow key={idx}>
												<TableCell>{h.equipment.name}</TableCell>
												<TableCell>{h.equipment.category}</TableCell>
												<TableCell>{new Date(h.requestDate).toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "short",
													year: "numeric",
												})}</TableCell>
												<TableCell>{h.returnDate ? new Date(h.returnDate).toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "short",
													year: "numeric",
												}) : "-"}</TableCell>
												<TableCell>{h.status}</TableCell>
												<TableCell>{h.role}</TableCell>
												<TableCell>{h.student?.name || h.teacher?.name}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

export default function EquipmentHistory() {
	const [objects, setObjects] = useState([])
	const [errorAlert, setErrorAlert] = useState(false);
	const [error, setError] = useState("Something went wrong. Please try again later.");

	useEffect(() => {
		const fetchData = async () => {
			await axios.get('http://localhost:5000/api/v1/requests').then((response) => {
				setObjects(response.data.data || []);
				setErrorAlert(false);
			}).catch((error) => {
				console.error("Error fetching equipments:", error);
				setError(error.response.data.message);
				setErrorAlert(true);
			})
		}
		fetchData()
	}, []);

	const [filteredObjects, setFilteredObjects] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			await axios.get('http://localhost:5000/api/v1/equipments').then((response) => {
				setFilteredObjects(response.data.data.reverse() || [])
			}).catch((error) => {
				console.error("Error fetching equipments:", error);
			})
		}
		fetchData()
	}, []);

	return (
		<div style={{ margin: "2rem" }}>
			<TableContainer component={Paper} sx={{ mt: 2 }} >
				<Table stickyHeader>
					<TableHead
						sx={{
							backgroundColor: "rgba(177, 204, 42, 1)",
							position: "sticky",
							top: 0,
							zIndex: 2,
						}}>
						<TableRow className="equip-table-th">
							<TableCell />
							<TableCell><b>Equipment Name</b></TableCell>
							<TableCell><b>Category</b></TableCell>
							<TableCell><b>Condition</b></TableCell>
							<TableCell><b>Quantity</b></TableCell>
							<TableCell><b>Availability</b></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredObjects.map((row, idx) => (
							<CollapsibleRow key={idx} row={row} allRequests={objects} setObjects={setObjects} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}
