import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";

export const metadata = {
  title: "Shofy - Shop Page",
};

export default function ShopPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <h1 style={{position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>Shop - Browse All Products</h1>
      <ShopBreadcrumb title="Shop Grid" subtitle="Shop Grid" />
      <ShopArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
}
