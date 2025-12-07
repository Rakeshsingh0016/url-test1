import express from "express";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// CONNECT MONGODB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// SCHEMA
const UrlSchema = new mongoose.Schema({
  longUrl: String,
  shortCode: String,
  clicks: { type: Number, default: 0 },
  expiry: Number
});

const Url = mongoose.model("Url", UrlSchema);

// CREATE SHORT URL
app.post("/shorten", async (req, res) => {
  const { longUrl, expiry } = req.body;

  const shortCode = nanoid(7);

  await Url.create({
    longUrl,
    shortCode,
    expiry: expiry || null
  });

  res.json({
    status: "success",
    shortUrl: `https://your-domain/${shortCode}`,
    code: shortCode
  });
});

// REDIRECT & CLICK COUNT
app.get("/:code", async (req, res) => {
  const code = req.params.code;

  const link = await Url.findOne({ shortCode: code });

  if (!link) return res.status(404).send("Short URL Not Found");

  // Check expiry
  if (link.expiry && Date.now() > link.expiry) {
    return res.status(410).send("LINK EXPIRED");
  }

  // Click count
  link.clicks++;
  await link.save();

  res.redirect(link.longUrl);
});

// PORT
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

