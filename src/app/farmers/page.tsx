import FarmerCard from "@/components/common/FarmerCard";
import LoadMore from "@/components/common/LoadMore";
import PageHeader from "@/components/common/page-header";
import FarmersStats from "@/components/farmers/FarmersStats";
import { getAllFarmers } from "@/queries/user";

const FarmersPage = async ({}) => {
  const farmers = await getAllFarmers();
  return (
    <>
      <PageHeader
        title="Meet Our Farmers"
        subtitle="Discover the passionate farmers who grow fresh, organic produce with care and dedication"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FarmersStats />
        {farmers && farmers.length === 0 ? (
          <p className="text-xs font-semibold text-gray-400 text-center">
            No farmers listed yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {farmers.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        )}

        <LoadMore />
      </div>
    </>
  );
};

export default FarmersPage;
