const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

router.get("/", 
    wrapAsync(async(req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
    })
);

//crete new list
router.get("/new", isLoggedIn,(req, res) => {
    res.render("listings/new.ejs");
})

//show route
router.get("/:id", 
    wrapAsync(async(req ,res) => {
    let {id} = req.params;
    const listings = await Listing.findById(id).populate("reviews");
    if(!listings){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else
        res.render("listings/show.ejs",{listings});
}))

//create route
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req ,res) => {
    let newlisting = new Listing(req.body.listing);       
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
})
);

//edit route
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else
        res.render("listings/edit.ejs",{listing});
}))

//update route
router.put("/:id",
        isLoggedIn,
        validateListing, 
        wrapAsync(async(req, res) => {
            let {id} = req.params;
            await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true});
            req.flash("success", "Listing updated successfully!");
            res.redirect(`/listings/${id}`);
        }
));

//delete route
router.delete("/:id",
    isLoggedIn,
    wrapAsync(async(req, res) => {
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listings");
}));



// router.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title : "my new villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Gr Noida, UP",
//         country : "India"
//     });
//     console.log(sampleListing);
//     await sampleListing.save();
//     console.log("sample has been saved..");
//     res.send("successful testing..");
// });

module.exports = router;