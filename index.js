const express = require("express")
const mongoose = require("mongoose");
const Client = require("./models/Client")
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const Reservation = require("./models/Reservation")
const Room = require("./models/Room")
const app = express()
app.set('view engine', 'ejs');
app.use(express.json());
const jsonParser = bodyParser.json();
app.use(jsonParser)
mongoose.connect('mongodb+srv://host1:1234@cluster0.ax7ptmf.mongodb.net/host1?retryWrites=true&w=majority&appName=Cluster0').
    then(() => {
        console.log("connected to database")
        app.listen(5055, () => {
            console.log("Server is running on port 5055")
        })
    }, { useNewUrlParser: true, useUnifiedTopology: true })
app.get("/", (req ,res) =>{
    res.json("access granted")
})
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const key = generateRandomKey()
        const client = new Client({ email, password: hashedPassword, key });
        await client.save();
        res.status(201).json({ message: 'User registered successfully, copy the key, don\'t share it', key });
        console.log("success")
    } catch (error) {
        console.log("failed")
        res.status(500).json({ error: 'Registration failed' });
    }
});
app.post('/api/login', async (req, res) => {
    console.log("logging in...");
    try {
        const { email, password } = req.body;
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Requesting data...");
        // Find the client by email
        const client = await Client.findOne({ email });
        if (!client) {
            console.log("Client not found");
            return res.status(401).json({ error: 'Client not found' });
        }
        console.log("Client found:", client);
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, client.password);
        if (!passwordMatch) {
            console.log("Password mismatch");
            return res.status(401).json({ error: 'Login failed' });
        }
        console.log("Login successful");
        // const token = jwt.sign({ userId: user._id }, 'your-secret-key', {expiresIn: '1h'});
        return res.status(200).json({ message: 'Login successful', client });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: 'Login failed' });
    }
});
app.get("/api/:key/rooms", async (req, res)=>{
    findKey(req.params.key).then( async response =>{
        if(!response){
            res.json({message: "Unautherized"});
            return
        }
        const rooms = await Room.find()
        res.json({message: "request found", rooms});
    })
})
app.get("/api/:key/rooms/:id", async (req, res)=>{
    findKey(req.params.key).then( async response =>{
        if(!response){
            res.json({message: "Unautherized"});
            return
        }
        const rooms = await Room.findOne({roomID: id})
        res.json({message: "request found", rooms});
    })
})
app.post("/api/:key/reservations", (req, res)=>{
    findKey(req.params.key).then( async response =>{
        if(!response){
            res.json({message: "Unautherized"});
            return
        }
        try {
            const { guestName, phone, roomID, checkIn, checkOut, adultsNum, childrenNum }
            = req.body;
            const reservation = new Reservation({
                guestName, phone, roomID, checkIn, checkOut, adultsNum, childrenNum });
            await reservation.save();
            res.status(201).json({ message: 'Reservation registered successfully'});
            console.log("success")
        } catch (error) {
            console.log("failed")
            res.status(500).json({ error: 'Reservation failed' });
        }
    })
})
app.delete("/api/:key/reservations/:reservationId", (req, res)=>{
    findKey(req.params.key).then( async response =>{
        if(!response){
            res.json({message: "Unautherized"});
            return
        }
        const reservationId = req.params.reservationId;
        try {
            const deletedReservation = await Reservation.findByIdAndDelete(reservationId);
    
            if (!deletedReservation) {
                return res.status(404).json({ error: 'Reservation not found' });
            }
            res.json({ message: `Deleted reservation with ID ${reservationId}` });
        } catch (error) {
            console.error('Error deleting reservation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
})
app.put("/api/:key/reservations/:reservationId", (req, res)=>{
    findKey(req.params.key).then( async response =>{
        if(!response){
            res.json({message: "Unautherized"});
            return
        }
        const reservationId = req.params.reservationId;
        try {
            const { guestName, phone, roomID, checkIn, checkOut, adultsNum, childrenNum }
            = req.body;
            const updatedReservation = await Reservation.findByIdAndUpdate(
                reservationId,
                { guestName, phone, roomID, checkIn, checkOut, adultsNum, childrenNum },
                { new: true } // To return the updated document
        );
            if (!updatedReservation) {
                return res.status(404).json({ error: 'Reservation not found' });
            }
            res.json({ message: `Updated reservation with ID ${reservationId}` });
        } catch (error) {
            console.error('Error updating reservation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
})
function generateRandomKey() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        key += charset[randomIndex];
    }
    return key;
}
async function findKey(key){
    return await Client.findOne({key})
}
app.get("/api", (req, res) => {
    res.render("register")
})