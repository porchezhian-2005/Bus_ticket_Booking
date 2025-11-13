import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import busRoutes from "./routes/busRoutes.js"
import initializePassport from "./config/passport.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, 
  })
);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.send({message:"API running"}));

app.use("/api/users", userRoutes);
app.use("/api/bus",busRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
