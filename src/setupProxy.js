const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
  app.use("/api/news", (request, response, next) => {
    if (!process.env.NEWS_API_KEY) {
      return response.status(500).json({
        message: "NEWS_API_KEY is missing. Add it to .env and restart npm start.",
      });
    }

    return next();
  });

  app.use(
    "/api/news",
    createProxyMiddleware({
      target: "https://newsapi.org",
      changeOrigin: true,
      pathRewrite: (path) => {
        const newsUrl = new URL(path, "https://newsapi.org");
        newsUrl.pathname = "/v2/top-headlines";
        newsUrl.searchParams.set("apiKey", process.env.NEWS_API_KEY || "");
        return `${newsUrl.pathname}${newsUrl.search}`;
      },
    })
  );
};
