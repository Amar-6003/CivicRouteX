import express from "express";

import {
  syncLGDBatch,
} from "../services/lgd.service.js";

const router = express.Router();

/*
 * Temporary development/testing endpoint.
 *
 * Do NOT expose this publicly in production.
 */

router.get(
  "/test",
  async (req, res) => {
    try {
      const limit = Number(
        req.query.limit || 5
      );

      const offset = Number(
        req.query.offset || 0
      );

      const state =
        req.query.state ||
        undefined;

      if (
        !Number.isInteger(limit) ||
        limit <= 0 ||
        limit > 1000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "limit must be between 1 and 1000.",
        });
      }

      if (
        !Number.isInteger(offset) ||
        offset < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "offset must be a non-negative integer.",
        });
      }

      const data =
        await syncLGDBatch({
          state,
          limit,
          offset,
        });

      return res.json({
        success: true,
        ...data,
      });
    } catch (error) {
      console.error(
        "LGD test error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

export default router;