import express from 'express';
import { requireApiAuth } from '../middlewares/apiRequireAuth.js';
import { getDashboardStats,getAllOrders } from '../controllers/apiDashboard.js';

const router = express.Router();

router.get('/dashboard/stats', requireApiAuth, getDashboardStats);
router.get('/dashboard/allorders', requireApiAuth, getAllOrders);


export default router;