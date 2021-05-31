const nodefetch = require("node-fetch");
const localStorage = require("node-persist");
const config = require("config");

async function sapcaiToken() {
  const auth_url = config.get("auth_url");
  const client_id = config.get("client_id");
  const clientSecret = config.get("client_secret");

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", client_id);
  params.append("client_secret", clientSecret);

  const result = await nodefetch(auth_url, {
    method: "POST",
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  var output = await result.json();

  await localStorage.setItem("auth_token", {
    access_token: output.access_token,
    expiry: output.expires_in,
    time_now: Date.now(),
  });

  return output.access_token;
}

module.exports = sapcaiToken;
