import express from 'express';
import { requireApiAuth, requireApiAdmin } from '../middlewares/apiRequireAuth.js';
import {
  getDashboardStats,
  getAllOrders,
  createService,
  showMessageContact,
  updateService,
  deleteService,
  updateStatusMessageContact,
  deleteMessageContact,
  getAllProfiles,
  getProfileByUserId,
  getupdateProfileById,
  getdeleteProfileById,
} from '../controllers/apiDashboardControllers.js';

const router = express.Router();

router.get('/dashboard/stats', requireApiAuth, getDashboardStats);
router.get('/dashboard/allorders', requireApiAuth, getAllOrders);
/* ====================================================== */
/* 🔹 Créer,update et delete  un service */
router.post('/dashboard/addservice', requireApiAuth,createService );
router.post('/dashboard/updateservice/:id', requireApiAuth, requireApiAdmin, updateService );
router.post('/dashboard/deleteservice/:id', requireApiAuth, requireApiAdmin, deleteService );


// ===================================================
//  voir, update status and delete Contact Message
//  ==================================================
router.get('/dashboard/messages', requireApiAuth, showMessageContact);
router.post('/dashboard/updatemessage/:id', requireApiAuth,  updateStatusMessageContact);
router.post('/dashboard/deletemessage/:id', requireApiAuth,  deleteMessageContact);


// ====================================================
//  Profile routes
// ====================================================

router.get('/dashboard/profiles', requireApiAuth, getAllProfiles);
router.get('/dashboard/profile/:id', requireApiAuth, getProfileByUserId);
router.post('/dashboard/updateprofile/:id', requireApiAuth, requireApiAdmin, getupdateProfileById);
router.post('/dashboard/deleteprofile/:id', requireApiAuth, requireApiAdmin, getdeleteProfileById);





export default router;

/* ====================================================== */