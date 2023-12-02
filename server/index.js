const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require("dotenv")
const path = require("path")

const usersRoute = require('./userRoutes');
const App = require('./App');
const connectDB = require("./config/db.js")

// config
dotenv.config()
connectDB()


//1. This is just for second option if header in vercel.json have an error when uploading to vercel________________________
//2. Also delete "headers" in vercel.json if have an error when uploading to vercel________________________
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors("*"));



// Set up options response for preflight requests
//app.options('*', cors());

app.use('/', App)
app.use("/api/users", usersRoute)


if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "client/build")));

// Catch-all route to serve the index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client/build/index.html"));
    });

} else {
    app.get("/", (req, res) => {
        res.send("Api is running...")
    })
}


app.listen(4000 || process.env.PORT, () => console.log("Sever is running"))
//this is only for local___________________________________
/*mongoose.connection.once('open', () => {
});*/


//this is only for vercel__________________________________
module.exports = app

