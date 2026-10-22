import "dotenv/config";

import prisma from "../src/config/prisma.js";

import {
  syncLGDBatch,
} from "../src/services/lgd.service.js";

const BATCH_SIZE = 1000;

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const main = async () => {
  let offset = 0;
  let totalSynced = 0;
  let totalAvailable = null;

  console.log(
    "Starting India-wide LGD sync..."
  );

  while (true) {
    console.log(
      `Fetching offset ${offset}...`
    );

    const result =
      await syncLGDBatch({
        limit: BATCH_SIZE,
        offset,
      });

    if (totalAvailable === null) {
      totalAvailable = result.total;
    }

    totalSynced += result.synced;

    console.log(
      `Fetched: ${result.fetched}, synced: ${result.synced}, total available: ${result.total}`
    );

    if (result.fetched === 0) {
      break;
    }

    offset += result.fetched;

    if (
      offset >= result.total
    ) {
      break;
    }

    await sleep(250);
  }

  console.log(
    `LGD sync completed. Total synced: ${totalSynced}`
  );
};

main()
  .catch((error) => {
    console.error(
      "LGD sync failed:",
      error
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });