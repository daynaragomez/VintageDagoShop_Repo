using NUnit.Framework;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using VintageDagoShop.Automation.Pages;
using VintageDagoShop.Automation.Support;

namespace VintageDagoShop.Automation.Assertions
{
    /// <summary>
    /// Add to Cart Assertions
    /// 
    /// Contains all assertions/verifications for cart functionality.
    /// Separate from page objects and steps.
    /// Only assertion methods (expect/verify).
    /// 
    /// Naming Convention:
    /// - All methods: async {Condition}Async(expectedValue)
    /// - Read like: "assert cart badge shows count"
    /// - Descriptive: what is being verified
    /// </summary>
    public class AddToCartAssertions
    {
        // ==================== Private Fields ====================
        private readonly AddToCartPage _addToCartPage;

        // ==================== Constructor ====================
        public AddToCartAssertions(AddToCartPage addToCartPage)
        {
            _addToCartPage = addToCartPage ?? 
                throw new ArgumentNullException(nameof(addToCartPage));
        }

        // ==================== Cart Badge Assertions ====================

        /// <summary>
        /// Assert cart badge shows expected item count
        /// 
        /// Expected: Cart badge displays count
        /// </summary>
        public async Task CartBadgeShowsCountAsync(int expectedCount)
        {
            Logger.Info($"  Assert: Cart badge shows {expectedCount} item(s)");
            
            int actualCount = await _addToCartPage.GetCartItemCountAsync();
            
            Logger.Info($"    Expected: {expectedCount}");
            Logger.Info($"    Actual:   {actualCount}");
            
            Assert.That(actualCount, Is.EqualTo(expectedCount),
                $"Cart badge should show {expectedCount} items, but showed {actualCount}");
            
            Logger.Info("    ✓ Cart badge count is correct");
        }

        /// <summary>
        /// Assert cart badge shows at least N items
        /// </summary>
        public async Task CartBadgeShowsAtLeastItemsAsync(int minimumCount)
        {
            Logger.Info($"  Assert: Cart badge shows at least {minimumCount} item(s)");
            
            int actualCount = await _addToCartPage.GetCartItemCountAsync();
            
            Logger.Info($"    Minimum: {minimumCount}");
            Logger.Info($"    Actual:  {actualCount}");
            
            Assert.That(actualCount, Is.GreaterThanOrEqualTo(minimumCount),
                $"Cart badge should show at least {minimumCount} items");
            
            Logger.Info("    ✓ Cart badge count is sufficient");
        }

        /// <summary>
        /// Assert cart badge is visible
        /// </summary>
        public async Task CartBadgeIsVisibleAsync()
        {
            Logger.Info("  Assert: Cart badge is visible");
            
            bool isVisible = await _addToCartPage.IsCartBadgeVisibleAsync();
            
            Assert.That(isVisible, Is.True,
                "Cart badge should be visible");
            
            Logger.Info("    ✓ Cart badge is visible");
        }

        // ==================== Button State Assertions ====================

        /// <summary>
        /// Assert "Add to Cart" button is enabled for product
        /// 
        /// Expected: Button is clickable
        /// </summary>
        public async Task AddToCartButtonIsEnabledForProductAsync(int productId)
        {
            Logger.Info($"  Assert: 'Add to Cart' button is enabled for product {productId}");
            
            bool isEnabled = await _addToCartPage.IsAddToCartButtonEnabledAsync(productId);
            
            Assert.That(isEnabled, Is.True,
                $"'Add to Cart' button should be enabled for product {productId}");
            
            Logger.Info($"    ✓ Button is enabled");
        }

        /// <summary>
        /// Assert "Add to Cart" button is disabled for product
        /// 
        /// Expected: Button is not clickable (usually OOS)
        /// </summary>
        public async Task AddToCartButtonIsDisabledForProductAsync(int productId)
        {
            Logger.Info($"  Assert: 'Add to Cart' button is disabled for product {productId}");
            
            bool isEnabled = await _addToCartPage.IsAddToCartButtonEnabledAsync(productId);
            
            Assert.That(isEnabled, Is.False,
                $"'Add to Cart' button should be disabled for product {productId}");
            
            Logger.Info($"    ✓ Button is disabled");
        }

