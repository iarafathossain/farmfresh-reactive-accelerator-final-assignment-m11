import { IReviewFronted } from "@/types";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import ReviewItem from "../common/ReviewItem";

interface ReviewsProps {
  reviews: IReviewFronted[];
}

const Reviews = ({ reviews }: ReviewsProps) => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real reviews from our satisfied customers about their FarmFresh
              experience
            </p>
          </div>
          <Link
            href="/reviews"
            className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 flex gap-1 items-center"
          >
            View All <FaArrowRight />
          </Link>
        </div>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No reviews available yet. Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
