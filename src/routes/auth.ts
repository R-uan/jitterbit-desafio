import { Router } from "express";
import { AuthenticationController } from "../controllers/authController";

const router = Router();

router.get("/", AuthenticationController.signIn);
router.post("/", AuthenticationController.signUp);

export default router;
