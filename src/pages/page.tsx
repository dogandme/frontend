interface MainPageProps {
  GlobalNavigationBar: JSX.Element;
}

const MainPage = ({ GlobalNavigationBar }: MainPageProps) => {
  return (
    <>
      {GlobalNavigationBar}
      <div>메인 페이지</div>
    </>
  );
};

export default MainPage;
