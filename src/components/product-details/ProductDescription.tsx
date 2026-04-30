"use client";

import { IReviewFronted, TBaseUser } from "@/types";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import ReviewItem from "../common/ReviewItem";
import UserInfo from "../common/UserInfo";
import Divider from "../ui/Divider";

const ProductDescription = ({
  description,
  farmer,
  reviews,
  loggedInUserReview,
  productId,
}: {
  description: string;
  farmer: TBaseUser;
  reviews: IReviewFronted[];
  loggedInUserReview: IReviewFronted;
  productId: string;
}) => {
  const [showMore, setShowMore] = useState<number>(0);
  const [tab, setTab] = useState({
    isDescription: true,
    isReview: false,
    isFarmer: false,
  });

  const session = useSession();
  const userId = session?.data?.user?.id;

  const loggedInUserReviews = reviews.filter(
    (review) => review.customer.id === userId,
  );

  const totalReviews = reviews.length;

  const otherReviews = reviews.filter(
    (review) => review.product === productId && review.customer.id !== userId,
  );
  const reviewsToShow = otherReviews.slice(0, showMore + 3);

  useEffect(() => {
    if (loggedInUserReview) {
      setShowMore(1);
    }
  }, [loggedInUserReview]);

  return (
    <div className="mt-16">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() =>
              setTab((prev) => ({
                ...prev,
                isDescription: true,
                isFarmer: false,
                isReview: false,
              }))
            }
            className={`${
              tab.isDescription
                ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            } py-4 px-1 text-sm font-medium`}
          >
            Description
          </button>
          <button
            onClick={() =>
              setTab((prev) => ({
                ...prev,
                isReview: true,
                isDescription: false,
                isFarmer: false,
              }))
            }
            className={`${
              tab.isReview
                ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            } py-4 px-1 text-sm font-medium`}
          >
            Review{totalReviews > 1 ? "s" : ""} ( {totalReviews} )
          </button>
          <button
            onClick={() =>
              setTab((prev) => ({
                ...prev,
                isFarmer: true,
                isDescription: false,
                isReview: false,
              }))
            }
            className={`${
              tab.isFarmer
                ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            } py-4 px-1 text-sm font-medium`}
          >
            Farmer Info
          </button>
        </nav>
      </div>

      {tab.isDescription && (
        <div className="py-8 px-4 w-full max-w-3xl rounded-lg rounded-t-none dark:bg-gray-800 bg-white shadow">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h3>About This Product</h3>
            <p>{description}</p>
          </div>
        </div>
      )}

      {tab.isReview && (
        <div className="py-4 w-full max-w-3xl rounded-lg rounded-t-none dark:bg-gray-800 bg-white shadow">
          {reviews?.length === 0 ? (
            <p className="text-sm text-gray-400 p-4">No Reviews.</p>
          ) : (
            <>
              {loggedInUserReviews.map((review, index) => (
                <Fragment key={review.id}>
                  <ReviewItem key={review.id} review={review} />
                  {index < reviews?.length - 1 && <Divider />}
                </Fragment>
              ))}
              {reviewsToShow.map((review, index) => (
                <Fragment key={review.id}>
                  <ReviewItem key={review.id} review={review} />
                  {index < reviewsToShow?.length - 1 && <Divider />}
                </Fragment>
              ))}
              {otherReviews.length > reviewsToShow.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowMore((prev) => prev + 5)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Load More Reviews
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab.isFarmer && (
        <div className="px-4 py-8 w-full max-w-3xl rounded-lg rounded-t-none dark:bg-gray-800 bg-white shadow">
          <UserInfo user={farmer} />
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
