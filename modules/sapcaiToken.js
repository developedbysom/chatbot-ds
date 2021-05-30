// const urlsearchparams = require("urlsearchparams");
const nodefetch = require("node-fetch");
const localStorage = require("node-persist");

async function sapcaiToken() {
  const auth_url =
    "https://sapcai-community.authentication.eu10.hana.ondemand.com/oauth/token";
  const client_id =
    "sb-5876922e-68a0-4dfc-b42d-ecb1c3617a35-CLONE-DT!b40741|cai-production!b20881";
  const clientSecret = "aJI6Rg+67vMm1TN6dVLiyuk0D4I=";
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
