const CONSTS = require('../configs/consts');
const express = require('express');
const router = express.Router();
const api = require('../services/api');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const { body, validationResult } = require('express-validator');

let totAmount = 0;

CONSTS.CART_ITEMS.forEach(item => {
  if (item.price && item.price.amount) {
    totAmount += parseFloat(item.price.amount);
  }
});

/* HOME */
router.get('/', (req, res, next) => {
  api.getConfigurations()
    .then((respData) => {
      CONSTS.DEBUG && console.info("***** Response: ");
      CONSTS.DEBUG && console.info(respData);
      res.render('index.html', {
        data: respData,
        items: CONSTS.CART_ITEMS,
        totAmount: totAmount,
        locales: CONSTS.LOCALES,
        currencies: CONSTS.CURRENCIES
      });
    })
    .catch((errMsg) => {
      CONSTS.DEBUG && console.info(`***** Error: ${errMsg}`);
      res.render('error.html', { message: errMsg });
    });
});

/* ORDER */
router.post('/order', [
    multipartMiddleware,
    body('consumer.givenNames').notEmpty(),
    body('consumer.surname').notEmpty(),
    body('consumer.email').isEmail(),
    body('consumer.phoneNumber').notEmpty(),
    body('shipping.name').notEmpty(),
    body('shipping.phoneNumber').notEmpty(),
    body('shipping.line1').notEmpty(),
    body('shipping.suburb').notEmpty(),
    body('shipping.countryCode').notEmpty(),
    body('shipping.postcode').notEmpty(),
  ], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('error.html', { message: 'Invalid data!' });
    // return res.status(400).json({ errors: errors.array() });
  }
  let params = {};
  let postData = req.body;
  if (postData) {
    params.consumer = postData.consumer;
    params.shipping = postData.shipping;
    params.merchant = { redirectConfirmUrl: "http://localhost:3000/success", redirectCancelUrl: "http://localhost:3000/" };
    params.merchantReference = postData.merchantReference;
    params.items = CONSTS.CART_ITEMS;
    params.totalAmount = { amount: totAmount.toString(), currency: 'EUR' };
    CONSTS.DEBUG && console.log("** order [params]: **");
    CONSTS.DEBUG && console.log(JSON.stringify(params));
    api.createOrder(JSON.stringify(params))
      .then((respData) => {
        if (respData && respData.checkoutUrl) {
          res.writeHead(301, { Location: respData.checkoutUrl });
          res.end();
        } else {
          CONSTS.DEBUG && console.info(`***** Response Data Error *****`);
          res.writeHead(301, { Location: '/' });
        }
      })
      .catch((errMsg) => {
        CONSTS.DEBUG && console.info(`***** Error: ${errMsg} *****`);
        res.render('error.html', { message: errMsg });
      });
  } else {
    res.writeHead(301, { Location: '/' });
    res.end();
  }
});

module.exports = router;
