import { TOrderStatus } from "@/types";

export const getStatusLabel = (status: TOrderStatus) => {
  switch (status) {
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Canceled";
    default:
      return "Pending";
  }
};
