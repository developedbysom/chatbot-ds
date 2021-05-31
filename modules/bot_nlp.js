const config = require("config");
const nodefetch = require("node-fetch");
const bot_nlp = async function (access_token, msg) {
  const bot_connector = config.get("bot_api");
  const dev_token = config.get("dev_token");

  //dialog playload
  var dialogPayload = {
    message: { type: "text", content: msg },
    conversation_id: "test",
  };
  dialogPayload = JSON.stringify(dialogPayload);

  //set headers
  const dialog_headers = {
    Authorization: "Bearer " + access_token,
    "X-Token": "Token " + dev_token,
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
  return results;
};

module.exports = bot_nlp;
