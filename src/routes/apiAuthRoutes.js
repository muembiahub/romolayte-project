import express from "express";
import { requireApiAuth } from "../middlewares/apiRequireAuth.js";
import { register, login, logout,currentUser } from '../controllers/apiAuthControllers.js'

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);
router.get(
  "/current-user",
  requireApiAuth,
  currentUser
);


export default router;
