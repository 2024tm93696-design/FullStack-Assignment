const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
 
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/v1/google/return",
    scope: ["profile", "email"]
  },
  function( accessToken, refreshToken, profile, callback) {
    console.log(profile)
    callback(null, profile)
  }
));

passport.serializeUser((user, done)=>{
    done(null,user)
})

passport.deserializeUser((user, done)=>{
    done(null,user)
})

