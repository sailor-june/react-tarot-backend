///////////////////////////////
// DEPENDENCIES
////////////////////////////////
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
require("dotenv").config();
const { getAuth }= require('firebase-admin/auth')

const Diary =require("./models/entry")
const methodOverride = require("method-override")
const admin = require('firebase-admin')


const app = express();
const { CLIENT_ID, PRIVATE_KEY, private_key_id, PORT, MONGODB_URL } = process.env;
///////init admin

admin.initializeApp({credential:admin.credential.cert({
    "type": "service_account",
  "project_id": "fortune-diary",
  "private_key_id": private_key_id,
  "private_key": PRIVATE_KEY.replace('\n',''),
  "client_email": "firebase-adminsdk-hknvv@fortune-diary.iam.gserviceaccount.com",
  "client_id": CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hknvv%40fortune-diary.iam.gserviceaccount.com"

})})



///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL);

// Connection Events
mongoose.connection
    .on("open", () => console.log("connected to MongoDB"))
    .on("close", () => console.log("disconnected from MongoDB"))
    .on("error", (error) => console.log("an error has occurred" + error.message));

mongoose.set('strictQuery', true);


///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(methodOverride("_method"))
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
app.use(express.static('public'))
///////////cuustom////////////////////

app.use(async function(req,res,next){
    try{
    const token = req.get('Authorization')
    if (token){
        const user = await getAuth().verifyIdToken(token.replace('Bearer ', ''))
        console.log(user)
        req.user=user;

    } else {
        req.user=null
    }
    }
    catch(error){
        req.user=null
    }

    next()////invokes next middleware function
})


// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("hello world");
});





// DIARY INDEX ROUTE
app.get("/diary", async (req, res) => {
    try {
      console.log("User ID:", req.user.uid);
      const entries = await Diary.find({uid : req.user.uid});
      console.log("Entries:", entries.length);
      res.json(entries);
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }})

// DIARY CREATE ROUTE
app.post("/diary", async (req, res) => {
    try {
        // attach user ID to diary entry
        req.body.uid = req.user.uid
        // extract only the name property of each card object
        const cardNames = req.body.cards.map(card => card.name);
        // add the cardNames array to the req.body object
        req.body.cards = cardNames;
        console.log(req.body)
        // send created entry
        await Diary.create(req.body)
        res.redirect('/diary');
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});


// PEOPLE DELETE ROUTE
app.delete("/diary/:id", async (req, res) => {
    try {
        // send all entries
        res.json(await Diary.findByIdAndRemove(req.params.id));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// PEOPLE UPDATE ROUTE
app.put("/diary/:id", async (req, res) => {
    try {
        // send all Entries
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            })
        );
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});
///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));