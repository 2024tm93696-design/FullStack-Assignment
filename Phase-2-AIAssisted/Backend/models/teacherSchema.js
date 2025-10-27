import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
	enrollmentNum: {
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
}, { timestamps: true });

export default mongoose.model("teacher", teacherSchema)