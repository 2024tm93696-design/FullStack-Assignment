const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
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
    student: {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        enrollmentNum: {
            type: Number,
        },
    },
    teacher: {
        enrollmentNum: {
            type: String,
            unique: true
        },
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
    },
    status: {
        type: String,
        enum: ['APPROVED', 'REJECTED', 'PENDING', 'RETURNED'],
        default: 'PENDING',
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
    returnDate: {
        type: Date,
    },

    role: {
        type: String,
    },
});

module.exports = mongoose.model("request", requestSchema)