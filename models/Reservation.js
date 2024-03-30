const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
    guestName : { type: String, unique: true, required: true },
    phone : { type: String, unique: true, required: true },
    roomID : {type: Number, unique: true, required: true },
    checkIn: {type: String, unique: true, required: true },
    checkOut: {type: String, unique: true, required: true },
    adultsNum: {type: Number, unique: true, required: true},
    childrenNum: {type: Number, unique: true, required: true}
});
module.exports = mongoose.model("Resrvation", reservationSchema);
