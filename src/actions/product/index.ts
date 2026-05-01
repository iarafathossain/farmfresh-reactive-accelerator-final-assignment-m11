"use server";

import { connectDB } from "@/libs/connectDB";
import { deleteCloudinaryImage } from "@/libs/deleteCloudinaryImage";
import { Order } from "@/models/orderModel";
import { Product } from "@/models/productModel";
import { getOrderById } from "@/queries/order";
import { createProduct, getProduct } from "@/queries/product";
import { getUserByEmail } from "@/queries/user";
import { uploadImage } from "@/services/UploadImag";
import {
  IProductBase,
  IProductForm,
  IProductFrontend,
  TActionResponse,
  TOrderStatus,
  TPaymentData,
} from "@/types";
import { catchErr } from "@/utils/catchErr";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { getUserSession } from "@/utils/getUserSession";
import { transformMongoDoc } from "@/utils/transformMongoDoc";
import { validateAddProductForm } from "@/validations/validateAddProductForm";
import mongoose from "mongoose";

// ===== Add Product ===== //
export const doAddingProduct = async (
  formData: FormData
): Promise<TActionResponse> => {
  await connectDB();
  try {
    // Only allow if the role is Farmer
    const session = await getUserSession();
    if (session?.role !== "Farmer") {
      throw new Error("Only farmer can add product.");
    }

    const formValues: IProductForm<File[]> = {
      name: (formData.get("name") as string) ?? "",
      category: (formData.get("category") as string) ?? "",
      description: (formData.get("description") as string) ?? "",
      harvestDate: (formData.get("harvestDate") as string) ?? "",
      images:
        (formData.getAll("images") as File[]).filter(
          (file) => file instanceof File && file.size > 0
        ) ?? [],
      price: Number(formData.get("price")) || 0,
      discountRate: Number(formData.get("discountRate")) || 0,
      features: formData.getAll("features") as string[],
      stock: Number(formData.get("stock") || 0),
      unit: (formData.get("unit") as string) ?? "",
      deliveryMethod:
        (formData.get("deliveryMethod") as
          | "same_day_delivery"
          | "regular_delivery"
          | "") ?? "",
      baseDeliveryFee: Number(formData.get("baseDeliveryFee")) || 0,
      perUnitDeliveryFee: Number(formData.get("perUnitDeliveryFee")) || 0,
      serviceFee: Number(formData.get("serviceFee")) || 0,
      isActive: true,
    };

    // run validation
    const validationErrors = validateAddProductForm(formValues);
    if (
      validationErrors &&
      Object.values(validationErrors).some((field) => field)
    ) {
      throw new Error(Object.values(validationErrors)[0]!);
    }

    const {
      name,
      category,
      description,
      harvestDate,
      images,
      price,
      features,
      stock,
      unit,
      discountRate,
      baseDeliveryFee,
      deliveryMethod,
      perUnitDeliveryFee,
      serviceFee,
      isActive,
    } = formValues;

    // upload product's images
    const uploadResult = await Promise.all(
      images.map((file) => uploadImage(file, "product"))
    );
    const uploaded = uploadResult.filter((r) => r.success);
    const failed = uploadResult.filter((r) => !r.success);

    if (failed.length > 0) {
      throw new Error(failed[0].error);
    }

    const imagesUrl = uploaded.map((r) => ({
      url: r.secure_url,
      public_id: r.public_id,
    }));

    const payload: Omit<IProductBase, "id"> = {
      name,
      category,
      description,
      harvestDate,
      imagesUrl,
      price,
      features,
      stock,
      unit,
      discountRate,
      baseDeliveryFee,
      deliveryMethod,
      perUnitDeliveryFee,
      serviceFee,
      isActive,
    };

    if (session?.id) {
      payload.farmer = new mongoose.Types.ObjectId(session.id);
    }

    const createdProduct: Omit<IProductBase, "id"> = await createProduct(
      payload
    );

    return {
      success: true,
      message: `${createdProduct.name} has been added successfully.`,
    };
  } catch (err) {
    const errMsg = catchErr(err, "Failed to Add product!");
    return { success: errMsg.success, error: errMsg.error };
  }
};

