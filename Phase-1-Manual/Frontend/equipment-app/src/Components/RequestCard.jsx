import { useEffect, useState } from 'react'
import dayjs from "dayjs";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import "../Assets/dashboard.css";
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

function DisplayCard({ objects, showButton, setObjects }) {
	const [imageMap, setImageMap] = useState({});
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(["", "success"])

	const getStatus = (status) => {
		if (status === "APPROVED") {
			return "success";
		} else if (status === "RETURNED") {
			return "primary"
		} else if (status === "PENDING") {
			return "warning"
		} else return "error";
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
						headers: { Authorization: process.env.REACT_APP_PEXEL_ID },
					}
				);
				const data = await res.json();

				const imageUrl = data.photos?.[0]?.src?.medium;
				if (imageUrl) {
					cached[objName] = imageUrl;
					localStorage.setItem("pexelsImageCache", JSON.stringify(cached));
					return imageUrl;
				} else {
					return `https://loremflickr.com/400/300/${objName}`;
				}
			} catch (err) {
				console.error("Error fetching image for", objName, err);
				return `https://loremflickr.com/400/300/${objName}`;
			}
		};

		const fetchAllImages = async () => {
			const results = {};
			for (const obj of objects) {
				const imageUrl = await fetchImageForObject(obj.equipment.name);
				results[obj.equipment.name] = imageUrl;
			}
			setImageMap(results);
		};

		if (objects.length > 0) fetchAllImages();
	}, [objects]);

	const handleReturn = async(request) => {
		await axios.put(`http://localhost:5000/api/v1/markReturn/${request.id}`).then((response) => {
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage(["Equipment Returned SuccessFully", "success"]);
       const myEquipments = objects.filter(item => item.id !== request.id);
			 setObjects(myEquipments)
		}).catch((error) => {
			console.error("Error fetching equipments:", error);
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage([error.response.data.message,"error"])
		})
	}

	return (
		<div>
			<Grid container spacing={{ xs: 1, sm: 1, md: 2 }} columns={{ xs: 4, sm: 12, md: 12, lg: 12 }}>
				{!objects || objects.length > 0 ?
					objects.map((card, index) => {
						const requestDate = dayjs(card.requestDate).format("DD-MM-YYYY");
						const returnDate = dayjs(card.returnDate).format("DD-MM-YYYY")
						const today = dayjs().format("DD-MM-YYYY");
						
						return (
								<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
									<Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)", borderRadius: "6px" }} className='card-width' >
									{imageMap[card.equipment.name] ? <CardMedia
										component="img"
										alt="green iguana"
										height="140"
										image={imageMap[card.equipment.name]}
									/> :
										<Skeleton variant="rectangular" width={345} height={118} />}
									<CardContent >
										<Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold", fontFamily: "Roboto", textTransform: "uppercase", color: "rgba(102, 67, 67, 1)" }}>
											{card.equipment.name}
										</Typography>
										<Typography variant="body2" sx={{ color: 'text.secondary' }}>
											<Typography variant="button"><b>Category:</b>&nbsp;</Typography>
											<Typography variant="overline">{card.equipment.category}</Typography>
											<br />
											{/* <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}> */}
											<Typography variant="button"><b>Request Date:</b>&nbsp;{requestDate}</Typography><br />
											<Typography variant="button"><b>Return Date:</b>&nbsp;{returnDate}</Typography>
											{/* </div> */}
										</Typography>
									</CardContent>
									<CardActions style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", float: showButton ? "left" : "right" }}>
										{showButton &&
											<>
												<Button size="small" className='btn-request' onClick={() => handleReturn(card)}><b>Return Equipment</b></Button>
												{dayjs(card.returnDate).isBefore(dayjs(), 'day') && <Chip label="Over Due" color="error" size='small' />}
											</>}
										{!showButton && <Chip label={card.status} color={getStatus(card.status)} size='small' />}
									</CardActions>
								</Card>
							</Grid>
						)
					})
					: <h4>No Equipments Available</h4>}
			</Grid>
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