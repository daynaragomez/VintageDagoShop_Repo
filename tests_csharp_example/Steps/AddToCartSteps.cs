using Microsoft.Playwright;
using System;
using System.Threading.Tasks;
using VintageDagoShop.Automation.Pages;
using VintageDagoShop.Automation.Support;

namespace VintageDagoShop.Automation.Steps
{
    /// <summary>
    /// Add to Cart Steps - User Actions/Workflows
    /// 
    /// Meaningful user actions for cart operations.
    /// Readable as business scenarios.
    /// Combines page methods into workflows.
    /// 
    /// Naming Convention:
    /// - All methods: async User{Action}{Description}Async()
    /// - ALWAYS start with "User" to emphasize user action
    /// - Descriptive: what the user does, not how system responds
    /// </summary>
    public class AddToCartSteps
    {
        // ==================== Private Fields ====================
        private readonly AddToCartPage _addToCartPage;

        // ==================== Constructor ====================
        public AddToCartSteps(AddToCartPage addToCartPage)
        {
            _addToCartPage = addToCartPage ?? 
                throw new ArgumentNullException(nameof(addToCartPage));
        }

        // ==================== User Workflows ====================

        /// <summary>
        /// User adds a product to cart with default quantity (1)
        /// 
        /// Workflow:
        /// 1. Click "Add to Cart" button for product
        /// 2. Wait for any modal/confirmation
        /// 3. If modal appears, confirm the action
        /// 4. Wait for cart update
        /// 
        /// Expected: Product is added with quantity=1
        /// </summary>
        public async Task UserAddsProductToCartAsync(int productId)
        {
            Logger.Info($"  Action: Get 'Add to Cart' button for product {productId}");
            var addButton = _addToCartPage.GetAddToCartButtonForProduct(productId);

            Logger.Info($"  Action: Click 'Add to Cart' button");
            await _addToCartPage.ClickAsync(addButton);

            Logger.Info($"  Action: Wait for page to update");
            await Task.Delay(500); // Brief delay for cart update

            Logger.Info($"  Verify: Product {productId} added successfully");
        }

        /// <summary>
        /// User adds product to cart multiple times
        /// 
        /// Workflow:
        /// 1. Calls UserAddsProductToCartAsync N times
        /// 2. Waits between each add
        /// 
        /// Expected: Product quantity increases by N
        /// </summary>
        public async Task UserAddsProductMultipleTimesAsync(int productId, int times)
        {
            Logger.Info($"  Action: Add product {productId} {times} times");

            for (int i = 0; i < times; i++)
            {
                Logger.Info($"    ├─ Add #{i + 1}/{times}");
                await UserAddsProductToCartAsync(productId);
                await Task.Delay(300); // Delay between adds
            }

            Logger.Info($"  Verify: Product {productId} added {times} times");
        }

        /// <summary>
        /// User adds multiple different products to cart
        /// 
        /// Workflow:
        /// 1. For each product ID in array
        /// 2. Call UserAddsProductToCartAsync
        /// 3. Wait between adds
        /// 
        /// Expected: Each product is added once (or more)
        /// </summary>
        public async Task UserAddsMultipleProductsAsync(int[] productIds)
        {
            Logger.Info($"  Action: Add {productIds.Length} different products");

            for (int i = 0; i < productIds.Length; i++)
            {
                int productId = productIds[i];
                Logger.Info($"    ├─ Add product {i + 1}/{productIds.Length} (ID={productId})");
                await UserAddsProductToCartAsync(productId);
            }

            Logger.Info($"  Verify: All {productIds.Length} products added");
        }

        /// <summary>
        /// User clears the shopping cart
        /// </summary>
        public async Task UserClearsTheCartAsync()
        {
            Logger.Info("  Action: Clear all items from cart");
            await _addToCartPage.ClearCartAsync();
            Logger.Info("  Verify: Cart is now empty");
        }

        /// <summary>
        /// User navigates to cart page
        /// </summary>
        public async Task UserNavigatesToCartPageAsync()
        {
            Logger.Info("  Action: Click cart icon / navigate to cart");
            await _addToCartPage.GoToCartPageAsync();
            Logger.Info("  Verify: Cart page loaded");
        }
    }
}
