import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
    longUrl: { 
        type: String, 
        required: true 
    },
    shortUrl: { 
        type: String, 
        required: true, 
        unique: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    topic: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Url = mongoose.model("Url", UrlSchema);
export default Url;
