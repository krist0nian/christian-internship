import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";
import axios from "axios";

const ItemDetailsSkeleton = () => (
  <div id="wrapper">
    <div className="no-bottom no-top" id="content">
      <div id="top" />
      <section aria-label="Loading item details" className="mt90 sm-mt-0">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center">
              <div className="skeleton skeleton-image img-rounded mb-sm-30" />
            </div>

            <div className="col-md-6">
              <div className="item_info">
                <div className="skeleton skeleton-title" />

                <div className="item_info_counts">
                  <div className="item_info_views">
                    <div className="skeleton skeleton-count" />
                  </div>
                  <div className="item_info_like">
                    <div className="skeleton skeleton-count" />
                  </div>
                </div>

                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line skeleton-line-short" />

                <div className="d-flex flex-row">
                  <div className="mr40">
                    <div className="skeleton skeleton-label" />
                    <div className="item_author">
                      <div className="author_list_pp">
                        <div className="skeleton skeleton-avatar" />
                      </div>
                      <div className="author_list_info">
                        <div className="skeleton skeleton-name" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="de_tab tab_simple">
                  <div className="de_tab_content">
                    <div className="skeleton skeleton-label" />
                    <div className="item_author">
                      <div className="author_list_pp">
                        <div className="skeleton skeleton-avatar" />
                      </div>
                      <div className="author_list_info">
                        <div className="skeleton skeleton-name" />
                      </div>
                    </div>
                  </div>

                  <div className="spacer-40" />
                  <div className="skeleton skeleton-label" />
                  <div className="nft-item-price">
                    <div className="skeleton skeleton-price-icon" />
                    <div className="skeleton skeleton-price" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

const ItemDetails = () => {

  const { nftId } = useParams(); //Get ID from URL
  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // API Fetch for Item Data
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`);
        setItemData(response.data);
        console.log("Item details:", response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [nftId]);

  if (loading) return <ItemDetailsSkeleton />;
  if (!itemData) return <p>Couldn’t load this item.</p>;


  //Actual Content State
  if (!itemData) return null; // Prevents crashes if itemData is null

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={itemData.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  data-aos="fade-in" data-aos-duration="2200"
                  alt=""
                />
              </div>
              <div data-aos="fade-left" data-aos-duration="2000" className="col-md-6">
                <div className="item_info">
                  <h2>{itemData.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {itemData.views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {itemData.likes}
                    </div>
                  </div>
                  <p>
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
                    illo inventore veritatis et quasi architecto beatae vitae
                    dicta sunt explicabo.
                  </p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${itemData.ownerId}`}>
                            <img className="lazy" src={itemData.ownerImage} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${itemData.ownerId}`}>{itemData.ownerName}</Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${itemData.creatorId}`}>
                            <img className="lazy" src={itemData.creatorImage} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${itemData.creatorId}`}>{itemData.creatorName}</Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{itemData.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
