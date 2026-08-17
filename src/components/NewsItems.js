import React, { useState } from "react";

const NewsItems = (props) => {
  const { title, description, imageUrl, newsUrl, author, date, source } = props;
  const [imageError, setImageError] = useState(false);
  const defaultImage =
    "https://via.placeholder.com/400x200?text=No+Image+Available";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div>
      <div className="card">
        <span
          className="position-absolute top-20 end-0 badge rounded-pill bg-danger"
          style={{ zIndex: "1" }}
        >
          {source}
        </span>
        <img
          src={imageError || !imageUrl ? defaultImage : imageUrl}
          className="card-img-top"
          alt="News article"
          onError={handleImageError}
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text">
            <small className="text-body-secondary">
              By {!author ? "unknown" : author} on {new Date(date).toGMTString()}
            </small>
          </p>
          <a
            href={newsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-dark"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItems;
