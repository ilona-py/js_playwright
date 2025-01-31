export class HackerNewsPage {
  constructor(page) {
    this.page = page;
    this.articleElements = this.page.locator('.age[title]');
    this.moreLink = this.page.locator('.morelink');
  }

  // Navigate to the newest page on Hacker News
  async navigate() {
    await this.page.goto('https://news.ycombinator.com/newest');
  }

  // Get the count of article elements on the current page
  async getArticleCount() {
    return await this.articleElements.count();
  }

  // Get the title (date) of an article by its index on the current page
  async getArticleTitleByIndex(index) {
    return await this.articleElements.nth(index).getAttribute('title');
  }

  // Click the "More" button and wait for the next set of articles to load
  async clickMoreLink() {
    await this.page.waitForTimeout(2000)
    await this.moreLink.click();
    await this.page.waitForLoadState('networkidle'); // Wait until the new articles load
  }

  // Refresh the article elements locator to capture the updated list after loading more content
  refreshLocators() {
    this.articleElements = this.page.locator('.age[title]');
  }

  // Accumulate articles across pages until reaching a specific limit
  async accumulateArticlesUpTo(limit) {
    let allArticles = [];

    while (allArticles.length < limit) {
      const currentArticleCount = await this.getArticleCount();
      for (let i = 0; i < currentArticleCount; i++) {
        const title = await this.getArticleTitleByIndex(i);
        allArticles.push(title);
        if (allArticles.length >= limit) break; // Stop once we've collected enough articles
      }

      // Click "More" and load additional articles if we haven't reached the limit
      if (allArticles.length < limit) {
        await this.clickMoreLink();
        this.refreshLocators();
      }
    }

    return allArticles; // Return the accumulated articles
  }

  // Validate that the accumulated articles are sorted correctly from newest to oldest
  async validateArticlesAreSorted(articles) {
    for (let i = 0; i < articles.length - 1; i++) {
      const articleDate1 = new Date(articles[i]);
      const articleDate2 = new Date(articles[i + 1]);
      if (!(articleDate1 >= articleDate2)) {
        console.log(`Articles at index ${i} and ${i + 1} are not correctly sorted.`);
        return false;
      }
    }
    return true;
  }
}
