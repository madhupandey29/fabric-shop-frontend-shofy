import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ProductDetailsArea from "@/components/product-details/product-details-area";
import Footer from "@/layout/footers/footer";

// ✅ Enable ISR: page will be cached and revalidated every 30 days
export const revalidate = 60 * 60 * 24 * 30; // 30 days

export const metadata = {
  title: "Shofy - Product Details Page",
};

export default async function ProductDetailsPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <ProductDetailsArea id="6431364df5a812bd37e765ac" />
      <Footer primary_style />
    </Wrapper>
  );
}
