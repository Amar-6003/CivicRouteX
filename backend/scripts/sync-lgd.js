
import "dotenv/config";
import { syncLGDBatch } from "../src/services/lgd.service.js";
import prisma from "../src/config/prisma.js";

const state = process.argv[2] || undefined;
const batchSize = 500;
let offset = 0;
let totalFetched = 0;
let totalValid = 0;
let totalInserted = 0;

try {
  while (true) {
    const result = await syncLGDBatch({
      state,
      limit: batchSize,
      offset
    });

    totalFetched += result.fetched;
    totalValid += result.valid;
    totalInserted += result.inserted;

    console.log({
      offset,
      fetched: result.fetched,
      valid: result.valid,
      inserted: result.inserted
    });

    if (!result.hasMore || result.fetched === 0) {
      break;
    }

    offset = result.nextOffset;
  }

  console.log("LGD sync completed:", {
    totalFetched,
    totalValid,
    totalInserted
  });
} catch (error) {
  console.error("LGD sync failed:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
