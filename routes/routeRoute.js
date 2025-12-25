
import express from 'express';
import { createRoute } from '../controllers/routeController.js';

const router = express.Router();

router.post('/routes', createRoute); 

export default router;