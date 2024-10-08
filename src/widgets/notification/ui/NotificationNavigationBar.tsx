import { Link } from "react-router-dom";
import { NotificationIcon } from "@/shared/ui/icon";

export const NotificationNavigationBar = () => {
  return (
    <header>
      <nav className="bg-tangerine-500">
        <Link to="/">
          <ul className="flex min-w-[280px] items-center justify-between self-stretch px-1 py-2">
            <li>
              <h1 className="title-1 px-4 text-grey-0">MUNGWITHME</h1>
            </li>
            {/* TODO 기능이 존재하는 알림 버튼으로 만들기 */}
            <button className="flex items-center justify-center px-3 py-3">
              <NotificationIcon />
            </button>
          </ul>
        </Link>
      </nav>
    </header>
  );
};
