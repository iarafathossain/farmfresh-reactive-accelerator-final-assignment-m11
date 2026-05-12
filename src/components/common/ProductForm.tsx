"use client";

import { doAddingProduct, doEditingProduct } from "@/actions/product";
import { useForm } from "@/hooks/useForm";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { IProductForm } from "@/types";
import { validateAddProductForm } from "@/validations/validateAddProductForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCloud, FaTrash } from "react-icons/fa";
import DeleteImage from "../edit-product/DeleteImage";
import Button from "../ui/Button";
import Popup from "../ui/Popup";
import Field from "./Field";

type ProductFormProps<
  T extends { url: string; public_id: string; id?: string }[] | File[],
> = {
  initialValues: IProductForm<T>;
  mode: "ADD" | "EDIT";
  editProductId?: string;
};

const features = [
  "Organic",
  "Pesticide Fresh",
  "Fresh",
  "Non-GMO",
  "Local",
  "Sustainable",
  "Fair Trade",
  "Gluten-Free",
];

const ProductForm = <
  T extends { url: string; public_id: string; id?: string }[] | File[],
>({
  initialValues,
  mode,
  editProductId,
}: ProductFormProps<T>) => {
  const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);
  const [deletedImage, setDeletedImage] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");

  const router = useRouter();

  const { loading, error, submitForm } = useFormSubmit<IProductForm<T>>({
    successMessage:
      mode === "ADD"
        ? "Product added successfully!"
        : "Product updated successfully!",
    onSuccess: () => {
      if (mode === "EDIT") {
        router.refresh();
      }
    },
  });

  const {
    values: formValues,
    errors,
    touched,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit: formikHandleSubmit,
  } = useForm<IProductForm<T>>({
    initialValues,
    validate: validateAddProductForm,
    onSubmit: async (values) => {
      const submitAction = async (formData: FormData) => {
        if (mode === "ADD") {
          return await doAddingProduct(formData);
        } else {
          return await doEditingProduct(formData, editProductId!);
        }
      };
      await submitForm(values, submitAction);
    },
  });

  //   remove one file by its index
  const removeFile = (
    index: number,
    image: { url: string; public_id: string } | File,
  ) => {
    if (image instanceof File) {
      setValues((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index) as T,
      }));
    }

    if (typeof image === "object" && "url" in image) {
      setPublicId(image.public_id);
      setShowConfirmPopup(true);
      setDeletedImage(image.url);
    }
  };

  // toggle feature's check box
  const handleFeatureChange = (feature: string) => {
    setValues((prev) => {
      const features = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];

      return { ...prev, features };
    });
  };

  return (
    <>
      <form className="p-8 space-y-8" onSubmit={formikHandleSubmit}>
        {!!error ? (
          <p className="text-red-500 text-sm text-center">{error}</p>
        ) : (
          ""
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field error={touched.name && errors.name}>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Product Name *
              </label>
              <input
                value={formValues.name}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Organic Tomatoes"
              />
            </Field>

            <Field error={touched.category && errors.category}>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Category *
              </label>
              <select
                value={formValues.category}
                onChange={handleChange}
                onBlur={handleBlur}
                id="category"
                name="category"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
                <option value="herbs">Herbs</option>
                <option value="honey">Honey</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field error={touched.harvestDate && errors.harvestDate}>
                <label
                  htmlFor="harvestDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Harvest Date
                </label>
                <input
                  value={formValues.harvestDate}
                  onChange={handleChange}
                  type="date"
                  id="harvestDate"
                  name="harvestDate"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field error={touched.description && errors.description}>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description *
                </label>
                <textarea
                  value={formValues.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your product, growing methods, quality, etc."
                ></textarea>
              </Field>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Pricing & Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <Field error={touched.price && errors.price}>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Price per Unit (৳) *
              </label>
              <input
                value={formValues.price}
                onChange={handleChange}
                onBlur={handleBlur}
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="1"
                max={1000}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="45.00"
              />
            </Field>

            <Field error={touched.unit && errors.unit}>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Unit *
              </label>
              <select
                value={formValues.unit}
                onChange={handleChange}
                onBlur={handleBlur}
                id="unit"
                name="unit"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Unit</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="piece">Piece</option>
                <option value="liter">Liter</option>
                <option value="dozen">Dozen</option>
                <option value="bundle">Bundle</option>
              </select>
            </Field>

            <Field error={touched.stock && errors.stock}>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Available Stock *
              </label>
              <input
                value={formValues.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                type="number"
                id="stock"
                name="stock"
                min="0"
                max={1000}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="100"
              />
            </Field>
          </div>
          <Field error={touched.discountRate && errors.discountRate}>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group"
            >
              Discount Rate (Optional)
              <span className="text-xs text-gray-400 block mt-2">
                This discount rate will be calculated on this all product&apos;s
                items in the basis of percentage.
              </span>
            </label>
            <input
              value={formValues.discountRate}
              onChange={handleChange}
              onBlur={handleBlur}
              type="number"
              id="discountRate"
              name="discountRate"
              min={0}
              max={50}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="8 for 8%"
            />
          </Field>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Delivery & Service Fee
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <Field error={touched.deliveryMethod && errors.deliveryMethod}>
              <label
                htmlFor="deliveryMethod"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Delivery Method *
                <span className="text-xs text-gray-400 block mt-2">
                  Express Delivery = 1 day | Regular Delivery = 3 days
                </span>
              </label>
              <select
                value={formValues.deliveryMethod}
                onChange={handleChange}
                onBlur={handleBlur}
                id="deliveryMethod"
                name="deliveryMethod"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Delivery Method</option>
                <option value="same_day_delivery">
                  Same Day/Express Delivery
                </option>
                <option value="regular_delivery">Regular Delivery</option>
              </select>
            </Field>
            <Field error={touched.baseDeliveryFee && errors.baseDeliveryFee}>
              <label
                htmlFor="baseDeliveryFee"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Base Delivery Fee
                <span className="text-xs text-gray-400 block mt-2">
                  Delivery fee for first unit
                </span>
              </label>
              <input
                value={formValues.baseDeliveryFee}
                onChange={handleChange}
                type="number"
                min={1}
                max={500}
                placeholder="Delivery fee is 100tk for the first unit"
                id="baseDeliveryFee"
                name="baseDeliveryFee"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </Field>
            <Field
              error={touched.perUnitDeliveryFee && errors.perUnitDeliveryFee}
            >
              <label
                htmlFor="perUnitDeliveryFee"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Per Unit Delivery Fee
                <span className="text-xs text-gray-400 block mt-2">
                  Per unit delivery fee from second unit.
                </span>
              </label>
              <input
                value={formValues.perUnitDeliveryFee}
                onChange={handleChange}
                type="number"
                min={1}
                max={500}
                id="perUnitDeliveryFee"
                placeholder="Delivery fee is 20tk from the second unit."
                name="perUnitDeliveryFee"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </Field>
            <Field error={touched.serviceFee && errors.serviceFee}>
              <label
                htmlFor="serviceFee"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Service Fee
                <span className="text-xs text-gray-400 block mt-2">
                  Add service fee including tax, maintenance fee etc.
                </span>
              </label>
              <input
                value={formValues.serviceFee}
                onChange={handleChange}
                type="number"
                min={1}
                max={500}
                id="serviceFee"
                placeholder="services fee 20tk"
                name="serviceFee"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </Field>
          </div>
        </div>

        <Field error={touched.images && errors.images}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Product Images
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Upload Images (Max 5 images) *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition">
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept=".jpeg, .jpg, .png, .webp"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <FaCloud className="text-4xl text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Click to upload images
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </label>
              </div>
              <div
                id="imagePreview"
                className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4"
              >
                {formValues.images &&
                  formValues.images.length > 0 &&
                  formValues.images.map((image, index) => {
                    let src = "";
                    let alt = "";

                    if (image instanceof File) {
                      // Case: New file upload
                      src = URL.createObjectURL(image);
                      alt = image.name;
                    } else if (typeof image === "string") {
                      src = image;
                      alt = "product-image";
                    } else if (typeof image === "object" && "url" in image) {
                      src = image.url;
                      alt = image.public_id || "product-image";
                    }

                    return (
                      <div
                        key={index}
                        className="relative h-60 w-full overflow-hidden scroll-auto"
                      >
                        <Image
                          src={src}
                          alt={alt}
                          width={150}
                          height={150}
                          className="rounded object-cover border border-gray-900 dark:border-gray-200"
                        />
                        <FaTrash
                          onClick={() => removeFile(index, image)}
                          className="absolute top-4 right-2 hover:text-red-600 cursor-pointer text-red-500"
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </Field>

        <Field error={touched.features && errors.features}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Product Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <label
                key={feature}
                className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  value={formValues.features[index]}
                  checked={formValues.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                  type="checkbox"
                  name="features"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </Field>
        <Button
          label={mode === "ADD" ? "Add Product" : "Update Product"}
          loading={loading}
          hasSpinner={true}
          loadingText={mode === "ADD" ? "Adding..." : "Updating..."}
        />
      </form>
      {showConfirmPopup && (
        <Popup onClose={() => setShowConfirmPopup(false)}>
          <DeleteImage
            deletedImage={deletedImage}
            public_id={publicId}
            productId={editProductId!}
            onCancel={() => setShowConfirmPopup(false)}
          />
        </Popup>
      )}
    </>
  );
};

export default ProductForm;
