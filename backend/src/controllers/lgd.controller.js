
import {
  syncLGDBatch,
  listLocalBodies,
} from "../services/lgd.service.js";

export const getLocalBodies = async (req, res) => {
  try {
    const result = await listLocalBodies({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 20),
      search: String(req.query.search ?? ""),
      state: String(req.query.state ?? ""),
      type: String(req.query.type ?? ""),
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("LGD directory error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch the LGD directory.",
    });
  }
};

/*
 * Sync one batch at a time.
 * Protect this endpoint with a secret before deployment.
 */
export const syncLocalBodies = async (req, res) => {
  try {
    const expectedSecret = process.env.LGD_SYNC_SECRET;
    const suppliedSecret = req.get("x-lgd-sync-key");

    if (!expectedSecret || suppliedSecret !== expectedSecret) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to run LGD synchronization.",
      });
    }

    const limit = Number(req.body?.limit ?? 500);
    const offset = Number(req.body?.offset ?? 0);
    const state = String(req.body?.state ?? "").trim() || undefined;

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 1000 ||
      !Number.isInteger(offset) ||
      offset < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch limit or offset.",
      });
    }

    const result = await syncLGDBatch({ limit, offset, state });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("LGD sync error:", error);

    return res.status(500).json({
      success: false,
      message: "LGD batch synchronization failed.",
    });
  }
};
