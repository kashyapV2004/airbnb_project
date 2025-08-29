const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    description : String,
    image : {
        filename : String,
        url : {
            type : String,
            default : "https://plus.unsplash.com/premium_photo-1752497523819-eaf80e1fd32a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
            set : (v) =>
                v === "" ? "https://plus.unsplash.com/premium_photo-1752497523819-eaf80e1fd32a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
                : v
        }
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in : listing.reviews}});
    }
})
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;