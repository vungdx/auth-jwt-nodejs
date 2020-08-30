const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");
// const authRoute = require("./routes/auth")

dotenv.config();
// Connect to DB
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to db")
);


// Middleware
app.use(express.json());


// Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(6000, () => {
    console.log("Server is running");
})