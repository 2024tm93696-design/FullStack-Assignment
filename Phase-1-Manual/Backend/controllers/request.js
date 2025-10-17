const Request = require("../models/requestSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Equipment = require("../models/equipmentSchema.js");

const generateId = () => {
	const id = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
	return id;
}

const createRequest = async (req, res) => {
	try {
		const { equipment, requestDate, returnDate, role, student, teacher } = req.body;

		// Check if equipment already booked during given date range
		const overlap = await Request.findOne({
			"equipment.id": equipment.id,
			status: "APPROVED",
			$and: [
				{ requestDate: { $lte: new Date(returnDate) } },
				{ returnDate: { $gte: new Date(requestDate) } }
			]
		});

		if (overlap) {
			return res.status(400).json({
				statusCode: 400,
				message: "Requested equipment is already assigned to someone for the selected dates."
			});
		}

		let userField, userValue;
		if (role === "Student") {
			userField = "student.enrollmentNum";
			userValue = student.enrollmentNum;
		} else if (role === "Teacher") {
			userField = "teacher.enrollmentNum";
			userValue = teacher.enrollmentNum;
		} else {
			return res.status(400).json({
				statusCode: 400,
				message: "Invalid role. Must be 'Student' or 'Teacher'."
			});
		}

		// Check for existing duplicate requests by same user for same equipment
		const duplicateRequest = await Request.findOne({
			"equipment.id": equipment.id,
			[userField]: userValue,
			status: { $in: ["PENDING", "APPROVED"] },
			$and: [
				{ requestDate: { $lte: new Date(returnDate) } },
				{ returnDate: { $gte: new Date(requestDate) } }
			]
		});

		if (duplicateRequest) {
			return res.status(400).json({
				statusCode: 400,
				message: "You already have a request for this equipment in the selected date range."
			});
		}

		let newRequest = new Request({
			id: generateId(),
			equipment,
			status: "PENDING",
			role,
			requestDate,
			returnDate,
			...(role === "Student" ? { student } : { teacher }) // dynamic assignment
		});

		let result = await newRequest.save();

		return res.status(201).json({
			statusCode: 201,
			message: `Request for ${equipment.name} created successfully.`,
			data: result
		});
	} catch (err) {
		console.error("Error creating request:", err);
		res.status(500).json({
			statusCode: 500,
			message: "An error occurred while creating the request.",
			error: err.message
		});
	}
};

// Staff/Admin: Approve or reject a request
const updateRequestStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!["APPROVED", "REJECTED"].includes(status)) {
			return res.status(400).json({
				statusCode: 400,
				message: "Invalid status update."
			});
		}

		const request = await Request.findOne({ id });
		if (!request) return res.status(404).json({
			statusCode: 404,
			message: "Request not found"
		});
		if (request.status === "APPROVED" && status === "APPROVED" || request.status === "REJECTED" && status === "REJECTED") {
			return res.status(400).json({
				statusCode: 400,
				message: "Request is already approved."
			});
		}

		// If approving, again check overlap

		if (status === "APPROVED") {
			const overlap = await Request.findOne({
				"equipment.id": request.equipment.id,
				status: "APPROVED",
				id: { $ne: id },
				$and: [
					{ requestDate: { $lte: new Date(request.returnDate) } },
					{ returnDate: { $gte: new Date(request.requestDate) } }
				]
			});
			if (overlap) {
				return res.status(400).json({
					message: "Equipment already approved for overlapping dates."
				});
			}
		}
		request.status = status;
		request.equipment.quantity = Number(request.equipment.quantity);
		request.equipment.availability = Number(request.equipment.availability);
		request.equipment.availability -= 1;
		if (request.equipment.availability <= 0) request.equipment.condition = "OUT OF STOCK";
		await request.save();
		if (status === "APPROVED") {
			if (request.role === "Student") {
				await Student.findOneAndUpdate(
					{ enrollmentNum: request.student.enrollmentNum },
					{ $addToSet: { equipment: request.equipment } }, // add only if not already present
					{ new: true }
				);
			} else {
				await Teacher.findOneAndUpdate(
					{ enrollmentNum: request.teacher.enrollmentNum },
					{ $addToSet: { equipment: request.equipment } }, // add only if not already present
					{ new: true }
				);
			}

			if (request.equipment.availability > 0) {
				await Equipment.findOneAndUpdate(
					{ id: request.equipment.id },
					{ $inc: { availability: -1 } }
				);
			} else {
				await Equipment.findOneAndUpdate(
					{ id: request.equipment.id },
					[
						{
							$set: {
								"condition": {
									$cond: [
										{ $eq: ["$condition", "AVAILABLE"] },
										"OUT OF STOCK",
										"$condition"
									]
								}
							}
						}
					],
					{ new: true }
				);

				return res.status(400).json({ message: "No available units left for this equipment." });
			}
		}

		res.status(200).json({
			statusCode: 200,
			message: `Request ${status}`, request
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Mark as returned
const markAsReturned = async (req, res) => {
	try {
		const { id } = req.params;
		const request = await Request.findOne({ id });

		if (!request) return res.status(404).json({
			statusCode: 404,
			message: "Request not found"
		});
		if (request.status !== "APPROVED")
			return res.status(400).json({
				statusCode: 400,
				message: "Only approved requests can be marked as returned."
			});

		request.status = "RETURNED";
		request.equipment.quantity = Number(request.equipment.quantity);
		request.equipment.availability = Number(request.equipment.availability);
		if (request.status === "RETURNED") {
			if (request.role === "Student") {
				await Student.findOneAndUpdate(
					{ enrollmentNum: request.student.enrollmentNum },
					{ $pull: { equipment: { id: request.equipment.id } } },
					{ new: true }
				);
			} else {
				await Teacher.findOneAndUpdate(
					{ enrollmentNum: request.teacher.enrollmentNum },
					{ $pull: { equipment: { id: request.equipment.id } } },
					{ new: true }
				);
			}
			await Equipment.findOneAndUpdate(
				{ id: request.equipment.id },
				[
					{
						$set: {
							"availability": { $add: ["$availability", 1] },
							"condition": {
								$cond: [
									{ $eq: ["$condition", "OUT OF STOCK"] },
									"AVAILABLE",
									"$condition"
								]
							}
						}
					}
				],
				{ new: true }
			);
			request.equipment.availability += 1;
			request.equipment.condition = "AVAILABLE"
		}
		await request.save();
		res.status(200).json({
			statusCode: 200,
			message: `Equipment ${request.equipment.name} marked as returned`,
			data: request
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get all requests (admin/staff view)
const getAllRequests = async (req, res) => {
	try {
		const requests = await Request.find();
		res.status(200).json({
			statusCode: 200,
			message: "All requests fetched successfully",
			data: requests
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Student: Get my own requests
const getMyRequests = async (req, res) => {
	try {

		const requests = await Request.find({ "student.enrollmentNum": req.params.id })
		res.status(200).json({
			statusCode: 200,
			message: "My requests fetched successfully",
			data: requests
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getTeacherRequests = async (req, res) => {
	try {
		const requests = await Request.find({ "teacher.enrollmentNum": req.params.id })
		res.status(200).json({
			statusCode: 200,
			message: "My requests fetched successfully",
			data: requests
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { createRequest, updateRequestStatus, markAsReturned, getAllRequests, getMyRequests, getTeacherRequests }