// ===== Edit Product ===== //
export const doEditingProduct = async (
  formData: FormData,
  editProductId: string
): Promise<TActionResponse> => {
  await connectDB();
  try {
    const user = await getUserSession();
    const userId = user?.id;
    const product = await getProduct(editProductId);

    if (!product) {
      throw new Error("This product does not exist.");
    }

    if (userId !== product.farmer.id) {
      throw new Error("You are not allowed to edit this product.");
    }

    const parseIsActive: boolean =
      formData.get("isActive") === "true" ? true : false;

    const formValues: IProductForm<File[]> = {
      name: (formData.get("name") as string) ?? "",
      category: (formData.get("category") as string) ?? "",
      description: (formData.get("description") as string) ?? "",
      harvestDate: (formData.get("harvestDate") as string) ?? "",
      images:
        (formData.getAll("images") as File[]).filter(
          (file) => file instanceof File && file.size > 0
        ) ?? [],
      price: Number(formData.get("price")) || 0,
      discountRate: Number(formData.get("discountRate")) || 0,
      features: formData.getAll("features") as string[],
      stock: Number(formData.get("stock") || 0),
      unit: (formData.get("unit") as string) ?? "",
      deliveryMethod: formData.get("deliveryMethod") as "",
      baseDeliveryFee: Number(formData.get("baseDeliveryFee")) || 0,
      perUnitDeliveryFee: Number(formData.get("perUnitDeliveryFee")) || 0,
      serviceFee: Number(formData.get("serviceFee")) || 0,
      isActive: parseIsActive,
    };

    // run validation
    const validationErrors = validateAddProductForm(formValues);
    if (
      validationErrors &&
      Object.values(validationErrors).some((field) => field)
    ) {
      throw new Error(Object.values(validationErrors)[0]!);
    }

    const originalProductData: Omit<
      IProductForm<File[]>,
      "isActive" | "images"
    > = {
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      harvestDate: product.harvestDate,
      discountRate: product.discountRate,
      features: product.features,
      stock: product.stock,
      unit: product.unit,
      deliveryMethod: product.deliveryMethod,
      baseDeliveryFee: product.baseDeliveryFee,
      perUnitDeliveryFee: product.perUnitDeliveryFee,
      serviceFee: product.serviceFee,
    };

    const productDataForUpdate: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(formValues)) {
      if (key === "features" && Array.isArray(value)) {
        const originalFeatures = originalProductData.features ?? [];
        if (
          value.length !== originalFeatures.length ||
          !value.every((v, i) => v === originalFeatures[i])
        ) {
          productDataForUpdate["features"] = value;
        }
      } else if (key === "images" && Array.isArray(value)) {
        if (value.some((file) => file instanceof File)) {
          productDataForUpdate["images"] = value;
        }
      } else if (key !== "images" && key !== "features") {
        if (
          value !== originalProductData[key as keyof typeof originalProductData]
        ) {
          productDataForUpdate[key] = value;
        }
      }
    }

    if (Object.keys(productDataForUpdate).includes("isActive")) {
      delete productDataForUpdate["isActive"];
    }

    if (
      !productDataForUpdate ||
      Object.keys(productDataForUpdate).length === 0
    ) {
      throw new Error("No change made to update this product.");
    }

    // upload updated image
    let imagesUrl: { url: string; public_id: string }[] = [];

    if (
      Array.isArray(productDataForUpdate.images) &&
      productDataForUpdate.images.length > 0
    ) {
      const images = productDataForUpdate.images as File[];

      const uploadResult = await Promise.all(
        images.map((file) => uploadImage(file, "product"))
      );

      const uploaded = uploadResult.filter((r) => r.success);
      const failed = uploadResult.filter((r) => !r.success);

      if (failed.length > 0) {
        throw new Error(failed[0].error);
      }

      imagesUrl = uploaded.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
      }));
      if (imagesUrl.length > 0) {
        productDataForUpdate["imagesUrl"] = [
          ...product.imagesUrl,
          ...imagesUrl,
        ];
      }

      // remove raw File objects before DB update
      delete productDataForUpdate.images;
    }

    const updatedProductWithMetaData = await Product.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(editProductId) },
      productDataForUpdate,
      { new: true }
    ).lean<IProductBase>();

    const updatedProductWithoutMetaData = transformMongoDoc(
      updatedProductWithMetaData
    );

    if (!updatedProductWithoutMetaData) {
      throw new Error(`${product.name} failed to update.`);
    }

    return {
      success: true,
      data: updatedProductWithoutMetaData!,
      message: `${updatedProductWithoutMetaData.name} has been updated successfully.`,
    };
  } catch (error) {
    const errMsg = catchErr(error, "Failed to Edit product!");
    return { success: errMsg.success, error: errMsg.error };
  }
};

// ===== Delete Product's image ===== //
export const doDeletingProductImage = async (
  public_id: string,
  productId: string
): Promise<TActionResponse> => {
  await connectDB();
  try {
    const response = await deleteCloudinaryImage(public_id);

    if (response && response.result !== "ok") {
      throw new Error("This image does not exist");
    }

    const product = await getProduct(productId);

    if (!product) {
      throw new Error("This image does not exist");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(productId) },
      {
        imagesUrl: product.imagesUrl.filter((id) => id.public_id !== public_id),
      },
      { new: true }
    ).lean<IProductFrontend>();

    return {
      success: true,
      message: "This image has been deleted successfully.",
      data: transformMongoDoc(updatedProduct)!,
    };
  } catch (error) {
    const errMsg = catchErr(error);
    return { success: false, error: errMsg.error };
  }
};

