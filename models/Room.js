const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    roomID: {type: Number , unique: true, required: true},
    bedsNum: {type: Number , unique: true, required: true},
    pricing: {type: Number , unique: true, required: true},
    availability_status: {type: Boolean , unique: true, required: true}
});
module.exports = mongoose.model("Room", roomSchema);
