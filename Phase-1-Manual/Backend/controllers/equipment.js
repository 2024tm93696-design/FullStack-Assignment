const Equipment = require('../models/equipmentSchema.js');

const generateId = () => {
	const id = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
	return id;
}

const getEquipments = async (req, res) => {
	try {
		let equipmentDetails = await Equipment.find();
		if (equipmentDetails) {
			res.status(200).send({
				statusCode: 200,
				message: "Equipment details fetched successfully",
				data: equipmentDetails
			});
		} else {
			res.status(404).send({
				statusCode: 404,
				message: "No equipment found"
			});
		}
	} catch (err) {
		res.status(500).json(err);
	}
}

const getEquipmentDetail = async (req, res) => {
	try {
		let equipment = await Equipment.findOne({ id: req.params.id });	
		if (equipment) {
			res.status(200).send({
				statusCode: 200,
				message: "Equipment details fetched successfully",
				data: equipment
			});
		} else {
			res.status(404).send({
				statusCode: 404,	
				message: "Equipment not found"
			});
		}	
	} catch (err) {
		res.status(500).json(err);
	}
}

const addEquipment = async (req, res) => {
	try {

		let newEquipment = new Equipment({
			...req.body,
			id: generateId()
		});
		isExsisting = await Equipment.findOne({ name: req.body.name, category: req.body.category });
		if (req.body.role && req.body.role === "Admin") {
			if (isExsisting) {
				res.status(400).send({
					statusCode: 400,
					message: "Equipment already exsists"
				});
			}else if(req.body.quantity < 0 || req.body.availability < 0 || req.body.availability > req.body.quantity) {
				res.status(400).send({
					statusCode: 400,
					message: "Invalid quantity or availability"	
				});
			} else {
				let result = await newEquipment.save();
				res.status(201).send({
					statusCode: 201,
					message: "Equipment added successfully",
					data: result
				});
			}
		} else {
			res.status(403).send({
				statusCode: 403,
				message: "Only users with role 'Admin' can add equipment"
			});
		}
	} catch (err) {
		res.status(500).json(err);
	}
}

const updateEquipment = async (req, res) => {
	try {
		let equipment = await Equipment.findOne({ id: req.params.id });
		if (req.body.role && req.body.role === "Admin") {
			if(req.body.quantity < 0 || req.body.availability < 0 || req.body.availability > req.body.quantity) {
				res.status(400).send({
					statusCode: 400,
					message: "Invalid quantity or availability"	
				});
			} else if (equipment) {
				equipment.name = req.body.name || equipment.name;
				equipment.category = req.body.category || equipment.category;
				equipment.condition = req.body.condition || equipment.condition;
				equipment.quantity = req.body.quantity || equipment.quantity;
				equipment.availability = req.body.availability || equipment.availability;
				let result = await equipment.save();
				res.status(200).send({
					statusCode: 200,
					message: "Equipment updated successfully",
					data: result
				});
			}
		} else {
			res.status(403).send({
				statusCode: 403,
				message: "Only users with role 'Admin' can update equipment"
		})
	}
	} catch (err) {
		res.status(500).json(err);
	}
}

const deleteEquipment = async (req, res) => {
	try {
		if (req.body.role && req.body.role === "Admin") {
			let equipment = await Equipment.findOne({ id: req.params.id });
			if(req.body.quantity < 0 || req.body.availability < 0 || req.body.availability > req.body.quantity) {
				res.status(400).send({
					statusCode: 400,
					message: "Invalid quantity or availability"	
				});
			}else if (equipment) {
				await Equipment.deleteOne({ id: req.params.id });
				res.status(200).send({
					statusCode: 200,
					message: "Equipment deleted successfully"
				});
			} else {
				res.status(404).send({
					statusCode: 404,
					message: "Equipment not found"
				});
			}
		} else {
			res.status(403).send({
				statusCode: 403,
				message: "Only users with role 'Admin' can delete equipment"
			});
		}
	} catch (err) {
		res.status(500).json(err);
	}
}

module.exports = {
	getEquipments,
	getEquipmentDetail,
	addEquipment,
	updateEquipment,
	deleteEquipment
};


