import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers";

const TopSellerSkeleton = () => {
  return (
    <li className="top-seller-skeleton" aria-hidden="true">
      <div className="skeleton skeleton-avatar"></div>

      <div className="skeleton-seller-info">
        <div className="skeleton skeleton-name"></div>
        <div className="skeleton skeleton-price"></div>
      </div>
    </li>
  );
};

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const response = await axios.get(API_URL);

        const sellerData = Array.isArray(response.data)
          ? response.data
          : response.data.sellers || response.data.data || [];

        setSellers(sellerData);
       } catch (err) {
        console.error("Failed to fetch top sellers:", err);
        setError("Failed to load top sellers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-md-12">
            {loading ? (
              <ol className="author_list" aria-label="Loading top sellers">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TopSellerSkeleton key={index} />
                ))}
              </ol>
            ) : error ? (
              <p className="text-center text-danger">{error}</p>
            ) :  sellers.length === 0 ? (
              <p className="text-center">No top sellers found.</p>
            ) : (
            <ol className="author_list">
              {sellers.map((seller) => {

                  return (
              
                <li key={seller.id}>
                  <div className="author_list_pp">
                    <Link to="/author">
                      <img
                        className="lazy pp-author"
                        src={seller.authorImage}
                        alt={seller.authorName}
                      />

                      {seller.verified && (
                      <i className="fa fa-check"></i>
                      )}
                    </Link>
                  </div>

                  <div className="author_list_info">
                    <Link to="/author">{seller.authorName}</Link>
                    <span> {seller.price} ETH</span>
                  </div>
                </li>
              );
            })}
            </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
