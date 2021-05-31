const express = require("express");
const axios = require("axios");
const getToken = require("./modules/getToken");
const productInfo = require("./modules/productInfo");
const { json, response } = require("express");
const bot_nlp = require("./modules/bot_nlp");

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
  const access_token = await getToken();
  const results = await bot_nlp(access_token, msg);
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

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
