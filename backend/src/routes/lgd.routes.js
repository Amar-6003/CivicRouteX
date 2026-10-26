import express from "express";

import {
  getLocalBodies,
  syncLocalBodies,
} from "../controllers/lgd.controller.js";

const router = express.Router();

router.get("/local-bodies", getLocalBodies);
router.post("/sync-batch", syncLocalBodies);

export default router;
