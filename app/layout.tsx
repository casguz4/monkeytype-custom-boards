import { Outlet, NavLink } from "react-router";

const TITLE = "Monkey Type Custom Boards";
export default function Layout() {
  return (
    <div>
      <header className="h-full mb-2 flex justify-between">
        <nav>
          <NavLink to="/">Monkey Type Custom Boards</NavLink>
        </nav>
        <div>{/* theme toggle switch */}</div>
      </header>
      <main className="flex flex-col w-full min-h-screen px-10 pb-25">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <p className="text-center">
          &copy; {new Date().getFullYear()} {TITLE}
        </p>
      </footer>
    </div>
  );
}
