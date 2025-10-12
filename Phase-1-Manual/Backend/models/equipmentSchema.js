const mongoose = require("mongoose")

const equipmentSchema = new mongoose.Schema({
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
        enum: ['APPROVED', 'REJECTED', 'PENDING', 'RETURNED'],
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
});

module.exports = mongoose.model("equipment", equipmentSchema)