const User = require("../models/user");

//user signup form controller
module.exports.userSignupGet = (req, res) => {
    res.render("users/signup.ejs");
}

//user signup controller
module.exports.userSignupPost = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash("success", "user has registered successfully!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

//user login form controller
module.exports.userLoginGet = (req, res) => {
    res.render("users/login.ejs");
}

//user login controller
module.exports.userLoginPost = (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
}

//user logout controller
module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}