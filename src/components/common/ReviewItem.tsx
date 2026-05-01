"use client";

import { doDeleteReviewById, doLike } from "@/actions/review";
import { showToast } from "@/providers/ToastProvider";
import { IReview, IReviewFronted } from "@/types";
import { catchErr } from "@/utils/catchErr";
import { getDateDiff } from "@/utils/getDateDiff";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaEdit,
  FaEllipsisV,
  FaStar,
  FaStarHalfAlt,
  FaThumbsUp,
  FaTrash,
} from "react-icons/fa";
import Popup from "../ui/Popup";
import UserInfo from "./UserInfo";
import WriteReview from "./WriteReview";

const ReviewItem = ({ review }: { review: IReviewFronted }) => {
  const [showCustomerInfo, setShowCustomerInfo] = useState<boolean>(false);
  const [showReviewAction, setShowReviewAction] = useState<boolean>(false);
  const [showUpdateReview, setShowUpdateReview] = useState<boolean>(false);
  const [showFullComment, setShowFullComment] = useState<boolean>(false);

  const session = useSession();
  const loggedInUserId = session?.data?.user?.id;

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const numberOfLikes = review.likes.filter((like) => like.isLike);
  const userHasLiked = numberOfLikes.some(
    (like) => like.customer && like.customer.toString() === loggedInUserId,
  );

  const reviewActionRef = useRef<HTMLDivElement>(null);

  const fullStars = Math.trunc(review.rating);
  const halfStar = review.rating % 1 >= 0.5;

  const isReviewOwner = review?.customer?.id === loggedInUserId;

  const existingReview: IReview = {
    id: review.id,
    customerId: review.customer.id,
    product: review.product,
    comment: review.comment,
    rating: review.rating,
  };

  const handleLikeToggle = async () => {
    setLoading(true);
    try {
      const response = await doLike(review.id, loggedInUserId!);
      if (!response.success) {
        showToast(response.message);
      } else {
        router.refresh();
      }
    } catch (error) {
      const errMsg = catchErr(error);
      showToast(errMsg.error, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    setLoading(true);
    try {
      const response = await doDeleteReviewById(review.id);
      if (!response.success) {
        showToast(response.message, "ERROR");
      }
      router.refresh();
    } catch (error) {
      const errMsg = catchErr(error);
      showToast(errMsg.error, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        reviewActionRef.current &&
        !reviewActionRef.current.contains(e.target as Node)
      ) {
        setShowReviewAction(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex items-start space-x-4 dark:bg-gray-800 bg-white p-4 rounded-lg">
      <div className="w-12 h-12 rounded-full relative">
        <Image
          src={review.customer.image!}
          alt={review.customer.firstName ?? review.customer.name}
          fill={true}
          className="w-full object-contain rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4
              onClick={() => setShowCustomerInfo(true)}
              className="font-semibold text-gray-900 dark:text-white hover:underline hover:cursor-pointer"
            >
              {review.customer.name ??
                `${review.customer.firstName} ${review.customer.lastName}`}
            </h4>
            {showCustomerInfo && (
              <Popup size="big" onClose={() => setShowCustomerInfo(false)}>
                <UserInfo user={review.customer} />
              </Popup>
            )}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400 text-sm">
                {[...Array(fullStars)].map((_, index) => (
                  <FaStar key={`full-${index}`} />
                ))}
                {halfStar && <FaStarHalfAlt key="half" />}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getDateDiff(review.updatedAt!)}
              </span>
            </div>
          </div>
          {isReviewOwner && (
            <div className="relative" ref={reviewActionRef}>
              <button
                onClick={() => setShowReviewAction((prev) => !prev)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaEllipsisV />
              </button>
              {showReviewAction && (
                <div className="absolute top-5 right-4 p-4 space-y-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow animate-fade-up">
                  <div
                    onClick={() => setShowUpdateReview(true)}
                    className="flex items-center gap-1 hover:text-primary-500 hover:cursor-pointer text-sm"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </div>
                  <div
                    onClick={handleDeleteReview}
                    className="flex items-center gap-1 hover:text-red-500 hover:cursor-pointer text-sm"
                  >
                    <FaTrash />
                    <span>{loading ? "Deleting..." : "Delete"}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {showUpdateReview && (
          <Popup onClose={() => setShowUpdateReview(false)}>
            <WriteReview
              mood="EDIT"
              review={existingReview}
              onClose={() => setShowUpdateReview(false)}
            />
          </Popup>
        )}
        <div className="text-gray-700 dark:text-gray-300 mb-2 relative">
          <p
            className={`text-justify ${showFullComment ? "" : "line-clamp-3"}`}
          >
            {review.comment}
          </p>
          <span
            className="text-primary-500 text-xs hover:underline cursor-pointer bg-white dark:bg-gray-800 px-1 absolute -bottom-4 right-0"
            onClick={() => setShowFullComment(!showFullComment)}
          >
            {showFullComment ? "Show less" : "Show more"}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-3">
          <button
            onClick={handleLikeToggle}
            type="button"
            disabled={loading}
            className={`flex items-center disabled:cursor-not-allowed ${
              userHasLiked
                ? "text-primary-500"
                : "text-gray-500 dark:text-gray-400"
            } hover:text-primary-600 dark:hover:text-primary-400`}
          >
            <FaThumbsUp className="mr-1" /> Helpful ({numberOfLikes.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
