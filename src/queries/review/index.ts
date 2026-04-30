import { connectDB } from "@/libs/connectDB";
import { Review } from "@/models/reviewModel";
import { IReviewDB, IReviewFronted } from "@/types";
import { transformMongoDoc } from "@/utils/transformMongoDoc";

// Get reviews
export const getReviewsByProductId = async (productId: string) => {
  await connectDB();

  const reviews = await Review.find({ product: productId })
    .populate("customer")
    .limit(5)
    .lean<IReviewFronted[]>();

  return transformMongoDoc(reviews);
};

// Get orders by product id
export const getSingleReviewByProductIdAndCustomerId = async (
  customerId: string,
  productId: string,
) => {
  await connectDB();

  const review = await Review.findOne({
    customer: customerId,
    product: productId,
  })
    .populate("customer")
    .lean<IReviewFronted>();

  return transformMongoDoc(review);
};

// Get Review by id
export const getReviewById = async (reviewId: string) => {
  const review = await Review.findById(reviewId).lean<IReviewDB>();

  return transformMongoDoc(review);
};

// Get all reviews for homepage
export const getAllReviews = async () => {
  await connectDB();

  const reviews = await Review.find({})
    .populate("customer")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean<IReviewFronted[]>();

  return transformMongoDoc(reviews);
};
