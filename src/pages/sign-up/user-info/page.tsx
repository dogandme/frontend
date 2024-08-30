import { UserInfoRegistrationForm } from "@/features/auth/ui";
import { BackwardNavigationBar } from "@/widgets/navigationbar/ui";

const UserInfoRegistrationPage = () => {
  return (
    <div>
      <BackwardNavigationBar />
      {/* progress bar */}
      <div></div>

      <main className="flex flex-col gap-8 self-stretch px-4 pb-32 pt-8">
        <h1 className="headline-3 mx-auto text-grey-900">기본정보 입력</h1>

        <UserInfoRegistrationForm />
      </main>
    </div>
  );
};

export default UserInfoRegistrationPage;