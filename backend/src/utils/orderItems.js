function aggregateOrderItems(items) {
  const quantitiesByProduct = new Map();

  for (const item of items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    const existing = quantitiesByProduct.get(productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      quantitiesByProduct.set(productId, { ...item, productId, quantity });
    }
  }

  return Array.from(quantitiesByProduct.values());
}

module.exports = { aggregateOrderItems };