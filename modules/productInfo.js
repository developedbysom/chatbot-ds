const { json } = require("express");
const axios = require("axios");
const productInfo = async function (urlparam) {
  const response = await axios({
    method: "GET",
    url: "https://services.odata.org/V2/Northwind/Northwind.svc/Products",
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
