import { PetInfoRequestData, usePostPetInfo } from "@/features/auth/api";
import { PetInformationForm } from "@/features/auth/ui";
import { AuthNavigationBar } from "@/features/auth/ui";

const PetInfoPage = () => {
  const { mutate: postPetInformation, isPending } = usePostPetInfo();

  const handleSubmit = (formObject: PetInfoRequestData) => {
    postPetInformation(formObject);
  };

  return (
    <div>
      <header>
        <AuthNavigationBar type="close" />
      </header>
      <main className="flex flex-col items-center gap-4 self-stretch px-4 pb-32 pt-8">
        <h1 className="headline-3 overflow-ellipsis text-center text-grey-900">
          우리 댕댕이를 소개해 주세요
        </h1>
        <PetInformationForm onSubmit={handleSubmit} disabled={isPending} />
      </main>
    </div>
  );
};

export default PetInfoPage;
