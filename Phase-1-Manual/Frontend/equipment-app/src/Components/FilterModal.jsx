import { React, useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { Snackbar, Alert } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import "../Assets/dashboard.css";

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};


const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
}));

export default function TransitionsModal({ objects, setFilteredObjects, defaultValues, request }) {
	const [alert, setAlert] = useState(false)
	const [searchText, setSearchText] = useState("")
	const [open, setOpen] = useState(false);
	const [isFilterApplied, setIsFilterApplied] = useState(false)
	const [filterValue, setFilterValue] = useState(defaultValues)
	const labelValue = {
			cameras: "CAMERAS",
			labEquipment: "LAB EQUIPMENT",
			musicalInstruments: "MUSICAL INSTRUMENTS",
			projectMaterials: "PROJECT MATERIALS",
			sportsKit: "SPORTS KIT"
	}

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleCategoryChange = (event) => {
		const { name, checked } = event.target;
		setFilterValue((prev) => ({
			...prev,
			categories: {
				...prev.categories,
				[name]: checked,
			},
		}));
	};

	const handleAvailabilityChange = (event) => {
		setFilterValue((prev) => ({
			...prev,
			isAvailable: event.target.checked,
		}));
	};

	const handleChange = () => {
		handleClose()
		setAlert(true)
		setTimeout(() => {
			setAlert(false)
		}, 4000)
		setIsFilterApplied(true)
	}

	const handleClearFilters = () => {
		setFilterValue((prev) => ({
			...prev,
			isAvailable: false,
			categories: Object.fromEntries(
				Object.keys(prev.categories).map(key => [key, false])
			),
		}));
	};

	const handleSearchChange = (event) => {
		setSearchText(event.target.value);
	}

	useEffect(() => {
		const selectedCategories = Object.entries(filterValue.categories)
			.filter(([key, value]) => value)
			.map(([key]) => key.toLowerCase());
		
		let filteredData = [...objects];

		if (filterValue.isAvailable) {
			filteredData = filteredData.filter(item => item.condition?.toLowerCase() === "available");
		}
		if (selectedCategories.length > 0) {
			filteredData = filteredData.filter(item =>
				selectedCategories.includes(request ?item.status?.toLowerCase().replace(/\s/g, ''): item.category?.toLowerCase().replace(/\s/g, ''))
			);
		}
		if (searchText.trim().length > 0) {
			filteredData = filteredData.filter(item =>
			 request? item.equipment.name?.toLowerCase().includes(searchText.toLowerCase()) :	item.name?.toLowerCase().includes(searchText.toLowerCase())
			);
		}
		setFilteredObjects(filteredData);

	}, [searchText, objects, filterValue]);

	return (
		<div>
			<Box sx={{ flexGrow: 1 }} className="search-filter">
				<Search className="search-bar">
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="Search…"
						inputProps={{ 'aria-label': 'search' }}
						value={searchText}
						onChange={handleSearchChange}
					/>
				</Search>
				<FilterAltOutlinedIcon sx={{ fontSize: "2.5rem" }} onClick={handleOpen} />
			</Box>
			{open &&

				<Modal
					aria-labelledby="transition-modal-title"
					aria-describedby="transition-modal-description"
					open={open}
					onClose={handleClose}
					closeAfterTransition
					slots={{ backdrop: Backdrop }}
					slotProps={{
						backdrop: {
							timeout: 500,
						},
					}}
				>
					<Fade in={open}>
						<Box sx={style}>
							<Typography id="transition-modal-title" variant="h6" component="h2">
								Filter Based On:
							</Typography>

							{/* Category Filter */}
							<Typography variant="subtitle1">Category:</Typography>
							<FormGroup sx={{ mb: 2 }}>
								{Object.keys(filterValue.categories)?.map(item => (
									<FormControlLabel
									key={item}
										control={<Checkbox name={item} checked={filterValue.categories[item] || false} onChange={handleCategoryChange} />}
										label={request? item.toUpperCase(): labelValue[item]}
									/>
								))
								}
							</FormGroup>
							{!request &&
								<>
									<Typography variant="subtitle1">Availability:</Typography>
									<FormGroup>
										<FormControlLabel
											control={<Checkbox checked={filterValue.isAvailable || false} onChange={handleAvailabilityChange} />}
											label="Only Show Available Items"
										/>
									</FormGroup>
								</>
							}
							<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
								<Button onClick={handleClearFilters}><b>Clear Filters</b></Button>
								<Button onClick={handleChange}><b>Apply Filter</b></Button>
							</div>
						</Box>
					</Fade>
				</Modal>
			}
			{alert && <Snackbar
				open={true}
				autoHideDuration={4000}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert severity="success" className="d-flex justify-content-center align-items-center mt-1 fs-5 " style={{ border: "1px solid black" }}>Filter Applied</Alert>
			</Snackbar>
			}
		</div>
	);
}
