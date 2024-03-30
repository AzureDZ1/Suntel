const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    key: { type: String, unique: true, required: true }
});

module.exports = mongoose.model("Client", clientSchema);
