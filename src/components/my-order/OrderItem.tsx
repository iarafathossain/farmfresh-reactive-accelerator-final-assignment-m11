"use client";

import { useBalance } from "@/hooks/useBalance";
import { IOrderFronted, IReview } from "@/types";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { getStatusLabel } from "@/utils/getStatusLabel";
import { getStatusStyles } from "@/utils/getStatusStyles";
import Image from "next/image";
import { useState } from "react";
import UserInfo from "../common/UserInfo";
import WriteReview from "../common/WriteReview";
import { getStatusIcon } from "../ui/getStatusIcon";
import Popup from "../ui/Popup";
import CustomerActionOnOrder from "./CustomerActionOnOrder";
import OrderStatus from "./OrderStatus";
import OrderSummary from "./OrderSummary";
import UpdateOrderStatus from "./UpdateOrderStatus";

interface OrderItemProps {
  order: IOrderFronted;
  role: string | "Customer" | "Farmer";
}

const OrderItem = ({ order, role }: OrderItemProps) => {
  const [showFarmer, setShowFarmer] = useState<boolean>(false);
  const [showSummery, setShowSummary] = useState<boolean>(false);
  const [showCustomer, setShowCustomer] = useState<boolean>(false);
  const [writeReview, setWriteReview] = useState<{
    showPopup: boolean;
    productId: string;
  }>({ showPopup: false, productId: "" });

  const addNewReview: IReview = {
    customerId: order.customer.id,
    product: writeReview.productId,
    comment: "",
    rating: 0,
  };

  const { total } = useBalance(order?.items);

  const orderIdColor =
    order.status === "DELIVERED"
      ? "text-primary-500"
      : order.status === "CANCELLED"
        ? "text-red-500"
        : "text-yellow-500";

  // ===== Update Status Buttons =====
  const renderUpdateButtons = () => {
    if (role !== "Farmer" && ["PLACED", "CANCELLED"].includes(order.status)) {
      return (
        <UpdateOrderStatus
          orderId={order.id}
          currentStatus={order.status}
          role="Customer"
        />
      );
    }

    if (role === "Farmer" && order.status !== "CANCELLED") {
      return (
        <UpdateOrderStatus
          orderId={order.id}
          currentStatus={order.status}
          role="Farmer"
        />
      );
    }

    if (role === "Farmer" && order.status === "CANCELLED") {
      return (
        <p className="text-sm text-red-500 mt-2">
          This order was canceled by{" "}
          <strong>
            {order.customer.firstName ?? order.customer.name}{" "}
            {order.customer.lastName ?? ""}
          </strong>
          .
        </p>
      );
    }

    return null;
  };

  // ===== Main Render =====
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-transparent">
        <div className="p-6 group relative">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div>
                <h3
                  onClick={() => setShowSummary(true)}
                  className={`text-lg font-semibold group-hover:underline hover:cursor-pointer ${orderIdColor}`}
                >
                  Order #{order.id}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Placed on {getFormattedDate(new Date(order.createdAt))} by
                </p>
                {role === "Farmer" && (
                  <div className="flex items-center gap-1">
                    <Image
                      src={order.customer.image!}
                      alt="Customer-Image"
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-fill"
                    />
                    <p
                      onClick={() => setShowCustomer(true)}
                      className="text-sm font-semibold hover:underline hover:cursor-pointer"
                    >{`${order.customer.firstName ?? order.customer.name} ${
                      order.customer.lastName ?? ""
                    }`}</p>
                    {showCustomer && (
                      <Popup size="big" onClose={() => setShowCustomer(false)}>
                        <UserInfo user={order.customer} />
                      </Popup>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                  order.status,
                )}`}
              >
                {getStatusIcon(order.status)}
                {getStatusLabel(order.status)}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ৳{total}
              </span>
            </div>
          </div>

          {/* Order Items */}
          {order?.items?.length > 0 &&
            order.items.map((item, index) => {
              const { product, quantity } = item;
              const finalPrice = (
                product?.price *
                quantity *
                (1 - (product?.discountRate ?? 0) / 100)
              ).toFixed(2);

              return (
                <div
                  key={product?.id}
                  className="border-t border-gray-200 dark:border-gray-600 pt-4"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-lg relative">
                      <Image
                        src={product?.imagesUrl?.[0]?.url || "/placeholder.jpg"}
                        alt={product?.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        fill={true}
                        objectFit="contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {product?.name}
                      </h4>
                      <p
                        onClick={() => setShowFarmer(true)}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:underline duration-150 hover:cursor-pointer"
                      >
                        By {product?.farmer?.farmName}&apos;s Farm
                      </p>
                      {showFarmer && (
                        <Popup size="big" onClose={() => setShowFarmer(false)}>
                          <UserInfo user={item.product.farmer} />
                        </Popup>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {quantity} {product?.unit} • ৳{product?.price}
                        /{product?.unit}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white text-right">
                      ৳{finalPrice}
                    </p>
                  </div>
                  {order?.items?.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setWriteReview({
                            productId: order.items[index].product.id,
                            showPopup: true,
                          })
                        }
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Write a review
                      </button>
                      {writeReview.showPopup && (
                        <Popup
                          onClose={() =>
                            setWriteReview((prev) => ({
                              ...prev,
                              showPopup: false,
                            }))
                          }
                        >
                          <WriteReview
                            onClose={() => setShowCustomer(false)}
                            review={addNewReview}
                            mood="CREATE"
                          />
                        </Popup>
                      )}
                    </>
                  )}
                </div>
              );
            })}

          {/* Status Section */}
          <div
            className={`${
              order?.items?.length > 1
                ? "border-t border-gray-200 dark:border-gray-600 pt-4"
                : ""
            }`}
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Order Status
            </h4>
            <OrderStatus status={order?.status} />
          </div>

          {/* Actions */}
          {role === "Customer" && <CustomerActionOnOrder order={order} />}
          {renderUpdateButtons()}
        </div>
      </div>

      {/* Order Summary Modal */}
      {showSummery && (
        <Popup onClose={() => setShowSummary(false)}>
          <OrderSummary items={order?.items} id={order?.id} />
        </Popup>
      )}
    </>
  );
};

export default OrderItem;
