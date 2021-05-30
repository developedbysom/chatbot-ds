const express = require("express");
const axios = require("axios");
const nodefetch = require("node-fetch");
const sapcaiToken = require("./modules/sapcaiToken");
const productInfo = require("./modules/productInfo");
const localStorage = require("node-persist");

const { json, response } = require("express");

const app = express();
app.use(json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`
    <form action="/sapcai" method="POST">
    <p>Type your message</p>
    <input name="query" autocomplete=off>
    <button>Send</button>
    </form>
    `);
});

app.post("/sapcai", async (req, res) => {
  const msg = req.body.query;
  await localStorage.init();
  // get token from store
  let auth_token = await localStorage.getItem("auth_token");
  let access_token, expiry, time_now;

  if (!auth_token) {
    access_token = await sapcaiToken();
  } else {
    access_token = auth_token.access_token;
    expiry = auth_token.expiry;
    time_now = auth_token.time_now;

    if (access_token === "" || (Date.now() - time_now) / 1000 > expiry) {
      access_token = await sapcaiToken();
    }
  }

  const bot_connector = "https://api.cai.tools.sap/build/v1/dialog";

  //dialog playload
  var dialogPayload = {
    message: { type: "text", content: msg },
    conversation_id: "test",
  };
  dialogPayload = JSON.stringify(dialogPayload);

  //set headers
  const dialog_headers = {
    Authorization: "Bearer " + access_token,
    "X-Token": "Token " + "23faebbfff21a04e968b93d44ce8dbd6",
    "Content-Type": "application/json",
  };
  //connect sap cai bot
  const bot_res = await nodefetch(bot_connector, {
    method: "POST",
    headers: dialog_headers,
    body: dialogPayload,
  });
  //parse the bot response
  const results = await bot_res.json();

  //build the output
  const bot_output = {
    intent: results.results.nlp.intents[0].slug,
    entity: results.results.nlp.entities,
    message: results.results.messages[0].content,
  };
  let filter = "";
  if (bot_output.entity.productname) {
    let product_name = bot_output.entity.productname;
    product_name.map((key) => {
      if (filter.length > 0) {
        filter = filter + " or " + `ProductName eq '${key.value}'`;
      } else {
        filter = `ProductName eq '${key.value}'`;
      }
    });
  } else {
    res.send(bot_output);
    return;
  }
  const urlparam = {};
  if (filter) {
    urlparam.filter = filter;
  }
  const result_final = await productInfo(urlparam);

  res.send(result_final);
});

app.get("/products", async (req, res) => {
  const response = await axios({
    method: "GET",
    url: "https://services.odata.org/V2/Northwind/Northwind.svc/Products",
    params: {
      $format: "json",
    },
    headers: {
      accept: "application/json",
    },
  });
  res.send(response.data.d);
});
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
