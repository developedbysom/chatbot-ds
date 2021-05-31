const { json } = require("express");
const axios = require("axios");
const config = require("config");
const productInfo = async function (urlparam) {
  const url = config.get("northwind_api");
  const response = await axios({
    method: "GET",
    url: url,
    params: {
      $filter: urlparam.filter,
      $format: "json",
    },
    headers: {
      accept: "application/json",
    },
  });

  return response.data.d.results;
};
module.exports = productInfo;
