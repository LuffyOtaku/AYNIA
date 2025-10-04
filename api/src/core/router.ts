import type { Route, RouteHandler } from "../types/http";

export class Router {
  private routes: Route[] = [];

  private matchRoute(
    method: string,
    path: string
  ): { handler: RouteHandler; params: Record<string, string> } | null {
    for (const route of this.routes) {
      if (route.method !== method) continue;

      const routeSegments = route.path.split("/").filter(Boolean);
      const pathSegments = path.split("/").filter(Boolean);

      if (routeSegments.length !== pathSegments.length) continue;

      const params: Record<string, string> = {};
      let isMatch = true;

      for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i];
        const pathSegment = pathSegments[i];

        if (!routeSegment || !pathSegment) {
          isMatch = false;
          break;
        }

        if (routeSegment.startsWith(":")) {
          params[routeSegment.slice(1)] = pathSegment;
        } else if (routeSegment !== pathSegment) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        return { handler: route.handler, params };
      }
    }

    return null;
  }

  get(path: string, handler: RouteHandler): void {
    this.routes.push({ method: "GET", path, handler });
  }

  post(path: string, handler: RouteHandler): void {
    this.routes.push({ method: "POST", path, handler });
  }

  put(path: string, handler: RouteHandler): void {
    this.routes.push({ method: "PUT", path, handler });
  }

  delete(path: string, handler: RouteHandler): void {
    this.routes.push({ method: "DELETE", path, handler });
  }

  patch(path: string, handler: RouteHandler): void {
    this.routes.push({ method: "PATCH", path, handler });
  }

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const match = this.matchRoute(req.method, url.pathname);

    if (!match) {
      return new Response(
        JSON.stringify({ success: false, error: "Not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      return await match.handler(req, match.params);
    } catch (error) {
      console.error("Route handler error:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
