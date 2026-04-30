import LoadMore from "@/components/common/LoadMore";
import PageHeader from "@/components/common/page-header";
import ReviewItem from "@/components/common/ReviewItem";
import FarmersStats from "@/components/farmers/FarmersStats";
import { getAllReviews } from "@/queries/review";

const ReviewsPage = async () => {
  const reviews = await getAllReviews();
  return (
    <>
      <PageHeader
        title="Customer Reviews"
        subtitle="Discover what our customers are saying about our fresh, organic produce and exceptional service. Read their honest feedback and experiences with our farm-to-table offerings."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FarmersStats />
        {reviews && reviews.length === 0 ? (
          <p className="text-xs font-semibold text-gray-400 text-center">
            No reviews listed yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}

        <LoadMore />
      </div>
    </>
  );
};

export default ReviewsPage;
