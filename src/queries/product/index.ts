import "@/models/reviewModel";

import { connectDB } from "@/libs/connectDB";
import { Product } from "@/models/productModel";
import { IProductBase, IProductFrontend } from "@/types";
import { buildProductFilter, filterProductsByLocation, getLocationFilter } from "@/services/ProductFilterService";
import { transformMongoDoc } from "@/utils/transformMongoDoc";

// Create a product
export const createProduct = async (payload: Omit<IProductBase, "id">) => {
  await connectDB();
  const createdProduct = await Product.create(payload);
  return createdProduct;
};

// Get all product
export const getProducts = async (searchParams: {
  term?: string;
  category?: string;
  priceRange?: string;
  location?: string;
  organic?: string;
  sort?: string;
  status?: string;
  page?: string;
  limit?: string;
}) => {
  await connectDB();

  const { filter, sortOptions, skip, limitNum, pageNum } =
    buildProductFilter(searchParams);

  // query plus count docs
  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate("farmer")
      .populate("reviews")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean<IProductFrontend[]>(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalProducts / limitNum);

  // Apply client-side location filter (necessary for farmer subdocument)
  const locationFilter = getLocationFilter(searchParams);
  const filteredProducts = filterProductsByLocation(products, locationFilter);

  return {
    products: transformMongoDoc(filteredProducts),
    pagination: {
      totalProducts,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
    },
  };
};

// Get products by farmerId
export const getProductsByFarmerId = async (
  searchParams: {
    term?: string;
    category?: string;
    priceRange?: string;
    location?: string;
    organic?: string;
    sort?: string;
    page?: string;
    limit?: string;
  },
  farmerId: string
) => {
  await connectDB();

  const { filter, pageNum, limitNum, skip, sortOptions } =
    buildProductFilter(searchParams);

  const [products, totalProducts] = await Promise.all([
    Product.find({ farmer: farmerId, ...filter })
      .populate("farmer")
      .populate("reviews")
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip)
      .lean<IProductFrontend[]>(),
    Product.countDocuments({ farmer: farmerId, ...filter }),
  ]);

  const totalPages = Math.ceil(totalProducts / limitNum);

  // Apply client-side location filter (necessary for farmer subdocument)
  const locationFilter = getLocationFilter(searchParams);
  const filteredProducts = filterProductsByLocation(products, locationFilter);

  return {
    products: transformMongoDoc(filteredProducts),
    pagination: {
      totalProducts,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
    },
  };
};

// Get product by its id
export const getProduct = async (productId: string) => {
  await connectDB();

  const product = await Product.findById(productId)
    .populate("farmer")
    .populate({
      path: "reviews",
      model: "Review",
      populate: {
        path: "customer",
        model: "User",
      },
    })
    .lean<IProductFrontend>();
  return transformMongoDoc(product);
};
