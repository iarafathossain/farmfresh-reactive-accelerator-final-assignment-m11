"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchByTerm = ({ width }: { width?: string }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const params = useMemo(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  const doDebounceSearch = useDebounce((term: string) => {
    if (term) {
      params.set("term", term);
    } else {
      params.delete("term", term);
    }

    if (pathname === "/") {
      router.push(`/products?${params.toString()}`);
      return;
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  const handleChange = (term: string) => {
    doDebounceSearch(term);
  };

  useEffect(() => {
    const term = params.get("term");
    if (term) {
      setSearchTerm(term);
    }
  }, [params]);

  return (
    <div className={`relative ${width === "w-full" ? "w-full" : ""}`}>
      <input
        type="text"
        id="term"
        defaultValue={searchTerm}
        placeholder="Search products..."
        onChange={(e) => {
          handleChange(e.target.value.trim().replace(/\s+/g, " "));
        }}
        className={`${width ? width : "w-64"} min-w-0 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
      />
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
    </div>
  );
};

export default SearchByTerm;
