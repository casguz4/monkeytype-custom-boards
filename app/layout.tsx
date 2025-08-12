import { Outlet, NavLink } from "react-router";
import { Switch } from "~/components/ui/switch";

const TITLE = "Monkey Type Custom Boards";
export default function Layout() {
  return (
    <div>
      <header className="h-full max-h-[1vh] mb-2 flex justify-between">
        <nav>
          <ul className="flex space-x-4 lg:space-x-8">
            <li>
              <NavLink to="/">Monkey Type Custom Boards</NavLink>
            </li>
            <li>
              <NavLink to="/boards">Leader Boards</NavLink>
            </li>
          </ul>
        </nav>
        <div>
          {/* theme toggle switch */}
          <Switch id="theme-toggle" />
        </div>
      </header>
      <div className="m-2">
        <main className="flex flex-col w-full items-center min-h-screen pt-8 lg:pt-24">
          <Outlet />
        </main>
      </div>
      <footer className="bg-gray-800 text-white p-4">
        <p>
          &copy; {new Date().getFullYear()} {TITLE}
        </p>
      </footer>
    </div>
  );
}
