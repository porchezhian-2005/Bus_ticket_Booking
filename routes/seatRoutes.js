import express from 'express';
import passport from 'passport';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { createSeatInventory, getSeatAvailability } from '../controllers/seatController.js';
import { multipleSeatSchema } from '../validator/seatValidator.js';
import validateRequest from '../middlewares/validationMiddleware.js';

const router = express.Router();
const authenticateJWT = passport.authenticate('jwt', { session: false });

router.post('/',authenticateJWT,isAdmin,validateRequest(multipleSeatSchema),createSeatInventory);


router.get('/:busId', getSeatAvailability);

export default router;
