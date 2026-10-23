import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const AuthorSkeleton = () => (
  <div id="wrapper" aria-label="Loading author profile" aria-busy="true">
    <div className="no-bottom no-top" id="content">
      <section id="profile_banner" className="skeleton skeleton-banner" />

      <section>
        <div className="container">
          <div className="profile_avatar">
            <div className="skeleton skeleton-profile-avatar" />
            <div className="profile_name">
              <div className="skeleton skeleton-line skeleton-name" />
              <div className="skeleton skeleton-line skeleton-detail" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );

        // The API response you showed is an author object.
        // This also handles an API response wrapped in a "data" property.
        const authorData = response.data?.data ?? response.data;

        setAuthor(authorData);
      } catch (err) {
        setError("Couldn’t load this author’s profile.");
        console.error("Failed to fetch author:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [authorId]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    if (isFollowing) {
      setAuthor((prevAuthor) => ({
        ...prevAuthor,
        followers: prevAuthor.followers - 1,
      }));
    } else {
      setAuthor((prevAuthor) => ({
        ...prevAuthor,
        followers: prevAuthor.followers + 1,
      }));
    }
  }

  if (loading) return <AuthorSkeleton />;
  if (error) return <div>{error}</div>;
  if (!author) return <div>Author not found.</div>;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={author.authorImage} alt={author.authorName} />

                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {author.authorName}
                          <span className="profile_username">@{author.tag}</span>
                          <span id="wallet" className="profile_wallet">
                            {author.address}
                          </span>
                          <button id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">{author.followers} followers</div>
                      <button className="btn-main" onClick={handleFollowToggle}>
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
