const api = require('../services/api');
const faker = require('faker');
const CONSTS = require('../configs/consts');

describe('API Functions', () => {
  test("getConfigurations return values should contains these keys [minimumAmount, maximumAmount, numberOfPayments]", () => {
    api.getConfigurations().then(respData => {
      expect(respData).toHaveProperty('minimumAmount');
      expect(respData).toHaveProperty('maximumAmount');
      expect(respData).toHaveProperty('numberOfPayments');
    });
  });

  test("createOrder return values should contains these keys [token, expires, checkoutUrl]", () => {
    let params = {};
    let totAmount = 0;
    faker.locale = "it";
    CONSTS.CART_ITEMS.forEach(item => {
      if (item.price && item.price.amount) {
        totAmount += parseFloat(item.price.amount);
      }
    });
    params.consumer = {
      givenNames: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber()
    };
    params.shipping = {
      name: faker.name.findName(),
      phoneNumber: params.consumer.phoneNumber,
      line1: faker.address.streetAddress(),
      suburb: faker.address.city(),
      postcode: faker.address.zipCode(),
      countryCode: "IT"
    };
    params.merchant = { redirectConfirmUrl: "http://localhost:3000/success", redirectCancelUrl: "http://localhost:3000/" };
    params.merchantReference = `testOrder-${faker.random.number()}`;
    params.items = CONSTS.CART_ITEMS;
    params.totalAmount = { amount: totAmount.toString(), currency: 'EUR' };

    api.createOrder(JSON.stringify(params)).then(respData => {
      expect(respData).toHaveProperty('token');
      expect(respData).toHaveProperty('expires');
      expect(respData).toHaveProperty('checkoutUrl');
    });
  });
});
