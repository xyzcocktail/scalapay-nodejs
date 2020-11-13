const DEBUG = true;
const API_AUTH_TOKEN = 'qhtfs87hjnc12kkos';
const BASE_URL = 'https://staging.api.scalapay.com';
const CURRENCIES = ['EUR'];
const LOCALES = ['EN', 'FR', 'IT'];
const CART_ITEMS = [
  {
    "name": "T-Shirt",
    "category": "clothes",
    "subcategory": ["shirt", "long-sleeve"],
    "brand": "TopChoice",
    "gtin": "123458791330",
    "sku": "12341234",
    "quantity": 1,
    "price": {
      "amount": "10.00",
      "currency": "EUR"
    }
  },
  {
    "name": "Jeans",
    "category": "clothes",
    "subcategory": ["pants", "jeans"],
    "brand": "TopChoice",
    "gtin": "123458722222",
    "sku": "12341235",
    "quantity": 1,
    "price": {
      "amount": "20.00",
      "currency": "EUR"
    }
  }
];

module.exports = {
  DEBUG,
  API_AUTH_TOKEN,
  BASE_URL,
  CURRENCIES,
  LOCALES,
  CART_ITEMS,
};
