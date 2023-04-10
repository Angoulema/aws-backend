export default {
  type: "object",
  properties: {
    productName: { type: 'string' },
    productType: { type: 'string' },
    price: { type: 'number' },
    currency: { type: 'string' },
    description: { type: 'string' },
    quantity: { type: 'number' }
  },
  required: ['productName, productType, price, currency, description, quantity']
} as const;
