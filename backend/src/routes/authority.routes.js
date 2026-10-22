import { Router } from "express";
import { getAuthorities } from "../controllers/authority.controller.js";

const router = Router();

router.get("/", getAuthorities);

export default router;