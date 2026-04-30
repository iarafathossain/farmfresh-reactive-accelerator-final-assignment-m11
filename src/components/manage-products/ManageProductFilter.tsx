"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import SearchByTerm from "../products/filter/SearchByTerm";

const ManageProductFilter = () => {
  const [query, setQuery] = useState<{
    category: string;
    status: string;
  }>({
    category: "",
    status: "",
  });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const params = useMemo(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  const handleApplyFilter = () => {
    if (query.category) {
      params.set("category", query.category);
    } else {
      params.delete("category");
    }

    if (query.status) {
      params.set("status", query.status);
    } else {
      params.delete("status");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setQuery({
      category: searchParams.get("category") || "",
      status: searchParams.get("status") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    if (query.category) {
      params.set("category", query.category);
    } else {
      params.delete("category");
    }

    if (query.status) {
      params.set("status", query.status);
    } else {
      params.delete("status");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, query.category, query.status, params, router]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="term"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Search
          </label>
          <SearchByTerm width="w-full" />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={query.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={query.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleApplyFilter}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProductFilter;
