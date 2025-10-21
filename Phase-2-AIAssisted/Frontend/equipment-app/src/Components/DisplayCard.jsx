import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router";
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import placeholder from "../images/placeholder.webp"

function DisplayCard({ objects, setObjects, handleEditOpen }) {
	const [imageMap, setImageMap] = useState({});
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(["", "success"])
	const navigate = useNavigate();

	const getStatus = (status) => {
		if (status > 0) {
			return ["success", "AVAILABLE"];
		} else return ["error", "OUT OF STOCK"];
	}

	useEffect(() => {
		const cached = JSON.parse(localStorage.getItem("pexelsImageCache")) || {};

		const fetchImageForObject = async (objName) => {
			if (cached[objName]) return cached[objName];

			try {
				const res = await fetch(
					`https://api.pexels.com/v1/search?query=${encodeURIComponent(
						objName
					)}&per_page=1`,
					{
						headers: { Authorization: "HiVKpphRuffD5Twu5yBzmqS41ON5hpEToFF40esWtDKRK06iWCtqKNoJ" },
					}
				);
				const data = await res.json();

				const imageUrl = data.photos?.[0]?.src?.medium;
				if (imageUrl) {
					cached[objName] = imageUrl;
					localStorage.setItem("pexelsImageCache", JSON.stringify(cached));
					return imageUrl;
				} else {
					return placeholder;
				}
			} catch (err) {
				console.error("Error fetching image for", objName, err);
				return placeholder;
			}
		};

		const fetchAllImages = async () => {
			const results = {};
			for (const obj of objects) {
				const imageUrl = await fetchImageForObject(obj.name);
				results[obj.name] = imageUrl;
			}
			setImageMap(results);
		};

		if (objects.length > 0) fetchAllImages();
	}, [objects]);

	const handleRequest = async (card) => {
		const user = JSON.parse(localStorage.getItem("userDetails")) || {};
		const requestDate = new Date();
		const returnDate = new Date(requestDate);
		returnDate.setDate(returnDate.getDate() + 15);
		const payload = {
			equipment: card,
			role: user.role,
			status: "PENDING",
			requestDate,
			returnDate,
			...(user.role === "Student"
				? { student: user }
				: { teacher: user })
		};
		await axios.post('http://localhost:5000/api/v1/createRequest', payload).then((response) => {
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage(["Equipment Requested Successfully", "success"])
		}).catch((error) => {
			console.error("Error fetching equipments:", error);
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage([error.response.data.message, "error"])
		})
	}

	const handleDelete = async (card) => {
		const role = localStorage.getItem("role");
		await axios.delete(`http://localhost:5000/api/v1/equipment/${card.id}`, {
			data: { role: role }
		}).then((response) => {
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage([response.data.message, "success"]);
			const myEquipments = objects.filter(item => item.id !== card.id);
			setObjects(myEquipments)

		}).catch((error) => {
			console.error("Error fetching equipments:", error);
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage([error.response.data.message, "error"])
		})
	}

	return (
		<div>
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				<Grid container spacing={{ xs: 1, sm: 1, md: 2 }} columns={{ xs: 4, sm: 12, md: 12, lg: 12 }}>
					{!objects || objects.length > 0 ?
						objects.map((card, index) => {
							const userId = JSON.parse(localStorage.getItem("userDetails")).enrollmentNum;
							const role = JSON.parse(localStorage.getItem("userDetails")).role;
							const userRequests = localStorage.getItem('requests') ? JSON.parse(localStorage.getItem('requests')) : [];
							const currRequest = userRequests.data.filter(req => req.equipment.id === card.id);
							const latestRequest = currRequest.reduce((latest, current) => {
								return new Date(current.requestDate) > new Date(latest.requestDate) ? current : latest;
							}, currRequest[0]);
							const requestStatus = latestRequest ? latestRequest.status : null;
							const buttonText = requestStatus === "PENDING" ? "Already Requested" : requestStatus === "APPROVED" ? "Equipment Issued" : "Request";
							const isRequestAllowed = card.availability > 0 && (!requestStatus || requestStatus === "REJECTED" || requestStatus === "RETURNED");
							return (
								<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
									<Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)", borderRadius: "6px" }} className='card-width' >
										{imageMap[card.name] ? <CardMedia
											component="img"
											alt="green iguana"
											height="140"
											image={imageMap[card.name]}
										/> :
											<Skeleton variant="rectangular" width={345} height={118} />}
										<CardContent >
											<Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold", fontFamily: "Roboto", textTransform: "uppercase", color: "rgba(102, 67, 67, 1)" }}>
												{card.name}
											</Typography>
											<Typography variant="body2" sx={{ color: 'text.secondary' }}>
												<Typography variant="button"><b>Category:</b>&nbsp;</Typography>
												<Typography variant="overline">{card.category}</Typography>
												<br />
												<div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
													<Typography variant="button"><b>Quantity:</b>&nbsp;{card.quantity}</Typography>
													<Typography variant="button"><b>Available:</b>&nbsp;{card.availability}</Typography>
												</div>
											</Typography>
										</CardContent>
										{role === "Admin" ? (
											<CardActions style={{ float: 'right' }}>
												<Button size="small" className={'btn-request-edit'} onClick={() => { handleEditOpen(card) }}><b><EditIcon /></b></Button>
												<Button size="small" className={'btn-request-delete'} onClick={() => { handleDelete(card) }}><b><DeleteIcon /></b></Button>
												{isRequestAllowed || card.condition === "OUT OF STOCK" && <Chip label={getStatus(card.availability)[1]} color={getStatus(card.availability)[0]} size='small' />}
											</CardActions>
										) :
											<CardActions style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
												<Button size="small" disabled={!isRequestAllowed} className={isRequestAllowed ? 'btn-request' : ""} onClick={() => handleRequest(card)}><b>{buttonText}</b></Button>
												{isRequestAllowed || card.condition === "OUT OF STOCK" && <Chip label={getStatus(card.availability)[1]} color={getStatus(card.availability)[0]} size='small' />}
											</CardActions>
										}
									</Card>
								</Grid>
							)
						})
						: <h4>No Equipments Available</h4>}
				</Grid>
			</Box>
			{alert && <Snackbar
				open={true}
				autoHideDuration={4000}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert severity={alertMessage[1]} className="d-flex justify-content-center align-items-center mt-1 fs-5 " style={{ border: "1px solid black" }}>{alertMessage[0]}</Alert>
			</Snackbar>
			}
		</div>
	)
}

export default DisplayCard