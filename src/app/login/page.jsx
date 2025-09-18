// app/(auth)/login/page.tsx  <-- adjust path to your route


import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import LoginArea from "@/components/login-register/login-area";

/** 
 * Force dynamic rendering (SSR) for this route.
 * This disables static generation and ISR.
 */
export const dynamic = "force-dynamic";
// (optional, redundant with force-dynamic but explicit)
// export const revalidate = 0;

export const metadata = {
  title: "Shofy - Login Page",
};

export default async function LoginPage() {
  // If you ever fetch here, prefer no-store to keep SSR strict:
  // const res = await fetch("https://api.example.com/...", { cache: "no-store" });

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <CommonBreadcrumb title="Login" subtitle="Login" center />
      <LoginArea />
      <Footer primary_style />
    </Wrapper>
  );
}
