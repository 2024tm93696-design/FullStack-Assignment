const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');

const adminRegister = async (req, res) => {
	try {
		const admin = new Admin({
			...req.body,
		});

		const existingAdminByEmployeeId = await Admin.findOne({ employeeId: req.body.employeeId });

		if (existingAdminByEmployeeId) {
			res.status(400).send({
				statusCode: 400,
				message: 'Admin already exists'
			});
		}
		else {
			let result = await admin.save();
			result.password = undefined;
			res.status(201).send({
				statusCode: 201,
				message: "Admin registered successfully",
				data:	result});
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const adminLogIn = async (req, res) => {
	if (req.body.email && req.body.password) {
		let admin = await Admin.findOne({ employeeId: req.body.employeeId, email: req.body.email });
		if (admin) {
			if (req.body.password === admin.password) {
				admin.password = undefined;
				res.status(200).send({
					statusCode: 200,
					message: "Login successful",
					data: admin});
			} else {
				res.status(400).send({
					statusCode: 400,
					message: "Invalid password" });
			}
		} else {
			res.status(404).send({
				statusCode: 404,
				message: "User not found" });
		}
	} else {
		res.status(400).send({ 
			statusCode: 400,
			message: "Email and password are required" });
	}
};

const getAdminDetail = async (req, res) => {
	try {
		let admin = await Admin.findOne({employeeId: req.params.id});
		if (admin) {
			admin.password = undefined;
			res.status(200).send({
				statusCode: 200,
				message: "Admin details fetched successfully",
				data: admin});
		}
		else {
			res.status(404).send({
				statusCode: 404,
				message: "No admin found" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
}

// const deleteAdmin = async (req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = { adminRegister, adminLogIn, getAdminDetail };
