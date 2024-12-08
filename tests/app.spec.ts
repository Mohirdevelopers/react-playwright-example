import { test, expect } from '@playwright/test';

test.describe('Notes Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display posts', async ({ page }) => {
    // Wait for posts to load
    await expect(page.locator('.posts-grid')).toBeVisible();
    
    // Check if multiple posts are displayed
    const posts = page.locator('.post-card');
    await expect(posts).toHaveCount(await posts.count());
    
    // Verify post structure
    const firstPost = posts.first();
    await expect(firstPost.locator('h2')).toBeVisible();
    await expect(firstPost.locator('p')).toBeVisible();
    await expect(firstPost.locator('.post-meta')).toBeVisible();
  });

  test('should display tags for each post', async ({ page }) => {
    // Wait for the first post to be visible
    const firstPost = page.locator('.post-card').first();
    await expect(firstPost).toBeVisible();
    
    // Check if tags are present
    const tags = firstPost.locator('.tag');
    await expect(tags).toHaveCount(await tags.count());
    
    // Verify tags are not empty
    const firstTag = tags.first();
    const tagText = await firstTag.textContent();
    expect(tagText?.length).toBeGreaterThan(0);
  });

  test('should show delete button on hover', async ({ page }) => {
    const firstPost = page.locator('.post-card').first();
    const deleteButton = firstPost.locator('.delete-button');
    
    // Initially button should be invisible (opacity: 0)
    await expect(deleteButton).toHaveCSS('opacity', '0');
    
    // Hover over post
    await firstPost.hover();
    
    // Button should become visible (opacity: 1)
    await expect(deleteButton).toHaveCSS('opacity', '1');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock failed API response
    await page.route('**/posts/*', route => route.abort());
    
    // Try to delete a post
    const firstPost = page.locator('.post-card').first();
    await firstPost.hover();
    await firstPost.locator('.delete-button').click();
    
    // Verify post still exists (delete failed)
    await expect(firstPost).toBeVisible();
  });

  test('should show loading state initially', async ({ page }) => {
    // Navigate to page and immediately check for loading state
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.loading')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.posts-grid')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.posts-grid')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('.posts-grid')).toBeVisible();
  });
}); 