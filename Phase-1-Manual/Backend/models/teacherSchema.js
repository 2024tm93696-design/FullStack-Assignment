const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
	employeeId: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: "Teacher"
	},
	// school: {
	//     type: mongoose.Schema.Types.ObjectId,
	//     ref: 'admin',
	//     required: true,
	// },
}, { timestamps: true });

module.exports = mongoose.model("teacher", teacherSchema)