        // ==================== LocalStorage Assertions ====================

        /// <summary>
        /// Assert cart data is persisted in localStorage
        /// 
        /// Expected: localStorage contains 'vintageDagoCart' key
        /// </summary>
        public async Task CartDataIsPersistedInLocalStorageAsync()
        {
            Logger.Info("  Assert: Cart data is persisted in localStorage");
            
            string cartData = await _addToCartPage.GetCartDataFromLocalStorageAsync();
            
            Assert.That(cartData, Is.Not.Null.And.Not.Empty,
                "Cart data should be persisted in localStorage");
            
            try
            {
                var cartObject = JsonSerializer.Deserialize<object>(cartData);
                Assert.That(cartObject, Is.Not.Null);
                Logger.Info("    ✓ Cart data is valid JSON in localStorage");
            }
            catch (JsonException ex)
            {
                Assert.Fail($"Cart data in localStorage is not valid JSON: {ex.Message}");
            }
        }

        /// <summary>
        /// Assert localStorage contains specific item
        /// </summary>
        public async Task CartContainsProductAsync(int productId)
        {
            Logger.Info($"  Assert: Cart contains product {productId}");
            
            string cartData = await _addToCartPage.GetCartDataFromLocalStorageAsync();
            
            Assert.That(cartData, Does.Contain(productId.ToString()),
                $"Cart data should contain product ID {productId}");
            
            Logger.Info($"    ✓ Product {productId} is in cart");
        }

        // ==================== Price Assertions ====================

        /// <summary>
        /// Assert cart total price is displayed
        /// </summary>
        public async Task CartTotalPriceIsDisplayedAsync()
        {
            Logger.Info("  Assert: Cart total price is displayed");
            
            decimal totalPrice = await _addToCartPage.GetCartTotalPriceAsync();
            
            Assert.That(totalPrice, Is.GreaterThan(0),
                "Cart total price should be greater than 0");
            
            Logger.Info($"    Total: ${totalPrice:F2}");
            Logger.Info("    ✓ Cart total price is displayed");
        }

        /// <summary>
        /// Assert cart total shows correct value
        /// </summary>
        public async Task CartTotalShowsCorrectAmountAsync(decimal expectedTotal)
        {
            Logger.Info($"  Assert: Cart total = ${expectedTotal:F2}");
            
            decimal actualTotal = await _addToCartPage.GetCartTotalPriceAsync();
            
            Logger.Info($"    Expected: ${expectedTotal:F2}");
            Logger.Info($"    Actual:   ${actualTotal:F2}");
            
            Assert.That(actualTotal, Is.EqualTo(expectedTotal).Within(0.01m),
                $"Cart total should be ${expectedTotal:F2}");
            
            Logger.Info("    ✓ Cart total is correct");
        }

        // ==================== Success Message Assertions ====================

        /// <summary>
        /// Assert success message is displayed
        /// </summary>
        public async Task SuccessMessageIsDisplayedAsync()
        {
            Logger.Info("  Assert: Success message is displayed");
            
            bool isVisible = await _addToCartPage.IsSuccessMessageVisibleAsync();
            
            Assert.That(isVisible, Is.True,
                "Success message should be displayed");
            
            Logger.Info("    ✓ Success message is visible");
        }

        /// <summary>
        /// Assert success message contains text
        /// </summary>
        public async Task SuccessMessageContainsTextAsync(string expectedText)
        {
            Logger.Info($"  Assert: Success message contains '{expectedText}'");
            
            string messageText = await _addToCartPage.GetSuccessMessageTextAsync();
            
            Assert.That(messageText, Does.Contain(expectedText),
                $"Success message should contain '{expectedText}'");
            
            Logger.Info("    ✓ Message text is correct");
        }
    }
}
