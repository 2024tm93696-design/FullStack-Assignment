import { useState } from "react";
import "../../Assets/admin.css"
import {
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	IconButton, Collapse, Box, Typography, Button, Switch, Paper
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

function CollapsibleRow({ row, allRequests, setObjects }) {
	const [open, setOpen] = useState(false);
	const [view, setView] = useState("equipment");
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(["", "success"])
	const [showButton, setShowButton] = useState(true);

	const person = row.role === "Student" ? row.student : row.teacher;
	const user = row.role === "Student" ? "Student" : "Staff";

	// Filter histories
	const equipmentHistory = allRequests.filter(
		(req) => req.equipment.id === row.equipment.id
	);
	const personHistory = allRequests.filter((req) =>
		row.role === "Student"
			? req.student?.enrollmentNum === person.enrollmentNum
			: req.teacher?.enrollmentNum === person.enrollmentNum
	);

	const handleApprove = async (request) => {
		await axios.put(`http://localhost:5000/api/v1/updateRequest/${request.id}`, { status: "APPROVED" }).then((response) => {
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage(["Equipment Approved SuccessFully", "success"]);
			setShowButton(false)

		}).catch((error) => {
			console.error("Error Approving equipments:", error);
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage([error.response.data.message, "error"])
		})
	}

	const handleReject = async (request) => {
		await axios.put(`http://localhost:5000/api/v1/updateRequest/${request.id}`, { status: "REJECTED" }).then((response) => {
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage(["Equipment Rejected", "success"]);
			setShowButton(false)

		}).catch((error) => {
			console.error("Error Rejecting equipments:", error);
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage([error.response.data.message, "error"])
		})
	}

	return (
		<>
			<TableRow>
				<TableCell>
					<IconButton size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell>{row.equipment.name}</TableCell>
				<TableCell>{row.equipment.category}</TableCell>
				<TableCell>{row.equipment.condition}</TableCell>
				<TableCell>{person.name}</TableCell>
				<TableCell>{user}</TableCell>
				<TableCell>{new Date(row.requestDate).toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short",
					year: "numeric",
				})}</TableCell>
				<TableCell>{new Date(row.returnDate).toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short",
					year: "numeric",
				})}</TableCell>
				<TableCell style={{ padding: "10px", display: "flex", marginTop: "22px" }}>
					<Button variant="contained" color="success" size="small" sx={{ mr: 1 }} onClick={() => handleApprove(row)} disabled={!showButton}>
						Approve
					</Button>
					<Button variant="contained" color="error" size="small" onClick={() => handleReject(row)} disabled={!showButton}>
						Reject
					</Button>
				</TableCell>
			</TableRow>

			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "rgba(255, 248, 244, 1)" }} colSpan={9}>
					<Collapse in={open} timeout="auto" unmountOnExit >
						<Box sx={{ margin: 2 }}>
							<Box display="flex" alignItems="center" mb={1}>
								<Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
									{view === "equipment" ? "Equipment Details" : `${user} Details`}
								</Typography>
								<Typography variant="body2" sx={{ mr: 1, fontWeight: "bold" }}>
									Show {view === "equipment" ? `${user}` : "Equipment"}
								</Typography>
								<Switch
									checked={view === "person"}
									onChange={() => setView(view === "equipment" ? "person" : "equipment")}
								/>
							</Box>

							{view === "equipment" ? (
								<>
									{/* Equipment Details */}
									<Table size="small">
										<TableHead>
											<TableRow className="collapse-th">
												<TableCell>Equipment Name</TableCell>
												<TableCell>Category</TableCell>
												<TableCell>Condition</TableCell>
												<TableCell>Quantity</TableCell>
												<TableCell>Available</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell>{row.equipment.name}</TableCell>
												<TableCell>{row.equipment.category}</TableCell>
												<TableCell>{row.equipment.condition}</TableCell>
												<TableCell>{row.equipment.quantity}</TableCell>
												<TableCell>{row.equipment.availability}</TableCell>
											</TableRow>
										</TableBody>
									</Table>

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
												<TableCell>{user} Name</TableCell>
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
													<TableCell>{h.student?.name || h.teacher?.name}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</>
							) : (
								<>
									{/* Person Details */}
									<Table size="small">
										<TableHead>
											<TableRow className="collapse-th">
												<TableCell>Name</TableCell>
												<TableCell>Enrollment #</TableCell>
												<TableCell>Email</TableCell>
												<TableCell>Role</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell>{person.name}</TableCell>
												<TableCell>{person.enrollmentNum}</TableCell>
												<TableCell>{person.email}</TableCell>
												<TableCell>{row.role}</TableCell>
											</TableRow>
										</TableBody>
									</Table>

									{/* Person History */}
									<Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
										History
									</Typography>
									<Table size="small">
										<TableHead>
											<TableRow className="collapse-th">
												<TableCell>{user} Name</TableCell>
												<TableCell>Equipment Name</TableCell>
												<TableCell>Category</TableCell>
												<TableCell>Request Date</TableCell>
												<TableCell>Return Date</TableCell>
												<TableCell>Status</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{personHistory.map((h, idx) => (
												<TableRow key={idx}>
													<TableCell>{h.student?.name || h.teacher?.name}</TableCell>
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
												</TableRow>
											))}
										</TableBody>
									</Table>
								</>
							)}
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
			{alert && <Snackbar
				open={true}
				autoHideDuration={4000}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert severity={alertMessage[1]} className="d-flex justify-content-center align-items-center mt-1 fs-5 " style={{ border: "1px solid black" }}>{alertMessage[0]}</Alert>
			</Snackbar>
			}
		</>
	);
}

export default function PendingRequestsTable({ objects, setObjects }) {
	const pendingRequests = objects.filter((req) => req.status === "PENDING");

	return (
		<TableContainer component={Paper} sx={{ mt: 2 }}>
			<Table stickyHeader>
				<TableHead
					sx={{
						backgroundColor: "rgba(255, 209, 123, 1)",
						position: "sticky",
						top: 0,
						zIndex: 2,
					}}>
					<TableRow className="table-th">
						<TableCell />
						<TableCell><b>Equipment Name</b></TableCell>
						<TableCell><b>Category</b></TableCell>
						<TableCell><b>Condition</b></TableCell>
						<TableCell><b>Person Name</b></TableCell>
						<TableCell><b>Role</b></TableCell>
						<TableCell><b>Request Date</b></TableCell>
						<TableCell><b>Return Date</b></TableCell>
						<TableCell><b>Actions</b></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{pendingRequests.map((row, idx) => (
						<CollapsibleRow key={idx} row={row} allRequests={objects} setObjects={setObjects} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
