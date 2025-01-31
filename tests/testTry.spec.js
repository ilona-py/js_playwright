import { test, expect } from '@playwright/test';
import { HackerNewsPage } from '../pom-pages/HackerNewsPage';
import { waitForTimeout } from '../helpers/timeoutHelper'; 

test.describe('Hacker News "Newest" Page Tests', () => {
  let hackerNewsPage;

  // Before each test, instantiate the page object and navigate to the "newest" page
  test.beforeEach(async ({ page }) => {
    hackerNewsPage = new HackerNewsPage(page);
    await hackerNewsPage.navigate();
  });

  // Test to validate that exactly 100 articles are sorted from newest to oldest
  test('Validate the first 100 articles are sorted correctly', async ({ page }) => {
    // Step 1: Accumulate articles up to the limit of 100
    const articles = await hackerNewsPage.accumulateArticlesUpTo(100);

    // Step 2: Ensure we have exactly 100 articles
    expect(articles.length).toBe(100);

    // Use the helper function to wait
    await waitForTimeout(page, 2000);

    // Step 3: Validate that all 100 articles are sorted correctly
    const isSorted = await hackerNewsPage.validateArticlesAreSorted(articles);
    expect(isSorted).toBe(true);

    console.log("Validation complete: The first 100 articles are sorted correctly.");
  });
});

