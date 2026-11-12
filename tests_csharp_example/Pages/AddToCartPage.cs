using Microsoft.Playwright;
using System;
using System.Threading.Tasks;

namespace VintageDagoShop.Automation.Pages
{
    /// <summary>
    /// Add to Cart Page Object
    /// 
    /// Encapsulates all locators and methods for cart operations.
    /// Does NOT contain assertions or business logic.
    /// </summary>
    public class AddToCartPage
    {
        // ==================== Private Fields ====================
        private readonly IPage _page;
        private const int DefaultTimeout = 10000; // 10 seconds

        // ==================== Locators ====================
        private ILocator CartBadge => _page.GetByTestId("cart-badge");
        private ILocator SuccessMessage => _page.GetByTestId("add-to-cart-success");
        private ILocator CartTotal => _page.GetByTestId("navbar-cart-total");
        private ILocator CartIcon => _page.GetByTestId("nav-cart");

        // ==================== Constructor ====================
        public AddToCartPage(IPage page)
        {
            _page = page ?? throw new ArgumentNullException(nameof(page));
        }

        // ==================== Cart Badge Methods ====================

        /// <summary>
        /// Get cart item count from badge
        /// </summary>
        public async Task<int> GetCartItemCountAsync()
        {
            try
            {
                string badgeText = await CartBadge.TextContentAsync();
                if (int.TryParse(badgeText?.Trim(), out int count))
                    return count;
                return 0;
            }
            catch
            {
                return 0; // Badge not found
            }
        }

        /// <summary>
        /// Check if cart badge is visible
        /// </summary>
        public async Task<bool> IsCartBadgeVisibleAsync()
        {
            return await CartBadge.IsVisibleAsync();
        }

        // ==================== Button Methods ====================

        /// <summary>
        /// Get "Add to Cart" button for specific product
        /// </summary>
        public ILocator GetAddToCartButtonForProduct(int productId)
        {
            return _page.GetByTestId($"btn-add-to-cart-{productId}");
        }

        /// <summary>
        /// Check if "Add to Cart" button is enabled
        /// </summary>
        public async Task<bool> IsAddToCartButtonEnabledAsync(int productId)
        {
            try
            {
                var button = GetAddToCartButtonForProduct(productId);
                return await button.IsEnabledAsync();
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Click "Add to Cart" button
        /// </summary>
        public async Task ClickAddToCartButtonAsync(int productId)
        {
            var button = GetAddToCartButtonForProduct(productId);
            await button.ClickAsync();
        }

        // ==================== Interaction Methods ====================

        /// <summary>
        /// Generic click method
        /// </summary>
        public async Task ClickAsync(ILocator locator)
        {
            await locator.ClickAsync();
        }

        /// <summary>
        /// Clear cart via UI or localStorage
        /// </summary>
        public async Task ClearCartAsync()
        {
            await _page.EvaluateAsync("() => localStorage.removeItem('vintageDagoCart')");
            await _page.ReloadAsync();
        }

        /// <summary>
        /// Navigate to cart page
        /// </summary>
        public async Task GoToCartPageAsync()
        {
            await CartIcon.ClickAsync();
            await _page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
        }

        // ==================== Price Methods ====================

        /// <summary>
        /// Get cart total price
        /// </summary>
        public async Task<decimal> GetCartTotalPriceAsync()
        {
            try
            {
                string priceText = await CartTotal.TextContentAsync();
                // Remove $ and parse
                priceText = priceText?.Replace("$", "").Replace(",", "").Trim();
                if (decimal.TryParse(priceText, out decimal price))
                    return price;
                return 0m;
            }
            catch
            {
                return 0m;
            }
        }

        // ==================== Message Methods ====================

        /// <summary>
        /// Check if success message is visible
        /// </summary>
        public async Task<bool> IsSuccessMessageVisibleAsync()
        {
            try
            {
                return await SuccessMessage.IsVisibleAsync();
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Get success message text
        /// </summary>
        public async Task<string> GetSuccessMessageTextAsync()
        {
            return await SuccessMessage.TextContentAsync() ?? string.Empty;
        }

        // ==================== LocalStorage Methods ====================

        /// <summary>
        /// Get cart data from localStorage
        /// </summary>
        public async Task<string> GetCartDataFromLocalStorageAsync()
        {
            try
            {
                return await _page.EvaluateAsync<string>(
                    "() => localStorage.getItem('vintageDagoCart')"
                );
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Check if localStorage contains specific key
        /// </summary>
        public async Task<bool> LocalStorageContainsKeyAsync(string key)
        {
            try
            {
                var result = await _page.EvaluateAsync<string>(
                    $"() => localStorage.getItem('{key}')"
                );
                return !string.IsNullOrEmpty(result);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Clear localStorage completely
        /// </summary>
        public async Task ClearLocalStorageAsync()
        {
            await _page.EvaluateAsync("() => localStorage.clear()");
        }
    }
}
