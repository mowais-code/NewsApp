const allowedCategories = new Set([
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
]);

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ message: "Method not allowed" });
  }

  const { country = "us", category = "general", page = "1", pageSize = "15" } = request.query;
  const parsedPage = Number(page);
  const parsedPageSize = Number(pageSize);

  if (!/^[a-z]{2}$/i.test(country) || !allowedCategories.has(category) ||
      !Number.isInteger(parsedPage) || parsedPage < 1 ||
      !Number.isInteger(parsedPageSize) || parsedPageSize < 1 || parsedPageSize > 100) {
    return response.status(400).json({ message: "Invalid news query" });
  }

  if (!process.env.NEWS_API_KEY) {
    return response.status(500).json({ message: "NEWS_API_KEY is not configured on the server" });
  }

  const newsUrl = new URL("https://newsapi.org/v2/top-headlines");
  newsUrl.search = new URLSearchParams({
    country: country.toLowerCase(),
    category,
    page: String(parsedPage),
    pageSize: String(parsedPageSize),
    apiKey: process.env.NEWS_API_KEY,
  });

  try {
    const newsResponse = await fetch(newsUrl);
    const body = await newsResponse.text();

    response.setHeader("Content-Type", "application/json");
    return response.status(newsResponse.status).send(body);
  } catch (error) {
    console.error("NewsAPI proxy failed", error);
    return response.status(502).json({ message: "Unable to reach NewsAPI" });
  }
};