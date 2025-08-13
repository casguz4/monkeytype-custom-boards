import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  layout("./layout.tsx", [route("/", "routes/home.tsx")]),
] satisfies RouteConfig;
