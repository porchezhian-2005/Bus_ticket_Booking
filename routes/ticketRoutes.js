import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import { ticketIdValidator } from "../validator/ticketValidator.js";
import { getTicketById, cancelTicket, downloadTicketPDF } from "../controllers/ticketController.js";

const ticketRouter = express.Router();

ticketRouter.get(  "/:id",authMiddleware, validateRequest(ticketIdValidator, "params"), getTicketById);

ticketRouter.post( "/:id/cancel", authMiddleware, validateRequest(ticketIdValidator, "params"), cancelTicket);

ticketRouter.get( "/:id/download", authMiddleware, validateRequest(ticketIdValidator, "params"), downloadTicketPDF);

export default ticketRouter;
