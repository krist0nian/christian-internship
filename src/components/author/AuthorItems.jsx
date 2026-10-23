import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const AuthorItemsSkeleton = () => (
  <div className="row" aria-label="Loading items" aria-busy="true">
    {Array.from({ length: 4 }).map((_, index) => (
      <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
        <div className="nft__item skeleton-card">
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-line skeleton-title" />
          <div className="skeleton skeleton-line skeleton-price" />
        </div>
      </div>
    ))}
  </div>
);

const AuthorItems = () => {
  const {authorId} = useParams();
  const [authorItems, setAuthorItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
        );

      const allItems = Array.isArray(response.data)
        ? response.data
        : response.data.data ?? response.data.items ?? [];

      const itemsForAuthor = allItems.filter(
        (item) => String(item.authorId) === String(authorId)
      );

      setAuthorItems(itemsForAuthor);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorItems();
  }, [authorId]);

  if (loading) {
  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <AuthorItemsSkeleton />
      </div>
    </div>
  );
}
  if (error) return <div>Couldn’t load author items: {error}</div>;

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {authorItems.map((item) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.id}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to={`/author/${item.authorId}`}>
                    <img className="lazy" src={item.authorImage} alt={item.authorName} />
                    <i className="fa fa-check"></i>
                  </Link>
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
                    <img
                      src={item.nftImage}
                      className="lazy nft__item_preview"
                      alt={item.title}
                    />
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
