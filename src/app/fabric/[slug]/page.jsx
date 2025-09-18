// app/fabric/[slug]/page.jsx
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ProductClient from "./ProductDetailsClient";

export const revalidate = 2592000; // 30 days

export { generateMetadata } from "./metadata";

export default async function Page({ params }) {
  const { slug } = params;

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <ProductClient slug={slug} />
      <Footer primary_style />
    </Wrapper>
  );
}
