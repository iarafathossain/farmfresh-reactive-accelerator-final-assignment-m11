import Stats from "@/components/about/Stats";
import Team from "@/components/about/Team";
import Values from "@/components/about/Values";
import CTA from "@/components/common/CTA";
import Categories from "@/components/Home/Categories";
import { FAQ } from "@/components/Home/faq";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import Hero from "@/components/Home/Hero";
import Reviews from "@/components/Home/reviews";
import WhyUs from "@/components/Home/WhyUs";
import { getProducts } from "@/queries/product";
import { getAllReviews } from "@/queries/review";

const HomePage = async ({
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
  const { products } = await getProducts(searchParams);
  const reviews = await getAllReviews();

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts products={products} />
      <WhyUs />
      {reviews.length > 0 && <Reviews reviews={reviews} />}
      <FAQ />
      <Stats />
      <Values />
      <Team />
      <CTA />
    </>
  );
};

export default HomePage;
