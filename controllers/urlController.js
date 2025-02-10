import shortid from "shortid";
import Url from "../models/Url.js";
import redis from "../config/redis.js";

export const shortenUrl = async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;
  const userId = req.user.id;
  if(!longUrl){
    console.log("all fields are reuired");
  }
  const alias = customAlias || shortid.generate();
      
  try {
    let url = await redis.get(longUrl); // Ensure async call with await
    if (url) {
      return res.json({ shortUrl: `${process.env.BASE_URL}/api/shorten/${url}`, createdAt: Date.now() });
    }

    url = await Url.findOne({ longUrl });
    if (url) {
      return res.json({ shortUrl: `${process.env.BASE_URL}/api/shorten/${url.shortUrl}`, createdAt: Date.now() });
    }

    redis.set(alias, longUrl, "EX", 86400); // Cache for 24 hours
    redis.set(longUrl, alias, "EX", 86400); // Cache for 24 hours
    console.log(longUrl);

    const urlData = { longUrl, shortUrl: alias, user: userId, createdAt: Date.now(), topic };
    await Url.create(urlData);

    return res.json({ shortUrl: `${process.env.BASE_URL}/api/shorten/${alias}`, createdAt: Date.now() });

  } catch (error) {
    res.status(500).json({ message: "Failed to shorten URL", error });
  }
  // try {
  //   let url = redis.get(longUrl)
  //   if (url){
  //     res.json({ shortUrl: ${process.env.BASE_URL}/api/shorten/${url}, createdAt: Date.now() });
  //   }
  //   url = await Url.findOne({longUrl:longUrl})
  //   if (url){
  //     res.json({ shortUrl: ${process.env.BASE_URL}/api/shorten/${url.shortUrl}, createdAt: Date.now() });
  //   }
  //   redis.set(alias, longUrl, "EX", 86400); // Cache for 24 hours
  //   redis.set(longUrl, alias, "EX", 86400); // Cache for 24 hours
  //   console.log(longUrl)
  //   const urlData = {longUrl, shortUrl:alias, user: userId, createdAt: Date.now(), topic}
  //   await Url.create(urlData)
    
  //   res.json({ shortUrl: ${process.env.BASE_URL}/api/shorten/${alias}, createdAt: Date.now() });
  // } catch (error) {
  //   res.status(404).json({ message: "Failed to shorten URL", error });
  // }

};

export const redirectUrl = async (req, res) => {
    const { alias } = req.params;
    const cachedUrl = await redis.get(alias);
  
    if (cachedUrl) return res.redirect(cachedUrl);
  
    const url = await Url.findOne({ shortUrl: alias });
    if (url) {
      redis.set(alias, url.longUrl, "EX", 86400); // Cache
      return res.redirect(url.longUrl);
    }
  
    res.status(404).json({ message: "URL not found" });
  };
  