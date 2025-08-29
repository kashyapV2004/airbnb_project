const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
.route("/signup")
//user signup form route
.get(userController.userSignupGet)
//user signup route
.post(wrapAsync(userController.userSignupPost));

router
.route("/login")
//user login form routes
.get(userController.userLoginGet)
//user login route
.post(saveRedirectUrl,
    passport.authenticate("local", {
        failureFlash: true, 
        failureRedirect: "/login"
    }), 
    userController.userLoginPost
);

//user logout route
router.get("/logout", userController.userLogout);

module.exports = router;