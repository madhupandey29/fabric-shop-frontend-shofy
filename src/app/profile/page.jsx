import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ProfileArea from "@/components/my-account/profile-area";

export const metadata = {
  title: "Shofy - Profile Page",
};

export default function ProfilePage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <h1 style={{position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>My Account - Profile Details</h1>
      <ProfileArea />
      <Footer style_2={true} />
    </Wrapper>
  );
}
