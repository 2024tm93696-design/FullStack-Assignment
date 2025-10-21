import { useEffect, useState } from "react";
import axios from "axios";
import "../../Assets/dashboard.css";
import DisplayCard from "../DisplayCard";
import FilterModal from "../FilterModal";
import { Snackbar, Alert } from '@mui/material';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

function AdminHome() {
	const [objects, setObjects] = useState([]);
	const [filteredObjects, setFilteredObjects] = useState([]);
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(["", "success"])
	const [isEdit, setIsEdit] = useState(false)
	const [cardId, setCardId] = useState("")

	const [open, setOpen] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		category: "",
		condition: "",
		quantity: "",
		availability: "",
	});

	const [errors, setErrors] = useState({});

	const handleClickOpen = (card) => {
		setOpen(true);
		if (card.length > 0) {
			setIsEdit(true);
			setCardId(card.id);
			setFormData({
				name: card.name,
				category: card.category,
				condition: card.condition,
				quantity: card.quantity,
				availability: card.availability,
			});
		}
	};

	const handleClose = () => {
		setOpen(false);
		setFormData({
			name: "",
			category: "",
			condition: "",
			quantity: "",
			availability: "",
		});
		setErrors({});
	};

	const validate = () => {
		const newErrors = {};

		if (!formData.name.trim()) newErrors.name = "Equipment name is required";
		if (!formData.category.trim()) newErrors.category = "Category is required";
		if (!formData.condition.trim()) newErrors.condition = "Condition is required";

		if (!formData.quantity) newErrors.quantity = "Quantity is required";
		else if (isNaN(formData.quantity) || formData.quantity < 0)
			newErrors.quantity = "Quantity must be a positive number";

		if (!formData.availability) newErrors.availability = "Availability is required";
		else if (isNaN(formData.availability) || formData.availability < 0)
			newErrors.availability = "Availability must be a valid non-negative number";
		else if (parseInt(formData.availability) > parseInt(formData.quantity))
			newErrors.availability = "Availability cannot exceed quantity";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!validate()) return;

		try {
			const payload = {
				name: formData.name.trim(),
				category: formData.category.trim(),
				condition: formData.condition.trim().toUpperCase(),
				quantity: parseInt(formData.quantity),
				availability: parseInt(formData.availability),
				role: localStorage.getItem('role'),
			};

			console.log("Submitting:", payload);
			if (isEdit) {
				await axios.put(`http://localhost:5000/api/v1/equipment/${cardId}`, payload).then((response) => {
					fetchData()
					setAlert(true)
					setTimeout(() => {
						setAlert(false)
					}, 4000)
					setAlertMessage([response.data.message, "success"]);
					setIsEdit(false)
				});
			} else {
				await axios.post("http://localhost:5000/api/v1/addEquipment", payload).then((response) => {

					// refetch or append to local state
					fetchData()
					setAlert(true)
					setTimeout(() => {
						setAlert(false)
					}, 4000)
					setAlertMessage([response.data.message, "success"]);
				});
			}
			handleClose();
		} catch (error) {
			console.error("Error fetching equipments:", error);
			setAlert(true)
			setTimeout(() => {
				setAlert(false)
			}, 4000)
			setAlertMessage([error.response.data.message, "error"])
			setIsEdit(false)
		}
	};

	const fetchData = async () => {
		try {
			const { data } = await axios.get("http://localhost:5000/api/v1/equipments");
			setObjects(data.data || []);
			setFilteredObjects(data.data || []);
		} catch (error) {
			console.error("Error fetching equipments:", error);
		}
	};

	useEffect(() => {

		fetchData();
	}, []);
	console.log(isEdit, 'ed');


	const filterDefault = {
		categories: {
			cameras: false,
			labEquipment: false,
			musicalInstruments: false,
			projectMaterials: false,
			sportsKit: false,
		},
		isAvailable: false,
	};

	return (
		<div className="home-container">
			<FilterModal
				objects={objects}
				setFilteredObjects={setFilteredObjects}
				defaultValues={filterDefault}
			/>

			<div className="button-cont">
				<Button
					style={{ backgroundColor: "rgba(238, 252, 255, 1)", color: "black" }}
					onClick={() => handleClickOpen({})}
				>
					ADD EQUIPMENT
				</Button>

				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>{isEdit ? "Edit" : "Add"} Equipment</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{isEdit ? "Edit to update the details of Existing Equipment" : "Fill in the details below to register a new item in the inventory."}
						</DialogContentText>
						<form onSubmit={handleSubmit} id="equipment-form">
							<TextField
								autoFocus
								margin="dense"
								id="name"
								name="name"
								label="Name"
								type="text"
								fullWidth
								variant="outlined"
								value={formData.name}
								onChange={handleChange}
								error={!!errors.name}
								helperText={errors.name}
							/>

							<TextField
								margin="dense"
								id="category"
								name="category"
								label="Category"
								type="text"
								fullWidth
								variant="outlined"
								value={formData.category}
								onChange={handleChange}
								error={!!errors.category}
								helperText={errors.category}
							/>

							<TextField
								margin="dense"
								id="condition"
								name="condition"
								label="Condition"
								type="text"
								fullWidth
								variant="outlined"
								value={formData.condition}
								onChange={handleChange}
								error={!!errors.condition}
								helperText={errors.condition}
							/>

							<TextField
								margin="dense"
								id="quantity"
								name="quantity"
								label="Quantity"
								type="number"
								fullWidth
								variant="outlined"
								value={formData.quantity}
								onChange={handleChange}
								error={!!errors.quantity}
								helperText={errors.quantity}
							/>

							<TextField
								margin="dense"
								id="availability"
								name="availability"
								label="Availability"
								type="number"
								fullWidth
								variant="outlined"
								value={formData.availability}
								onChange={handleChange}
								error={!!errors.availability}
								helperText={errors.availability}
							/>
						</form>
					</DialogContent>

					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button type="submit" form="equipment-form">
							{isEdit ? "Update" : "Add"}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
			{alert && <Snackbar
				open={true}
				autoHideDuration={4000}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert severity={alertMessage[1]} className="d-flex justify-content-center align-items-center mt-1 fs-5 " style={{ border: "1px solid black" }}>{alertMessage[0]}</Alert>
			</Snackbar>
			}
			<DisplayCard objects={filteredObjects} setObjects={setObjects} handleEditOpen={(card) => handleClickOpen(card)} />
		</div>
	);
}

export default AdminHome;
