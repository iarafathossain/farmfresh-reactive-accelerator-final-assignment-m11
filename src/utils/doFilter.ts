export const doFilter = (searchParams: {
  term?: string;
  category?: string;
  priceRange?: string;
  organic?: string;
  sort?: string;
  status?: string;
  page?: string;
  limit?: string;
}) => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};

  // filter based on status
  if (status === "active") {
    filter.isActive = true;
  } else if (status === "inactive") {
    filter.isActive = false;
  } else if (status === "out_of_stock") {
    filter.stock = 0;
  } else {
    filter.isActive = true;
  }

  // search term based on name or description
  if (term) {
    filter.$or = [
      { name: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } },
    ];
  }

  // category filter
  if (category) {
    const categories = decodeURI(category).split("|");
    filter.category =
      categories.length === 1 ? categories[0] : { $in: categories };
  }

  // price range filter
  if (priceRange) {
    const [min, max] = priceRange.split("-").map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      filter.price = { $gte: min, $lte: max };
    }
  }

  // organic filter
  if (organic === "true") {
    filter.features = { $in: ["Organic"] };
  }

  // sorting
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

  // pagination
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 1, 1);
  const skip = (pageNum - 1) * limitNum;

  return { filter, pageNum, limitNum, skip, sortOptions };
};
