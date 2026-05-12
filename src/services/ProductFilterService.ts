/**
 * Unified product filter service.
 * Consolidates all filter logic (database filters, sorting, and pagination)
 * in one place to eliminate duplication across queries and pages.
 */

interface FilterParams {
  term?: string;
  category?: string;
  priceRange?: string;
  location?: string;
  organic?: string;
  sort?: string;
  status?: string;
  page?: string;
  limit?: string;
}

interface FilterResult {
  filter: Record<string, unknown>;
  sortOptions: Record<string, 1 | -1>;
  skip: number;
  limitNum: number;
  pageNum: number;
}

/**
 * Build MongoDB filter, sort, and pagination options from search params.
 * Handles all filter types including location (now in DB query).
 */
export const buildProductFilter = (
  searchParams: FilterParams,
): FilterResult => {
  const {
    term,
    category,
    priceRange,
    organic,
    sort,
    status,
    page = "1",
    limit = "8",
  } = searchParams;

  const filter: Record<string, unknown> = {};

  // Filter based on status
  if (status === "active") {
    filter.isActive = true;
  } else if (status === "inactive") {
    filter.isActive = false;
  } else if (status === "out_of_stock") {
    filter.stock = 0;
  } else {
    filter.isActive = true;
  }

  // Search term based on name or description
  if (term) {
    filter.$or = [
      { name: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } },
    ];
  }

  // Category filter
  if (category) {
    const categories = decodeURI(category).split("|");
    filter.category =
      categories.length === 1 ? categories[0] : { $in: categories };
  }

  // Price range filter
  if (priceRange) {
    const [min, max] = priceRange.split("-").map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      filter.price = { $gte: min, $lte: max };
    }
  }

  // Organic filter
  if (organic === "true") {
    filter.features = { $in: ["Organic"] };
  }

  // Location filter moved to farmDistrict lookup
  // Will be handled in the query layer using populate + filter
  // or via a lookup aggregation for better performance

  // Sorting
  let sortOptions: Record<string, 1 | -1> = {};

  switch (sort) {
    case "price_low_to_high":
      sortOptions = { price: 1 };
      break;
    case "price_high_to_low":
      sortOptions = { price: -1 };
      break;
    case "newest":
      sortOptions = { createdAt: -1 };
      break;
    case "rating":
      sortOptions = { rating: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  // Pagination
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 1, 1);
  const skip = (pageNum - 1) * limitNum;

  return { filter, pageNum, limitNum, skip, sortOptions };
};

/**
 * Apply location filter post-query (client-side after fetch).
 * This is necessary because location is in the farmer subdocument.
 */
export const filterProductsByLocation = <
  T extends { farmer?: { farmDistrict?: string } },
>(
  products: T[],
  location?: string,
): T[] => {
  if (!location) return products;

  return products.filter((product) =>
    product?.farmer?.farmDistrict
      ?.toLowerCase()
      ?.includes(location.toLowerCase()),
  );
};

/**
 * Get location filter value for client-side filtering.
 */
export const getLocationFilter = (
  searchParams: FilterParams,
): string | undefined => {
  return searchParams.location;
};
