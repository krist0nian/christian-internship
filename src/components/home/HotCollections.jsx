import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections";

const HotCollectionSkeleton = () => {
  return (
    <div>
      <div className="nft_coll">
        <div className="nft_wrap">
          <div className="skeleton-box skeleton-collection-image"></div>
        </div>

        <div className="nft_coll_pp">
          <div className="skeleton-box skeleton-collection-avatar"></div>
        </div>

        <div className="nft_coll_info">
          <div className="skeleton-box skeleton-collection-title"></div>
          <div className="skeleton-box skeleton-collection-code"></div>
        </div>
      </div>
    </div>
  );
};

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,

    // Make it look good on smaller screens too
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
    const fetchHotCollections = async () => {
      try {
        const res = await axios.get(API_URL);
        setCollections(res.data);
        console.log("hotCollections response:", res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Hot Collections.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotCollections();
  }, []);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading && (
          <div className="col-lg-12">
            <Slider {...settings}>
              {Array.from({ length: 4 }).map((_, index) => (
              <HotCollectionSkeleton key={index} />
              ))}
            </Slider>
          </div>
          )}
          
          {error && <div className="col-lg-12 text-center">{error}</div>}

          {!loading && !error && (  
            <div className="col-lg-12">
              <Slider {...settings}>
                {collections.map((item) => (
                <div key={item.id}>  
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to={`/item-details/${item.id}`}>
                          <img
                            src={item.nftImage}
                            className="lazy img-fluid"
                            alt=""
                          />
                        </Link>
                      </div>

                      <div className="nft_coll_pp">
                        <Link to="/author/">
                          <img
                            className="lazy pp-coll"
                            src={item.authorImage}
                            alt=""
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>

                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{item.title}</h4>
                        </Link>
                        <span>{`ERC-${item.code}`}</span>
                      </div>
                    </div>
                  </div> 
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
