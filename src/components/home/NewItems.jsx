import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";


const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";

const NewItemSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="nft__item">
        <div className="skeleton-relative">
          <div className="skeleton-box skeleton-item-avatar"></div>
          <div className="skeleton-box skeleton-item-countdown"></div>
          <div className="skeleton-box skeleton-item-image"></div>
        </div>

        <div className="nft__item_info">
          <div className="skeleton-box skeleton-item-title"></div>
          <div className="skeleton-box skeleton-item-price"></div>
          <div className="skeleton-box skeleton-item-likes"></div>
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

const NewItems = () => {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const res = await axios.get(API_URL);
        setItems(res.data);
        console.log("newItems response:", res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load New Items.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          {/* Section Title */}
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

            {/* Loading state */}
          {loading && (
            <div className="col-lg-12">
              <Slider {...settings}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <NewItemSkeleton key={index} />
                ))}
              </Slider>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="col-lg-12 text-center">
              <p>{error}</p>
            </div>
          )}

          {/* Successful data state */}
          {!loading && !error && (
            <div className="col-lg-12">
              <Slider {...settings}>
                {items.map((item) => {
                  const remainingTime = getRemainingTime(
                    item.expiryDate,
                    currentTime
                  );

          return (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.id}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to="./author/"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Creator: Monica Lucas"
                  >
                    <img className="lazy" src={item.authorImage} alt="" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                <div className="de_countdown">{formatTime(remainingTime)}</div>

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

                  <Link to={`/item-details/${item.nftId}`}>
                    <img
                      src={item.nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>

                <div className="nft__item_info">
                  <Link to={`/item-details/${item.nftId}`}>
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
          </Slider>
        </div>
        )}
        </div>
      </div>
    </section>
    );
  };

export default NewItems;
