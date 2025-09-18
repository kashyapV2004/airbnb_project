if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport")
const localSrategy = require("passport-local");
const User = require("./models/user.js");

// const cors=require("cors");

const listingsRouters = require("./routes/listing.js");
const reviewsRouters = require("./routes/review.js");
const userRouters = require("./routes/user.js");

// Enable CORS for all routes
// app.use(cors());

const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
main()
    .then(() => {
        console.log("connected to mongo successfully..");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
  await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

// app.get("/", (req, res)=>{
//     res.send("hi, I'm root..");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localSrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

// app.get("/demouser", async (req, res) => {
//     const fakeUser = new User({
//         email: "student@gmail.com",
//         username: "ayush",
//     });
//     const newUser = await User.register(fakeUser, "helloworld");
//     res.send(newUser);
// });

app.use("/listings", listingsRouters);
app.use("/listings/:id/reviews", reviewsRouters);
app.use("/", userRouters);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

//middleware
app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {err});
    //res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is lestening to port 8080..");
});