const localStorage = require("node-persist");
const sapcaiToken = require("./sapcaiToken");

const getToken = async function () {
  await localStorage.init();
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
  return access_token;
};
module.exports = getToken;
