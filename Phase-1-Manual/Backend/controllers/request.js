const Request = require("../models/requestSchema.js");

const generateId = () => {
	const id = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
	return id;
}

const createRequest = async (req, res) => {
	try {
		// Check for overlapping approved bookings for same equipment
		const {equipment, requestDate,student, returnDate, role} = req.body;
		const overlap = await Request.findOne({
			equipment,
			status: "APPROVED",
			$or: [
				{ requestDate: { $lte: returnDate }, returnDate: { $gte: requestDate } }
			]
		});
		if(overlap) {
			res.status(400).send({
				statusCode: 400,
				message: "Requested Equipment is Already assigned to Someone for selected dates."
			})
		}
		let request = {
			id: generateId(),
			equipment,
			student,
			status: "PENDING",
			role,
			requestDate,
			returnDate
		}
		await request.save()
		res.status(201).send({
			statusCode: 201,
			message: `Request for ${equipment.name}  created Successfully`,
			data: equipment
		})
	}catch(err) {
		res.status(500).json(err);
	}
}

// Staff/Admin: Approve or reject a request
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
				statusCode: 400,
				message: "Invalid status update." });
    }

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ 
			statusCode: 404,
			message: "Request not found" });

    // If approving, again check overlap
    if (status === "APPROVED") {
      const overlap = await Request.findOne({
        equipment: request.equipment,
        status: "APPROVED",
        id: { $ne: id },
        $or: [
          { startDate: { $lte: request.endDate }, endDate: { $gte: request.startDate } }
        ]
      });
      if (overlap) {
        return res.status(400).json({
          message: "Equipment already approved for overlapping dates."
        });
      }
    }

    request.status = status;
    await request.save();

    res.status(200).json({ 
			statusCode: 200,
			message: `Request ${status}`, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark as returned
const markAsReturned = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);

    if (!request) return res.status(404).json({
			statusCode: 404,
			message: "Request not found" });
    if (request.status !== "APPROVED")
      return res.status(400).json({
		    statusCode: 400,
				message: "Only approved requests can be marked as returned." });

    request.status = "RETURNED";
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
			data:requests
		});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: Get my own requests
const getMyRequests = async (req, res) => {
  try {
		
    const requests = await Request.find({ "student.rollNum": req.rollNum })
    res.status(200).json({
			statusCode: 200,
			message: "My requests fetched successfully",
			data: requests
		});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports= {createRequest, updateRequestStatus, markAsReturned, getAllRequests, getMyRequests}
