const api = require('../services/api');

describe('API Functions', () => {
  test("getConfigurations return values should contains below keys [minimumAmount, maximumAmount, numberOfPayments]", () => {
    api.getConfigurations().then(respData => {
      expect(respData).toHaveProperty('minimumAmount');
      expect(respData).toHaveProperty('maximumAmount');
      expect(respData).toHaveProperty('numberOfPayments');
    });
  });
});
