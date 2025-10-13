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
	enrollmentNum: {
		type: Number,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true,
		default: "Student"
	},
    equipment: {
		id: {
			type: String,
		},
        name: {
            type: String,
        },
        category: {
            type: String,
        },
        condition: {
            type: String,
            enum: ['APPROVED', 'REJECTED', 'PENDING', 'RETURNED', "AVAILABLE"],
        },
        quantity: {
            type: Number,
        },
        availability: {
            type: Number,
        },
    },
});

module.exports = mongoose.model("student", studentSchema);