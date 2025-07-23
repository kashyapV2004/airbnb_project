const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

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

app.get("/", (req, res)=>{
    res.send("hi, I'm root..");
});

app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//crete new list
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id",async (req ,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//create route
app.post("/listings", async (req ,res) => {
    let newlisting = new Listing(req.body.Listing);
    await newlisting.save();
    res.redirect("/listings");
})

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route
app.put("/listings/:id", async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true});
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listing/:id", async(req, res) => {
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
})

// app.get("/testlisting", async (req, res) => {
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

app.listen(8080, () => {
    console.log("server is lestening to port 8080..");
});