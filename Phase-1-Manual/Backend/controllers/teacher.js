const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');

const teacherRegister = async (req, res) => {
	const {employeeId, name, email, password, role } = req.body;
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(password, salt);

		const teacher = new Teacher({employeeId, name, email, password: hashedPass, role});

		const existingTeacherByEmployeeID = await Teacher.findOne({ employeeId });

		if (existingTeacherByEmployeeID) {
			res.status(400).send({
				statusCode: 400,
				message: 'Teacher already exists' });
		}
		else {
			let result = await teacher.save();
			result.password = undefined;
			res.status(201).send({
				statusCode: 201,
				message: "Teacher registered successfully",
				data:	result});
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const teacherLogIn = async (req, res) => {
	try {
		let teacher = await Teacher.findOne({ employeeId: req.body.employeeId, email: req.body.email });
		if (teacher) {
			const validated = await bcrypt.compare(req.body.password, teacher.password);
			if (validated) {
				teacher.password = undefined;
				res.status(200).send({
					statusCode: 200,
					message: "Login successful",
					data:	teacher});
			} else {
				res.status(400).send({
					statusCode: 400,
					message: "Invalid password" });
			}
		} else {
			res.status(404).send({
				statusCode: 404,
				message: "Teacher not found" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const getTeachers = async (req, res) => {
	try {
		let teachers = await Teacher.find({ employeeId: req.params.id });
		if (teachers.length > 0) {
			let modifiedTeachers = teachers.map((teacher) => {
				return { ...teacher._doc, password: undefined };
			});
			res.status(200).send({
				statusCode: 200,
				message: "Teachers fetched successfully",
				data:	modifiedTeachers});
		} else {
			res.status(404).send({ 
				statusCode: 404,
				message: "No teachers found" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const getTeacherDetail = async (req, res) => {
	try {
		let teacher = await Teacher.findById({employeeId: req.params.id})
		if (teacher) {
			teacher.password = undefined;
			res.status(200).send({
				statusCode: 200,
				message: "Teacher details fetched successfully",
				data:	teacher});
		}
		else {
			res.status(404).send({
				statusCode: 404,
				message: "No teacher found" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
}

const deleteTeacher = async (req, res) => {
	try {
		const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

		await Subject.updateOne(
			{ teacher: deletedTeacher._id, teacher: { $exists: true } },
			{ $unset: { teacher: 1 } }
		);

		res.send(deletedTeacher);
	} catch (error) {
		res.status(500).json(error);
	}
};

const deleteTeachers = async (req, res) => {
	try {
		const deletionResult = await Teacher.deleteMany({ school: req.params.id });

		const deletedCount = deletionResult.deletedCount || 0;

		if (deletedCount === 0) {
			res.send({ message: "No teachers found to delete" });
			return;
		}

		const deletedTeachers = await Teacher.find({ school: req.params.id });

		await Subject.updateMany(
			{ teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
			{ $unset: { teacher: "" }, $unset: { teacher: null } }
		);

		res.send(deletionResult);
	} catch (error) {
		res.status(500).json(error);
	}
};

module.exports = {
	teacherRegister,
	teacherLogIn,
	getTeachers,
	getTeacherDetail,
	deleteTeacher,
	deleteTeachers,
};