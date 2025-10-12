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
	role: {
		type: String,
		default: "Student"
	},
    equipment: {
		id: {
			type: String,
			required: true,
		},
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        condition: {
            type: String,
            enum: ['APPROVED', 'REJECTED', 'PENDING', 'RETURNED', "AVAILABLE"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        availability: {
            type: Number,
            default: "Admin"
        },
    },
});

module.exports = mongoose.model("student", studentSchema);