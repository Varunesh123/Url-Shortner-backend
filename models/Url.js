import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
    longUrl: { 
        type: String, 
        required: true 
    },
    shortUrl: { 
        type: String, 
        required: true,
    },
    user: { 
        type: String, 
        ref: "User", 
        required: true 
    },
    topic: { 
        type: String 
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Url = mongoose.model("Url", UrlSchema);
export default Url;
