import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api")) {
      const { pathname } = url;
      const [_, route] = pathname.split("/api/");
      switch (route) {
        case "board":
          return new Response(
            JSON.stringify({ message: "called the board api route!" }),
            { status: 200 },
          );
        default:
          return new Response("Not Found", { status: 404 });
      }
    }
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
