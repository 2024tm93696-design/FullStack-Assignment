const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	rollNum: {
		type: Number,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	// school: {
	//     type: mongoose.Schema.Types.ObjectId,
	//     ref: 'admin',
	//     required: true,
	// },
	role: {
		type: String,
		default: "Student"
	},
	// class: {
	//     type: String,
	//     required: true,
	// },
	// section: {
	//     type: String,
	//     required: true,
	// },
});

module.exports = mongoose.model("student", studentSchema);