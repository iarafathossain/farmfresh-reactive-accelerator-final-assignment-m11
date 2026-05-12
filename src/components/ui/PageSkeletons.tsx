const PulseBlock = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
  />
);

const ProductCardSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
    <PulseBlock className="h-44 w-full rounded-xl" />
    <PulseBlock className="h-5 w-3/4" />
    <PulseBlock className="h-4 w-1/2" />
    <PulseBlock className="h-10 w-full" />
  </div>
);

export const GlobalPageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PulseBlock className="h-8 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

export const ProductsHeaderSkeleton = () => {
  return (
    <div className="bg-primary-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <PulseBlock className="h-10 w-72 bg-primary-500" />
        <PulseBlock className="h-6 w-96 bg-primary-500" />
      </div>
    </div>
  );
};

export const ProductsContentSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
      <div className="flex justify-center">
        <PulseBlock className="h-10 w-64" />
      </div>
    </div>
  );
};

export const ProductsPageSkeleton = () => {
  return (
    <>
      <ProductsHeaderSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <PulseBlock className="h-6 w-24" />
              <PulseBlock className="h-10 w-full" />
              <PulseBlock className="h-10 w-full" />
              <PulseBlock className="h-10 w-full" />
              <PulseBlock className="h-10 w-full" />
            </div>
          </div>
          <div className="lg:col-span-3">
            <ProductsContentSkeleton />
          </div>
        </div>
      </div>
    </>
  );
};

export const ManageProductsContentSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
      <div className="flex justify-center">
        <PulseBlock className="h-10 w-64" />
      </div>
    </div>
  );
};

export const ManageProductsPageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PulseBlock className="h-10 w-64" />
      <PulseBlock className="h-12 w-full" />
      <ManageProductsContentSkeleton />
    </div>
  );
};

export const ReviewsSectionSkeleton = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <PulseBlock className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-3"
          >
            <PulseBlock className="h-4 w-1/2" />
            <PulseBlock className="h-4 w-full" />
            <PulseBlock className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </section>
  );
};

export const ProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow w-full max-w-5xl space-y-6">
        <div className="flex items-center gap-2">
          <PulseBlock className="h-5 w-24" />
          <PulseBlock className="h-5 w-5 rounded-full" />
        </div>
        <PulseBlock className="h-4 w-48" />
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <PulseBlock className="h-40 w-40 rounded-full" />
            <PulseBlock className="h-4 w-40" />
            <PulseBlock className="h-4 w-56" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <PulseBlock className="h-4 w-24" />
                <PulseBlock className="h-11 w-full" />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <PulseBlock className="h-11 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-transparent p-6 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-3">
          <PulseBlock className="h-6 w-48" />
          <PulseBlock className="h-4 w-64" />
          <div className="flex items-center gap-2">
            <PulseBlock className="h-6 w-6 rounded-full" />
            <PulseBlock className="h-4 w-36" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PulseBlock className="h-8 w-28 rounded-full" />
          <PulseBlock className="h-6 w-20" />
        </div>
      </div>
      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <PulseBlock className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <PulseBlock className="h-5 w-56" />
              <PulseBlock className="h-4 w-40" />
              <PulseBlock className="h-4 w-32" />
            </div>
            <PulseBlock className="h-5 w-20" />
          </div>
        ))}
      </div>
      <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
        <PulseBlock className="h-5 w-32" />
        <div className="flex gap-3 flex-wrap">
          <PulseBlock className="h-10 w-28 rounded-lg" />
          <PulseBlock className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const MyOrdersPageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-3">
          <PulseBlock className="h-8 w-44" />
          <PulseBlock className="h-5 w-72" />
        </div>
        <PulseBlock className="h-11 w-44 rounded-lg" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <OrderCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

export const FarmersPageSkeleton = () => {
  return (
    <>
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <PulseBlock className="h-10 w-80 mx-auto bg-primary-500" />
          <PulseBlock className="h-6 w-[min(100%,36rem)] mx-auto bg-primary-500" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="text-center space-y-3">
              <PulseBlock className="h-10 w-20 mx-auto" />
              <PulseBlock className="h-4 w-28 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4"
            >
              <PulseBlock className="h-52 w-full rounded-xl" />
              <PulseBlock className="h-5 w-3/4" />
              <PulseBlock className="h-4 w-1/2" />
              <PulseBlock className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <PulseBlock className="h-11 w-40 rounded-lg" />
        </div>
      </div>
    </>
  );
};
