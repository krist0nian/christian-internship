import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";

const SkeletonCard = () => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
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

const getRemainingTime = (expiryDate, currentTime) => {
  if (!expiryDate) return null;

  const expiryTime = expiryDate * 1000;

  if (Number.isNaN(expiryTime)) {
    return null;
  }

  const difference = expiryTime - currentTime;

  if (difference <= 0) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);

  return {
    expired: false,
    days: Math.floor(totalSeconds / (60 * 60 * 24)),
    hours: Math.floor((totalSeconds / (60 * 60)) % 24),
    minutes: Math.floor((totalSeconds / 60) % 60),
    seconds: totalSeconds % 60,
  };
};

const formatTime = (time) => {
  if (!time) return null;

  if (time.expired) {
    return "Expired";
  }

  return `${String(time.hours).padStart(2, "0")}h ${String(
    time.minutes
  ).padStart(2, "0")}m ${String(time.seconds).padStart(2, "0")}s`;
};

const ExploreItems = () => {
  const [exploreItems, setExploreItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [currentTime, setCurrentTime] = useState(Date.now());

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

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
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
        sortedItems.slice(0, visibleCount).map((item, index) => {

          return (
        <div
          key={item.id}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
            <div className="author_list_pp">
              <Link
                to={`/author/${item.authorId}`} 
              >
                <img className="lazy" src={item.authorImage} alt={item.authorName} />
                <i className="fa fa-check"></i>
              </Link>
            </div>
            <div className="de_countdown">
              {formatTime(getRemainingTime(item.expiryDate, currentTime))}
            </div>

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
              <Link to={`/item-details/${item.id}`}>
                <img src={item.nftImage} className="lazy nft__item_preview" alt="" />
              </Link>
            </div>
            <div className="nft__item_info">
              <Link to={`/item-details/${item.id}`}>
                <h4>{item.title}</h4>
              </Link>
              <div className="nft__item_price">{item.price} ETH</div>
              <div className="nft__item_like">
                <i className="fa fa-heart"></i>
                <span>{item.likes}</span>
              </div>
            </div>
          </div>
        </div>
        );
      })}

      {!loading && !error && sortedItems.length > 0 && (
        <div className="col-md-12 text-center">
          <button type="button" id="loadmore" className="btn-main lead" onClick={() => setVisibleCount(visibleCount + 4)}>
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
