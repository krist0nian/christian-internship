import React from "react";

const Skeleton = () => {

  return (
  <section aria-label="Loading item details" className="mt90 sm-mt-0">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center">
            <div className="skeleton-box skeleton-image"></div>
          </div>

          <div className="col-md-6">
            <div className="item_info">
              <div className="skeleton-box skeleton-title"></div>

              <div className="item_info_counts">
                <div className="skeleton-box skeleton-count"></div>
                <div className="skeleton-box skeleton-count"></div>
              </div>

              <div className="skeleton-box skeleton-text"></div>
              <div className="skeleton-box skeleton-text skeleton-text-short"></div>

              <div className="d-flex flex-row mt-4">
                <div className="mr40">
                  <div className="skeleton-box skeleton-label"></div>

                  <div className="item_author">
                    <div className="skeleton-box skeleton-avatar"></div>
                    <div className="skeleton-box skeleton-author-name"></div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="skeleton-box skeleton-label"></div>

                <div className="item_author">
                  <div className="skeleton-box skeleton-avatar"></div>
                  <div className="skeleton-box skeleton-author-name"></div>
                </div>
              </div>

              <div className="mt-4">
                <div className="skeleton-box skeleton-label"></div>
                <div className="skeleton-box skeleton-price"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skeleton;
