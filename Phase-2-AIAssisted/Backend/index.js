const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const app = express()
const Routes = require("./routes/route.js")
const passport = require('passport')
require('./controllers/auth/authenticator.js')
const session = require('express-session')

const PORT = process.env.PORT || 5000

var cookieParser=require('cookie-parser')
app.use(session({secret:'cats'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

dotenv.config();

app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(express.json({ limit: '10mb' }))

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true        
}));
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/api/v1', Routes);
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  // For frontend routes
  res.redirect("http://localhost:3000/404");
});

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})