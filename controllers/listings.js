const Listing = require("../models/listing.js");

//all listings
module.exports.index = async(req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
    }

//crete new listing from
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

//show Listing
module.exports.showListing = async(req ,res) => {
    let {id} = req.params;
    const listings = await Listing.findById(id).populate({
        path:"reviews",
        populate : {
            path : "author"
        }
    }).populate("owner");

    if(!listings){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else
        res.render("listings/show.ejs",{listings});
}

//create new Listing
module.exports.createListing = async (req ,res) => {
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;     
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

//edit listing form
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else
        res.render("listings/edit.ejs",{listing});
}

//update listing
module.exports.updateListing = async(req, res) => {
            let {id} = req.params;
            await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true});
            req.flash("success", "Listing updated successfully!");
            res.redirect(`/listings/${id}`);
}

//delete listing
module.exports.deleteListing = async(req, res) => {
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listings");
}