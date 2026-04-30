"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { IoSearch } from "react-icons/io5";

const Hero = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [query, setQuery] = useState<{ term: string; category: string }>({
    term: "",
    category: "",
  });

  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.term) {
      params.set("query", query.term);
    } else {
      params.delete("query");
    }

    if (query.category) {
      params.set("category", query.category);
    } else {
      params.delete("category");
    }

    if (pathname === "/") {
      router.push(`/products?${params.toString()}`);
      return;
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fresh from Farm to Your Table
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            Connect directly with local farmers and get the freshest produce
            delivered to your doorstep
          </p>

          {/* <!-- Search Bar --> */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-wrap rounded-lg overflow-hidden shadow-lg">
              <input
                type="text"
                name="term"
                value={query.term}
                onChange={handleChange}
                placeholder="Search for vegetables, fruits, farmers..."
                className="flex-1 px-6 py-4 text-gray-900 text-lg focus:outline-none bg-white"
              />
              <select
                name="category"
                value={query.category}
                onChange={handleChange}
                className="px-4 py-4 text-gray-900 border-l border-gray-300 focus:outline-none bg-white flex-1 sm:flex-none"
              >
                <option>All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
              </select>
              <button
                type="button"
                onClick={handleClick}
                className="bg-primary-700 hover:bg-primary-800 px-8 py-4 transition"
              >
                <IoSearch className="text-white text-2xl" />
              </button>
            </div>
          </div>

          {/* <!-- Stats --> */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-green-200">Local Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2000+</div>
              <div className="text-green-200">Fresh Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">10k+</div>
              <div className="text-green-200">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
