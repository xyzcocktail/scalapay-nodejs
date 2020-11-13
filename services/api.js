const axios = require('axios');
const CONSTS = require('../configs/consts');
const NodeCache = require('node-cache');
const { body, validationResult } = require('express-validator');
const nCache = new NodeCache({ stdTTL: 60*60*24, checkperiod: 3600 });
const headerConf = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + CONSTS.API_AUTH_TOKEN,
  },
}
const ccKey = "scalapayConfigs";

const getConfigurations = () => {
  return new Promise((resolve, reject) => {
    let chkValue = nCache.get(ccKey);
    if (chkValue == undefined) {
      axios.get(`${CONSTS.BASE_URL}/v2/configurations`, headerConf)
        .then(function (response) {
          nCache.set(ccKey, response.data);
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.message);
        });
    } else {
      resolve(chkValue);
    }
  });
};

const createOrder = (params) => {
  return new Promise((resolve, reject) => {
    axios.post(`${CONSTS.BASE_URL}/v2/orders`, params, headerConf)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error.message);
      });
  });
};

module.exports = {
  getConfigurations,
  createOrder,
};
