"use client";

import { doToggleProductActive } from "@/actions/product";
import { useCart } from "@/hooks/useCart";
import { useCatchErr } from "@/hooks/useCatchErr";
import { useFavorite } from "@/hooks/useFavorite";
import { showToast } from "@/providers/ToastProvider";
import { IProductFrontend } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEdit, FaEyeSlash } from "react-icons/fa";
import {
  FaEye,
  FaHeart,
  FaMinus,
  FaPlus,
  FaStar,
  FaTrash,
} from "react-icons/fa6";
import DeleteProduct from "../manage-products/DeleteProduct";
import Popup from "../ui/Popup";
import ProductImageCarousel from "../ui/ProductImageCarousel";

const ProductCard = ({
  isManageListingPage = false,
  product,
  viewType,
}: {
  isManageListingPage?: boolean;
  product: IProductFrontend;
  viewType?: "GRID" | "LIST";
}) => {
  const { cart, updateCart, loading } = useCart();
  const { favoriteList, updateFavorite } = useFavorite(product.name);
  const [activeProgress, setActiveProgress] = useState<boolean>(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);

  const averageRating =
    product.reviews.length > 0 &&
    product.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
      product.reviews.length;

  const cartItem = cart?.items?.find(
    (item) => item?.product?.id === product.id,
  );
  const remainingStock = product.stock - (cartItem?.quantity ?? 1);

  const router = useRouter();

  const { err, catchErr } = useCatchErr();

  const isInCart = cart?.items?.some(
    (item) => item?.product?.id === product.id,
  );

  const isFavorite = favoriteList?.includes(product.id);

  const pending = loading[product.id] || false;

  const handleToggleActive = async (productId: string) => {
    setActiveProgress(true);
    try {
      const response = await doToggleProductActive(productId);
      if (!response.success) {
        showToast(response.error, "ERROR");
        setActiveProgress(false);
      } else {
        showToast(response.message, "SUCCESS");
        setActiveProgress(false);
        router.refresh();
      }
    } catch (error) {
      catchErr(error);
      if (err) {
        showToast(err, "ERROR");
      } else {
        showToast(
          `${product.name} failed to ${
            product.isActive ? "inactive" : "active"
          }`,
        );
      }
    }
    setActiveProgress(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (productId) {
      setShowConfirmPopup(true);
    }
  };

  return (
    <form
      className={`bg-white dark:bg-gray-800 group rounded-2xl hover:shadow-lg hover:shadow-green-300 overflow-hidden transition-all duration-300 relative 
      ${
        viewType === "LIST"
          ? "flex flex-col sm:flex-row items-center gap-4 p-4"
          : ""
      }`}
    >
      {/* === IMAGE SECTION === */}
      <div
        className={`relative overflow-hidden ${
          viewType === "LIST" ? "w-full sm:w-1/3 h-52" : "w-full"
        }`}
      >
        {product?.imagesUrl?.length > 0 && (
          <ProductImageCarousel
            images={product.imagesUrl}
            productId={product.id}
          />
        )}

        <>
          <div className="absolute top-3 left-3">
            {product?.features?.length > 0 && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {product.features[0]}
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <button
              onClick={() => updateFavorite(product.id)}
              type="button"
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FaHeart
                className={`text-xl ${
                  isFavorite
                    ? "text-red-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
            </button>
          </div>
        </>
      </div>

      {/* === DETAILS SECTION === */}
      <div
        className={`p-6 w-full ${
          viewType === "LIST" ? "sm:w-2/3 flex flex-col justify-between" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <Link href={`/products/${product.id}`}>
            <h3
              className={`font-semibold text-gray-900 dark:text-white ${
                product.isActive && "group-hover:underline"
              }`}
            >
              {product?.name}
            </h3>
          </Link>
          {averageRating && averageRating > 0 && (
            <div className="flex items-center text-yellow-400">
              <FaStar className="text-sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                {averageRating > 0 && averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          By {product?.farmer?.firstName}&apos;s Farm •{" "}
          {product?.farmer?.farmDistrict}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ৳
              {Math.round(
                product?.price - (product?.discountRate / 100) * product.price,
              )}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              /{product?.unit}
            </span>
            <br />
            {product.discountRate > 0 ? (
              <span className="text-red-400 line-through ml-1">
                ৳{Math.round(product?.price).toLocaleString()}
              </span>
            ) : (
              <span className="text-transparent select-none">no discount</span>
            )}
          </div>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Stock:{" "}
            {`${
              isInCart
                ? remainingStock.toFixed(0)
                : (remainingStock + 1).toFixed()
            } ${product?.unit}`}
          </span>
        </div>

        {/* === BUTTON SECTION === */}
        {isManageListingPage ? (
          <div className="flex space-x-2">
            <Link
              href={`/products/edit/${product.id}`}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition text-sm"
            >
              <div className="w-full flex items-center justify-center gap-1">
                <FaEdit className="mr-1 text-xl" />
                <span>Edit</span>
              </div>
            </Link>
            <button
              disabled={activeProgress}
              type="button"
              onClick={() => handleToggleActive(product.id)}
              className="px-4 disabled:cursor-not-allowed py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {product.isActive ? <FaEyeSlash /> : <FaEye />}
            </button>
            <button
              type="button"
              onClick={() => handleDeleteProduct(product.id)}
              className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
            >
              <FaTrash />
            </button>
            {showConfirmPopup && (
              <Popup onClose={() => setShowConfirmPopup(false)}>
                <DeleteProduct
                  productId={product.id}
                  productName={product.name}
                  productImage={product.imagesUrl}
                  onCancel={() => setShowConfirmPopup(false)}
                />
              </Popup>
            )}
          </div>
        ) : isInCart ? (
          <div className="bg-white rounded-lg flex flex-col">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-primary-500">
              <div className="font-semibold py-1 px-2 rounded-lg rounded-r-none border-r border-primary-500">
                {cartItem?.quantity ?? 1} {product.unit}
              </div>
              <div className="flex items-center justify-center gap-4 flex-grow">
                <button
                  disabled={pending}
                  type="button"
                  onClick={() => {
                    if (remainingStock > 0) {
                      updateCart("INCREMENT", product.id);
                    } else {
                      showToast("Not enough stock", "WARNING");
                    }
                  }}
                  className="disabled:cursor-wait"
                >
                  <FaPlus className="text-xl hover:text-primary-500 duration-200 cursor-pointer" />
                </button>
                <button
                  disabled={pending}
                  type="button"
                  onClick={() => {
                    if ((cartItem?.quantity ?? 1) > 1) {
                      updateCart("DECREMENT", product.id);
                    } else {
                      showToast("Minimum quantity is 1", "WARNING");
                    }
                  }}
                  className="disabled:cursor-wait"
                >
                  <FaMinus className="text-xl hover:text-primary-500 duration-200 cursor-pointer" />
                </button>
              </div>
              <button
                disabled={pending}
                type="button"
                onClick={() => updateCart("REMOVE_ITEM", product.id)}
                className="py-1 px-2 border-l border-primary-500"
              >
                Remove
              </button>
            </div>
            <Link
              className="bg-primary-500 px-4 py-1 text-white text-xl font-semibold text-center rounded-lg rounded-t-none"
              href="/cart"
            >
              Go to cart
            </Link>
          </div>
        ) : (
          <button
            disabled={pending}
            type="button"
            onClick={() => {
              if (remainingStock > 0) {
                updateCart("ADD_ITEM", product);
              } else {
                showToast("This product is out of stock.", "WARNING");
              }
            }}
            className={`w-full text-white py-3 bg-primary-600 hover:bg-primary-700 hover:scale-105 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center disabled:cursor-wait ${
              viewType === "LIST" ? "sm:w-1/2 mt-auto" : ""
            }`}
          >
            {pending ? "Adding.." : "Add to cart"}
          </button>
        )}
      </div>

      {/* Overlay for inactive products */}
      {!isManageListingPage && !product.isActive && (
        <div className="w-full h-full absolute inset-0 bg-gray-500 bg-opacity-60">
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-semibold bg-gray-400 p-2 text-gray-700 rounded-lg">
              Inactive now
            </span>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProductCard;
