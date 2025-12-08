import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import router from './routes/userRoutes.js';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';
import adminRouter from './routes/adminRoutes.js';
import routeRouter from './routes/routeRoute.js';
import adminBusRouter from './routes/busRoutes.js';
import seatRouter from './routes/seatRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import adminDashboardrouter from './routes/adminDashBoardRoutes.js';
import ticketRoutes from "./routes/ticketRoutes.js"
import walletRoutes from "./routes/walletRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import referralRouter from "./routes/referralRoutes.js";
import systemConfigRouter from "./routes/systemConfigRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', router);
app.use('/api/admin', adminRouter);
app.use('/api/routes', routeRouter);
app.use('/api/buses', adminBusRouter);
app.use('/api/seats', seatRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/payments', paymentRouter);
app.use("/api/admin", adminDashboardrouter);
app.use("/api/tickets", ticketRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/referrals", referralRouter);
app.use("/api/config", systemConfigRouter);
app.use("/api/transaction",transactionRoutes)

console.log("EMAIL:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS ? "Loaded" : "NOT LOADED");



app.get('/', (req, res) => {
    res.status(200).send({ message: 'API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
