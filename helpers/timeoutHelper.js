export async function waitForTimeout(page, timeout) {
    console.log(`Waiting for ${timeout / 1000} seconds...`);
    await page.waitForTimeout(timeout);
  }
  