const mongoose = require("mongoose")

const equipmentSchema = new mongoose.Schema({
    id : {
        type: String,
        required:true,
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
        enum: ["AVAILABLE", "OUT OF STOCK"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    availability: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("equipment", equipmentSchema)