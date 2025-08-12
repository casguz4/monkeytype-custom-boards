import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>Welcome to Monkeytyoe Custom Boards</h1>
      <p>Manage leader boards and track group progress</p>
    </div>
  );
}
