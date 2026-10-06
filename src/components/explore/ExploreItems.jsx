import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";

const SkeletonCard = () => {
  return (
    <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
      <div className="nft__item">
        <div className="skeleton skeleton-author"></div>

        <div className="skeleton skeleton-countdown"></div>

        <div className="nft__item_wrap">
          <div className="skeleton skeleton-image"></div>
        </div>

        <div className="nft__item_info">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-price"></div>
        </div>
      </div>
    </div>
  );
};

const ExploreItems = () => {
  const [exploreItems, setExploreItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchExploreItems = async () => {
    const startTime = Date.now();

    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      const items = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.items || [];

      setExploreItems(items);
    } catch (err) {
      console.error(err);
      setError("Failed to load explore items.");
    } finally {
      const elapsedTime = Date.now() - startTime;
      const minimumLoadingTime = 500;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  fetchExploreItems();
}, []);

  const sortedItems = useMemo(() => {
    const items = [...exploreItems];

    switch (sortBy) {
      case "price_low_to_high":
        return items.sort(
          (a, b) => Number(a.price || 0) - Number(b.price || 0)
        );

      case "price_high_to_low":
        return items.sort(
          (a, b) => Number(b.price || 0) - Number(a.price || 0)
        );

      case "likes_high_to_low":
        return items.sort(
          (a, b) => Number(b.likes || 0) - Number(a.likes || 0)
        );

      default:
        return items;
    }
  }, [exploreItems, sortBy]);

  console.log({
  loading,
  error,
  itemCount: exploreItems.length,
  });

  return (
    <>
      <div>
        <select id="filter-items" 
        value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {loading &&
      Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}

      {!loading && error && (
        <div className="col-md-12 text-center">
          <p className="text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && sortedItems.length === 0 && (
        <div className="col-md-12 text-center">
          <p>No explore items found.</p>
        </div>
      )}

      {!loading &&
        !error &&
        sortedItems.map((item, index) => {
          const itemId = item.id || item._id || index;

          const image =
            item.image ||
            item.image_url ||
            item.imageUrl ||
            item.nftImage ||
            nftImage;

          const authorImage =
            item.author?.image ||
            item.authorImage ||
            item.author_image ||
            AuthorImage;

          const title = item.name || item.title || "Untitled NFT";
          const price = item.price ?? "0";
          const currency = item.currency || "ETH";
          const likes = item.likes ?? item.likeCount ?? 0;
          const authorName =
            item.author?.name || item.authorName || "Unknown author";

          return (
        <div
          key={itemId}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
            <div className="author_list_pp">
              <Link
                to="/author"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <img className="lazy" src={authorImage} alt={authorName} />
                <i className="fa fa-check"></i>
              </Link>
            </div>
            <div className="de_countdown">{item.timeLeft || item.expiry || "5h 30m 32s"}</div>

            <div className="nft__item_wrap">
              <div className="nft__item_extra">
                <div className="nft__item_buttons">
                  <button>Buy Now</button>
                  <div className="nft__item_share">
                    <h4>Share</h4>
                    <a href="" target="_blank" rel="noreferrer">
                      <i className="fa fa-facebook fa-lg"></i>
                    </a>
                    <a href="" target="_blank" rel="noreferrer">
                      <i className="fa fa-twitter fa-lg"></i>
                    </a>
                    <a href="">
                      <i className="fa fa-envelope fa-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
              <Link to="/item-details">
                <img src={image} className="lazy nft__item_preview" alt="" />
              </Link>
            </div>
            <div className="nft__item_info">
              <Link to="/item-details">
                <h4>{title}</h4>
              </Link>
              <div className="nft__item_price">{price} ETH</div>
              <div className="nft__item_like">
                <i className="fa fa-heart"></i>
                <span>{likes}</span>
              </div>
            </div>
          </div>
        </div>
        );
      })}

      {!loading && !error && sortedItems.length > 0 && (
        <div className="col-md-12 text-center">
          <button type="button" id="loadmore" className="btn-main lead">
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
