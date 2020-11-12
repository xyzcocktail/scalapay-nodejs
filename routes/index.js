const CONSTS = require('../configs/consts');
const express = require('express');
const router = express.Router();
const api = require('../services/api');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

let totAmount = 0;

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

CART_ITEMS.forEach(item => {
  if (item.price && item.price.amount) {
    totAmount += parseFloat(item.price.amount);
  }
});

/* HOME */
router.get('/', function(req, res, next) {
  api.getConfigurations()
    .then(function(respData) {
      CONSTS.DEBUG && console.info("***** Response: ");
      CONSTS.DEBUG && console.info(respData);
      res.render('index.html', {
        data: respData,
        items: CART_ITEMS,
        totAmount: totAmount,
        locales: CONSTS.LOCALES,
        currencies: CONSTS.CURRENCIES
      });
    })
    .catch(function(errMsg) {
      CONSTS.DEBUG && console.info(`***** Error: ${errMsg}`);
      res.render('error.html', { message: errMsg });
    });
});

/* ORDER */
router.post('/order', multipartMiddleware, function(req, res, next) {
  let params = {};
  let body = req.body;
  CONSTS.DEBUG && console.log(body);
  if (body) {
    params.consumer = body.consumer;
    params.shipping = body.shipping;
    params.items = CART_ITEMS;
    params.merchant = { redirectConfirmUrl: "http://localhost:3000/success", redirectCancelUrl: "http://localhost:3000/" };
    params.merchantReference = body.merchantReference;
    params.totalAmount = { amount: totAmount.toString(), currency: 'EUR' };
    CONSTS.DEBUG && console.log("** order [params]: **");
    CONSTS.DEBUG && console.log(JSON.stringify(params));
    api.createOrder(JSON.stringify(params))
      .then(function(respData) {
        if (respData && respData.checkoutUrl) {
          res.writeHead(301, { Location: respData.checkoutUrl });
          res.end();
        } else {
          CONSTS.DEBUG && console.info(`***** Response Data Error *****`);
          res.writeHead(301, { Location: '/' });
        }
      })
      .catch(function(errMsg) {
        CONSTS.DEBUG && console.info(`***** Error: ${errMsg} *****`);
        res.render('error.html', { message: errMsg });
      });
  } else {
    res.writeHead(301, { Location: '/' });
    res.end();
  }
});

module.exports = router;