// ===== Toggle Product's active (status) ===== //
export const doToggleProductActive = async (
  productId: string
): Promise<TActionResponse> => {
  await connectDB();
  try {
    if (!productId) {
      throw new Error("Product ID is required.");
    }

    const existingProduct = await getProduct(productId);
    if (!existingProduct) {
      throw new Error("This product doesn't exist.");
    }

    const currentStatus = existingProduct.isActive;

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(productId) },
      { isActive: !currentStatus }
    ).lean<IProductFrontend>();

    return {
      success: true,
      message: `${updatedProduct?.name} has been ${
        currentStatus ? "inactivated" : "activated"
      }`,
    };
  } catch (error) {
    const errMsg = catchErr(error);
    return { success: errMsg.success, error: errMsg.error };
  }
};

// ===== Delete a product ===== //
export const doDeleteProduct = async (
  productId: string,
  productName: string,
  productImage: { url: string; public_id: string; id?: string }[]
): Promise<TActionResponse> => {
  await connectDB();
  try {
    const isExist = await getProduct(productId);
    if (!isExist) {
      throw new Error("This product does not exist.");
    }

    await Product.findByIdAndDelete(productId);

    await Promise.all(
      productImage.map((image) => deleteCloudinaryImage(image.public_id))
    );

    return { success: true, message: `${productName} has been deleted` };
  } catch (error) {
    const errMsg = catchErr(error);
    return { success: errMsg.success, error: errMsg.error };
  }
};

// ===== Make Payment ===== //
export const doPayment = async (
  paymentData: TPaymentData
): Promise<{ success: boolean; message: string; orderId?: string }> => {
  await connectDB();

  try {
    const {
      bookingDate,
      deliveryAddress,
      paymentMethod,
      items,
      regularDeliveryDate,
      sameDayDeliveryDate,
    } = paymentData;

    const customer = await getUserSession();

    if (!customer || !customer.email) {
      throw new Error("Please login to place an order");
    }

    const customerId = customer.id;
    const isExistCustomer = await getUserByEmail(customer.email);
    if (!isExistCustomer) {
      throw new Error("Please login to place an order.");
    }

    // decrease the stock
    await Promise.all(
      items?.map((item) =>
        Product.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(item.product.id) },
          { stock: item.product.stock - item.quantity },
          { new: true }
        )
      )
    );

    const itemWithProductIdsAndQuantity = items?.map((item) => ({
      product: item.product.id,
      quantity: item.quantity,
    }));

    const created = await Order.create({
      customer: new mongoose.Types.ObjectId(customerId!),
      items: itemWithProductIdsAndQuantity,
      status: "PLACED",
      bookingDate,
      deliveryAddress,
      paymentMethod,
      regularDeliveryDate: regularDeliveryDate ?? false,
      sameDayDeliveryDate: sameDayDeliveryDate ?? false,
    });

    const order = await getOrderById(created._id.toString());

    await fetch(`${getBaseUrl()}/api/send-email/order-invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order }),
    });

    return {
      success: true,
      message: "Order placed successfully.",
      orderId: created._id.toString(),
    };
  } catch (error) {
    const errMsg = catchErr(error);
    return { success: false, message: errMsg.error };
  }
};

// ===== Update Order Status ===== //
export const doUpdateOrderStatus = async (
  orderId: string,
  currentStatus: TOrderStatus,
  role: "Customer" | "Farmer"
): Promise<{ success: boolean; message: string }> => {
  await connectDB();
  try {
    const order = await getOrderById(orderId);

    if (!order) {
      throw new Error("This order does not exist.");
    }

    let newStatus: TOrderStatus | null = null;
    let successMessage: string = "";

    // customer actions
    if (role === "Customer") {
      if (currentStatus === "PLACED") {
        newStatus = "CANCELLED";
        successMessage = "Your order has been canceled successfully.";
      } else if (currentStatus === "CANCELLED") {
        newStatus = "PLACED";
        successMessage = "Your order has been placed again successfully.";
      }
    }

    // farmer actions
    if (role === "Farmer" && currentStatus !== "DELIVERED") {
      const forwardStatus: Record<TOrderStatus, TOrderStatus> = {
        PLACED: "CONFIRMED",
        CONFIRMED: "SHIPPED",
        SHIPPED: "DELIVERED",
        CANCELLED: "CANCELLED",
        DELIVERED: "DELIVERED",
      };

      newStatus = forwardStatus[currentStatus];
      successMessage = `Order status updated to ${newStatus}`;
    }

    if (!newStatus || currentStatus === newStatus) {
      return { success: true, message: "No status change performed." };
    }

    // update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(order.id) },
      { status: newStatus },
      { new: true }
    )
      .populate("customer")
      .lean();

    const transformOrder = transformMongoDoc(updatedOrder);

    // notify by the email
    await fetch(`${getBaseUrl()}/api/send-email/order-status-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transformOrder }),
    });

    return { success: true, message: successMessage };
  } catch (error) {
    console.error("Order status update error:", error);
    return { success: false, message: "Order status update failed." };
  }
};
