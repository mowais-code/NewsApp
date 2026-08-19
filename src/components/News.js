import React, { useEffect, useState, useCallback } from "react";
import NewsItems from "./NewsItems";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const { country, category, pageSize, setProgress, apiKey } = props;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  // document.title = `${this.capitalizeFirstLetter(props.category)} - NewsApp`;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = useCallback(async (pageNum) => {
    setProgress(10);
    setLoading(true);
    setError(null);

    try {
      if (!apiKey || apiKey === "YOUR_ACTUAL_API_KEY_HERE") {
        throw new Error("REACT_APP_NEWS_API is not configured. Add your NewsAPI key to the .env file.");
      }

      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${pageNum}&pageSize=${pageSize}`;
      setProgress(30);
      const data = await fetch(url);
      if (!data.ok) {
        if (data.status === 426) {
          throw new Error("NewsAPI blocks browser requests from deployed sites on the free plan. Use a server-side proxy or upgrade your NewsAPI plan.");
        }
        throw new Error(`NewsAPI request failed: ${data.status}`);
      }
      setProgress(70);
      const parsedData = await data.json();
      console.log(parsedData);
      setProgress(100);
      setPage(pageNum);
      setArticles(prevArticles => pageNum === 1 ? (parsedData.articles || []) : [...prevArticles, ...(parsedData.articles || [])]);
      setTotalResults(parsedData.totalResults || 0);
      setError(null);
      setLoading(false);
      if (parsedData.articles && parsedData.articles.length > 0) {
        setHasMoreData(true);
      } else if (pageNum > 1) {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("News fetch failed", error);
      setProgress(100);
      setArticles([]);
      setError(error.message || "Unable to load news. Check your network or API settings.");
      setLoading(false);
      setTotalResults(0);
      setHasMoreData(false);
    }
  }, [setProgress, apiKey, country, category, pageSize, setPage, setArticles, setTotalResults, setError, setLoading, setHasMoreData]);
  useEffect(() => {
    updateNews(1);
  }, [updateNews]);

  // const handlePreviousClick = async () => {
  //   const newPage = page - 1;
  //   if (newPage < 1) return;
  //   await updateNews(newPage);
  // };

  // const handleNextClick = async () => {
  //   const newPage = page + 1;
  //   const maxPage = Math.ceil(totalResults / props.pageSize) || Infinity;
  //   if (newPage > maxPage) return;
  //   await updateNews(newPage);
  // };

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    await updateNews(nextPage);
  };

  const hasMore = hasMoreData && articles.length < totalResults;

    return (
      <div className="container my3" style={{paddingTop: '80px'}}>
        <h1 className="text-center" style={{ margin: "35px 0px" }}>
        NewsApp Top {capitalizeFirstLetter(category)} Headlines
        </h1>
        {loading && <Spinner />}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={hasMore ? <Spinner /> : null}
          endMessage={
            <p className="text-center mt-3">
              <b>You have reached the end of the news list.</b>
            </p>
          }
        >
          <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItems
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
           </div>
          </div>
        </InfiniteScroll>
      </div>
    );
}

  News.defaultProps = {
    country: "us",
    pageSize: 8,
    category: "general",
  };

  News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    setProgress: PropTypes.func,
    apiKey: PropTypes.string,
  };

export default News;
