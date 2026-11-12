using Microsoft.Playwright;
using System;
using System.Threading.Tasks;

namespace VintageDagoShop.Automation.Pages
{
    /// <summary>
    /// Product Browsing Page Object
    /// 
    /// Encapsulates all locators and navigation methods for product listing page.
    /// Does NOT contain assertions or business logic.
    /// </summary>
    public class ProductBrowsingPage
    {
        // ==================== Private Fields ====================
        private readonly IPage _page;
        private const int DefaultTimeout = 10000; // 10 seconds

        // ==================== Locators ====================
        private ILocator ProductsGrid => _page.GetByTestId("products-grid");
        private ILocator LoadingSpinner => _page.GetByTestId("loading-spinner");
        private ILocator SearchInput => _page.GetByTestId("search-input");

        // ==================== Constructor ====================
        public ProductBrowsingPage(IPage page)
        {
            _page = page ?? throw new ArgumentNullException(nameof(page));
        }

        // ==================== Navigation Methods ====================

        /// <summary>
        /// Navigate to product listing page (home page where products are displayed)
        /// </summary>
        public async Task GotoAsync(string baseUrl = "http://127.0.0.1:5174")
        {
            await _page.GotoAsync(baseUrl);
            await WaitForProductsGridToLoadAsync();
        }

        /// <summary>
        /// Wait for products grid to appear and be visible
        /// </summary>
        public async Task WaitForProductsGridToLoadAsync()
        {
            await ProductsGrid.WaitForAsync(new LocatorWaitForOptions
            {
                State = WaitForSelectorState.Visible,
                Timeout = DefaultTimeout
            });
        }

        /// <summary>
        /// Wait for loading spinner to disappear (page fully loaded)
        /// </summary>
        public async Task WaitForLoadingToCompleteAsync()
        {
            try
            {
                await LoadingSpinner.WaitForAsync(new LocatorWaitForOptions
                {
                    State = WaitForSelectorState.Hidden,
                    Timeout = DefaultTimeout
                });
            }
            catch
            {
                // Spinner might not exist, that's OK
            }
        }

        // ==================== Retrieval Methods ====================

        /// <summary>
        /// Get count of visible product cards on page
        /// </summary>
        public async Task<int> GetVisibleProductsCountAsync()
        {
            return await _page.Locator("[data-testid^=\"product-card-\"]").CountAsync();
        }

        /// <summary>
        /// Get URL of current page
        /// </summary>
        public string GetCurrentUrl()
        {
            return _page.Url;
        }

        /// <summary>
        /// Get page title
        /// </summary>
        public async Task<string> GetPageTitleAsync()
        {
            return await _page.TitleAsync();
        }

        /// <summary>
        /// Reload the current page
        /// </summary>
        public async Task ReloadPageAsync()
        {
            await _page.ReloadAsync();
            await WaitForProductsGridToLoadAsync();
        }

        // ==================== Product-Specific Locators ====================

        /// <summary>
        /// Get "Add to Cart" button for specific product by ID
        /// </summary>
        public ILocator GetAddToCartButtonForProduct(int productId)
        {
            return _page.GetByTestId($"btn-add-to-cart-{productId}");
        }

        /// <summary>
        /// Get product card element for specific product
        /// </summary>
        public ILocator GetProductCard(int productId)
        {
            return _page.GetByTestId($"product-card-{productId}");
        }

        /// <summary>
        /// Get product name element for specific product
        /// </summary>
        public ILocator GetProductName(int productId)
        {
            return _page.GetByTestId($"product-name-{productId}");
        }

        /// <summary>
        /// Get product price element for specific product
        /// </summary>
        public ILocator GetProductPrice(int productId)
        {
            return _page.GetByTestId($"product-price-{productId}");
        }

        /// <summary>
        /// Get product stock indicator for specific product
        /// </summary>
        public ILocator GetProductStock(int productId)
        {
            return _page.GetByTestId($"product-stock-{productId}");
        }

        // ==================== Interaction Methods ====================

        /// <summary>
        /// Click element with error handling
        /// </summary>
        public async Task ClickAsync(ILocator locator)
        {
            await locator.ClickAsync();
        }

        /// <summary>
        /// Get element text content
        /// </summary>
        public async Task<string> GetTextAsync(ILocator locator)
        {
            return await locator.TextContentAsync() ?? string.Empty;
        }

        /// <summary>
        /// Check if element is visible
        /// </summary>
        public async Task<bool> IsVisibleAsync(ILocator locator)
        {
            return await locator.IsVisibleAsync();
        }

        /// <summary>
        /// Check if element is enabled
        /// </summary>
        public async Task<bool> IsEnabledAsync(ILocator locator)
        {
            return await locator.IsEnabledAsync();
        }

        /// <summary>
        /// Wait for element to be visible
        /// </summary>
        public async Task WaitForElementAsync(ILocator locator, int timeout = DefaultTimeout)
        {
            await locator.WaitForAsync(new LocatorWaitForOptions
            {
                State = WaitForSelectorState.Visible,
                Timeout = timeout
            });
        }

        // ==================== LocalStorage Methods ====================

        /// <summary>
        /// Get value from localStorage
        /// </summary>
        public async Task<string> GetLocalStorageAsync(string key)
        {
            return await _page.EvaluateAsync<string>(
                $"() => localStorage.getItem('{key}')"
            );
        }

        /// <summary>
        /// Get all localStorage data
        /// </summary>
        public async Task<string> GetAllLocalStorageAsync()
        {
            return await _page.EvaluateAsync<string>(
                "() => JSON.stringify(localStorage)"
            );
        }

        /// <summary>
        /// Clear localStorage
        /// </summary>
        public async Task ClearLocalStorageAsync()
        {
            await _page.EvaluateAsync("() => localStorage.clear()");
        }
    }
}
