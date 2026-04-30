"use client";

import { useCart } from "@/hooks/useCart";
import { useFavorite } from "@/hooks/useFavorite";
import { showToast } from "@/providers/ToastProvider";
import { IProductFrontend, IReview } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaBolt,
  FaHeart,
  FaMapMarkerAlt,
  FaMinus,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";
import Rating from "../common/Rating";
import WriteReview from "../common/WriteReview";
import Popup from "../ui/Popup";
import Tags from "../ui/Tags";

const ProductInfo = ({ product }: { product: IProductFrontend }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [stock, setStock] = useState<number>(product.stock - 1);
  const [showWriteReview, setShowWriteReview] = useState<boolean>(false);

  const session = useSession();
  const customerId = session?.data?.user?.id;

  const newReview: IReview = {
    customerId: customerId!,
    product: product.id,
    comment: "",
    rating: 0,
  };

  const { updateCart, loading } = useCart();
  const pending = loading[product.id] || false;

  const { favoriteList, updateFavorite } = useFavorite(product.name);

  const isFavorite = favoriteList?.includes(product.id);

  const handleIncrement = () => {
    if (product.stock > quantity) {
      setQuantity((prev) => prev + 1);
      setStock((prev) => prev - 1);
    } else {
      showToast("This product is stock out.", "WARNING");
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setStock((prev) => prev + 1);
    } else {
      showToast("Minimum quantity is one.", "WARNING");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Tags tags={product.features} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Produced by{" "}
          <span className="font-semibold text-primary-600 dark:text-primary-400">
            {`${product.farmer.firstName}'s Farm`}
          </span>
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Rating reviews={product.reviews} />
        {showWriteReview && (
          <Popup onClose={() => setShowWriteReview(false)}>
            <WriteReview
              mood="CREATE"
              review={newReview}
              onClose={() => setShowWriteReview(false)}
            />
          </Popup>
        )}
        <button
          onClick={() => setShowWriteReview(true)}
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Write a review
        </button>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              ৳{product.price}
            </span>
            <span className="text-lg text-gray-500 dark:text-gray-400">
              /{product.unit}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Available Stock
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {`${stock} ${product.unit}`}
            </p>
          </div>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
          <FaMapMarkerAlt className="mr-2" />
          <span>{product.farmer.farmDistrict}, Bangladesh</span>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantity ({product.unit})
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDecrement}
              className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaMinus className="text-sm" />
            </button>
            <input
              type="number"
              value={quantity}
              min="1"
              max="50"
              onChange={(e) => {
                const v = Number(e.target.value || 1);
                const clamped = Math.max(1, Math.min(50, isNaN(v) ? 1 : v));
                setQuantity(clamped);
                const avail = Math.max(0, product.stock - clamped);
                setStock(avail);
              }}
              className="w-20 text-center py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleIncrement}
              className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaPlus className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href={`/payment-process?productId=${product.id}&quantity=${quantity}`}
          className="w-full flex items-center justify-center gap-1 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FaBolt className="mr-2" />
          <span>Buy Now</span>
        </Link>
        <button
          disabled={pending}
          onClick={() => {
            updateCart("ADD_ITEM", product);
            showToast(`${product.name} has been added to cart.`, "SUCCESS");
          }}
          className="w-full disabled:cursor-not-allowed flex items-center justify-center gap-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium transition"
        >
          <FaShoppingCart className="mr-2" />
          <span>{pending ? "Adding..." : "Add to Cart"}</span>
        </button>
        <button
          onClick={() => updateFavorite(product.id)}
          className="w-full flex items-center justify-center gap-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium transition"
        >
          <FaHeart
            className={`text-xl ${
              isFavorite ? "text-red-500" : "text-gray-600 dark:text-gray-400"
            }`}
          />
          <span>Add to Favorite</span>
        </button>
      </div>
      <div className="block bg-primary-50 dark:bg-primary-900 rounded-xl p-4 group">
        <Link
          href={`/products/?farmerId=${product.farmer.id}`}
          className="flex items-center space-x-3"
        >
          <Image
            src={product.farmer.image!}
            alt={product.farmer.firstName}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:underline">
              {product.farmer.firstName} {product.farmer.lastName}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Farmer since {new Date(product.farmer.updatedAt!).getFullYear()}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductInfo;
