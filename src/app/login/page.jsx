// app/(auth)/login/page.tsx

import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import LoginArea from "@/components/login-register/login-area";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Shofy - Login Page",
};

export default async function LoginPage() {
  // (Optional but useful) ensure runtime work so Next treats it as dynamic
  // Keep cache: "no-store" for any real data you fetch here.
  await fetch("data:application/json,{}", { cache: "no-store" });

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <CommonBreadcrumb title="Login" subtitle="Login" center />
      <LoginArea />
      <Footer primary_style />
    </Wrapper>
  );
}
