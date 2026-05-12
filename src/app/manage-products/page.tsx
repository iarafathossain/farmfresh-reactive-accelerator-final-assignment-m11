import Pagination from "@/components/common/Pagination";
import ProductCardWrapper from "@/components/common/ProductCardWrapper";
import ManageProductFilter from "@/components/manage-products/ManageProductFilter";
import ManageProductPageTitle from "@/components/manage-products/ManageProductPageTitle";
import AccessDenied from "@/components/ui/AccessDenied";
import { ManageProductsContentSkeleton } from "@/components/ui/PageSkeletons";
import { getProductsByFarmerId } from "@/queries/product";
import { getUserSession } from "@/utils/getUserSession";
import { Suspense } from "react";

const ManageProductPage = async ({
  searchParams,
}: {
  searchParams: {
    term: string;
    category: string;
    priceRange: string;
    location: string;
    organic: string;
    sort: string;
  };
}) => {
  const userSession = await getUserSession();

  if (userSession?.role !== "Farmer") {
    return <AccessDenied allowedRole="Farmer" path="Manage-Product page" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ManageProductPageTitle />
      <ManageProductFilter />
      <Suspense fallback={<ManageProductsContentSkeleton />}>
        <ManageProductsContent
          searchParams={searchParams}
          farmerId={userSession.id!}
        />
      </Suspense>
    </div>
  );
};

const ManageProductsContent = async ({
  searchParams,
  farmerId,
}: {
  searchParams: {
    term: string;
    category: string;
    priceRange: string;
    location: string;
    organic: string;
    sort: string;
  };
  farmerId: string;
}) => {
  const { products, pagination } = await getProductsByFarmerId(
    searchParams,
    farmerId,
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCardWrapper products={products} isManageListingPage={true} />
      </div>
      <Pagination pagination={pagination} />
    </>
  );
};

export default ManageProductPage;
