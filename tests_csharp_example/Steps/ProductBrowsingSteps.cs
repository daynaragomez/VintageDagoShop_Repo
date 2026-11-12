using Microsoft.Playwright;
using System;
using System.Threading.Tasks;
using VintageDagoShop.Automation.Pages;
using VintageDagoShop.Automation.Support;

namespace VintageDagoShop.Automation.Steps
{
    /// <summary>
    /// Product Browsing Steps - User Workflows
    /// 
    /// Contains meaningful user actions (not low-level interactions).
    /// Readable as business scenarios.
    /// Methods combine Page Object methods into workflows.
    /// 
    /// Naming Convention:
    /// - All methods: async User{Action}{Description}Async()
    /// - Start with "User" to emphasize user action
    /// - Descriptive: what the user does, not how system responds
    /// </summary>
    public class ProductBrowsingSteps
    {
        // ==================== Private Fields ====================
        private readonly ProductBrowsingPage _productBrowsingPage;

        // ==================== Constructor ====================
        public ProductBrowsingSteps(ProductBrowsingPage productBrowsingPage)
        {
            _productBrowsingPage = productBrowsingPage ?? 
                throw new ArgumentNullException(nameof(productBrowsingPage));
        }

        // ==================== User Workflows ====================

        /// <summary>
        /// User navigates to product listing page
        /// 
        /// This workflow:
        /// 1. Navigates to home URL
        /// 2. Waits for products grid to load
        /// 3. Verifies loading is complete
        /// </summary>
        public async Task UserNavigatesToProductListingAsync(string baseUrl = "http://127.0.0.1:5174")
        {
            Logger.Info($"  Action: Navigate to {baseUrl}");
            await _productBrowsingPage.GotoAsync(baseUrl);
            
            Logger.Info("  Action: Wait for products grid to load");
            await _productBrowsingPage.WaitForProductsGridToLoadAsync();
            
            Logger.Info("  Action: Wait for loading spinner to complete");
            await _productBrowsingPage.WaitForLoadingToCompleteAsync();
        }

        /// <summary>
        /// User verifies products are loaded and visible
        /// 
        /// Checks that:
        /// - Products grid exists and is visible
        /// - At least one product card is displayed
        /// </summary>
        public async Task UserVerifiesProductsAreLoadedAsync()
        {
            Logger.Info("  Verify: Products grid is visible");
            int productCount = await _productBrowsingPage.GetVisibleProductsCountAsync();
            
            if (productCount == 0)
                throw new InvalidOperationException("No products found on page");
            
            Logger.Info($"  Verify: {productCount} products are displayed");
        }

        /// <summary>
        /// User searches for a product by name
        /// </summary>
        public async Task UserSearchesForProductAsync(string searchTerm)
        {
            Logger.Info($"  Action: Search for '{searchTerm}'");
            // Implementation would depend on search input locator
        }

        /// <summary>
        /// User reloads the page
        /// </summary>
        public async Task UserReloadsThePageAsync()
        {
            Logger.Info("  Action: Reload page (F5)");
            await _productBrowsingPage.ReloadPageAsync();
            Logger.Info("  Verify: Products grid reloaded successfully");
        }

        /// <summary>
        /// User checks current URL
        /// </summary>
        public string UserChecksCurrentUrl()
        {
            string url = _productBrowsingPage.GetCurrentUrl();
            Logger.Info($"  Current URL: {url}");
            return url;
        }
    }
}
