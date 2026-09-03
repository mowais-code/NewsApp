const newsHandler = require("../../api/news");

exports.handler = async function handler(event) {
  const query = Object.fromEntries(new URLSearchParams(event.rawQuery || ""));
  let statusCode = 200;
  let body = "";
  const headers = {};

  const response = {
    setHeader(name, value) {
      headers[name] = value;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(value);
      return this;
    },
    send(value) {
      body = value;
      return this;
    },
  };

  await newsHandler(
    {
      method: event.httpMethod,
      query,
    },
    response
  );

  return {
    statusCode,
    headers,
    body,
  };
};
