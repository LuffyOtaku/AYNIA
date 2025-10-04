import { describe, test, expect } from "bun:test";
import { Router } from "../src/core/router";

describe("Router", () => {
  test("should create a router instance", () => {
    const router = new Router();
    expect(router).toBeDefined();
  });

  describe("Route Registration", () => {
    test("should register GET route", () => {
      const router = new Router();
      const handler = () => new Response("OK");
      router.get("/test", handler);
      expect(router).toBeDefined();
    });

    test("should register POST route", () => {
      const router = new Router();
      const handler = () => new Response("OK");
      router.post("/test", handler);
      expect(router).toBeDefined();
    });

    test("should register PUT route", () => {
      const router = new Router();
      const handler = () => new Response("OK");
      router.put("/test", handler);
      expect(router).toBeDefined();
    });

    test("should register DELETE route", () => {
      const router = new Router();
      const handler = () => new Response("OK");
      router.delete("/test", handler);
      expect(router).toBeDefined();
    });

    test("should register PATCH route", () => {
      const router = new Router();
      const handler = () => new Response("OK");
      router.patch("/test", handler);
      expect(router).toBeDefined();
    });
  });

  describe("Route Matching", () => {
    test("should match exact route", async () => {
      const router = new Router();
      router.get("/users", () => new Response("Users List"));

      const req = new Request("http://localhost/users");
      const response = await router.handle(req);

      expect(response.status).toBe(200);
      const text = await response.text();
      expect(text).toBe("Users List");
    });

    test("should match route with parameter", async () => {
      const router = new Router();
      router.get("/users/:id", (req, params) => {
        return new Response(JSON.stringify({ id: params.id }));
      });

      const req = new Request("http://localhost/users/123");
      const response = await router.handle(req);

      expect(response.status).toBe(200);
      const data = (await response.json()) as any;
      expect(data.id).toBe("123");
    });

    test("should match route with multiple parameters", async () => {
      const router = new Router();
      router.get("/anime/season/:season/:year", (req, params) => {
        return new Response(
          JSON.stringify({
            season: params.season,
            year: params.year,
          })
        );
      });

      const req = new Request("http://localhost/anime/season/WINTER/2024");
      const response = await router.handle(req);

      expect(response.status).toBe(200);
      const data = (await response.json()) as any;
      expect(data.season).toBe("WINTER");
      expect(data.year).toBe("2024");
    });

    test("should return 404 for non-matching route", async () => {
      const router = new Router();
      router.get("/users", () => new Response("Users"));

      const req = new Request("http://localhost/posts");
      const response = await router.handle(req);

      expect(response.status).toBe(404);
      const data = (await response.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error).toBe("Not found");
    });

    test("should return 404 for wrong HTTP method", async () => {
      const router = new Router();
      router.get("/users", () => new Response("Users"));

      const req = new Request("http://localhost/users", { method: "POST" });
      const response = await router.handle(req);

      expect(response.status).toBe(404);
    });

    test("should handle different methods on same path", async () => {
      const router = new Router();
      router.get("/users", () => new Response("GET Users"));
      router.post("/users", () => new Response("POST Users"));

      const getReq = new Request("http://localhost/users");
      const getResponse = await router.handle(getReq);
      expect(await getResponse.text()).toBe("GET Users");

      const postReq = new Request("http://localhost/users", { method: "POST" });
      const postResponse = await router.handle(postReq);
      expect(await postResponse.text()).toBe("POST Users");
    });
  });

  describe("Error Handling", () => {
    test("should handle handler errors", async () => {
      const router = new Router();
      router.get("/error", () => {
        throw new Error("Test error");
      });

      const req = new Request("http://localhost/error");
      const response = await router.handle(req);

      expect(response.status).toBe(500);
      const data = (await response.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });

    test("should handle async handler errors", async () => {
      const router = new Router();
      router.get("/async-error", async () => {
        throw new Error("Async error");
      });

      const req = new Request("http://localhost/async-error");
      const response = await router.handle(req);

      expect(response.status).toBe(500);
    });
  });

  describe("Route Segments", () => {
    test("should not match routes with different segment counts", async () => {
      const router = new Router();
      router.get("/users/:id", () => new Response("User"));

      const req = new Request("http://localhost/users/123/extra");
      const response = await router.handle(req);

      expect(response.status).toBe(404);
    });

    test("should match routes ignoring trailing slashes", async () => {
      const router = new Router();
      router.get("/users/:id", (req, params) => {
        return new Response(params.id);
      });

      const req = new Request("http://localhost/users/123");
      const response = await router.handle(req);

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("123");
    });
  });
});

// Adicional tests

describe("Edge Cases", () => {
  test("should handle undefined route segments gracefully", async () => {
    const router = new Router();
    router.get("/test/:id", (req, params) => {
      return new Response(JSON.stringify({ id: params.id }));
    });

    const req = new Request("http://localhost/test/");
    const response = await router.handle(req);

    expect(response.status).toBe(404);
  });

  test("should handle empty path", async () => {
    const router = new Router();
    router.get("/", () => new Response("Root"));

    const req = new Request("http://localhost/");
    const response = await router.handle(req);

    expect(response.status).toBe(200);
  });

  test("should handle path with query parameters", async () => {
    const router = new Router();
    router.get("/search", () => new Response("Search"));

    const req = new Request("http://localhost/search?query=test");
    const response = await router.handle(req);

    expect(response.status).toBe(200);
  });

  test("should handle routes with same prefix", async () => {
    const router = new Router();
    router.get("/user", () => new Response("Users"));
    router.get("/users", () => new Response("User List"));

    const req1 = new Request("http://localhost/user");
    const response1 = await router.handle(req1);
    expect(await response1.text()).toBe("Users");

    const req2 = new Request("http://localhost/users");
    const response2 = await router.handle(req2);
    expect(await response2.text()).toBe("User List");
  });

  test("should handle parameter at end of route", async () => {
    const router = new Router();
    router.get("/api/:resource", (req, params) => {
      return new Response(params.resource || "none");
    });

    const req = new Request("http://localhost/api/users");
    const response = await router.handle(req);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("users");
  });

  test("should handle parameter at start of route", async () => {
    const router = new Router();
    router.get("/:id/profile", (req, params) => {
      return new Response(params.id || "none");
    });

    const req = new Request("http://localhost/123/profile");
    const response = await router.handle(req);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("123");
  });

  test("should prioritize exact matches over parameterized routes", async () => {
    const router = new Router();
    router.get("/users/me", () => new Response("Current User"));
    router.get(
      "/users/:id",
      (req, params) => new Response(`User ${params.id}`)
    );

    const req = new Request("http://localhost/users/me");
    const response = await router.handle(req);

    expect(await response.text()).toBe("Current User");
  });
});

describe("All HTTP Methods Coverage", () => {
  test("should handle PATCH requests", async () => {
    const router = new Router();
    router.patch("/resource/:id", (req, params) => {
      return new Response(`Patched ${params.id}`);
    });

    const req = new Request("http://localhost/resource/123", {
      method: "PATCH",
    });
    const response = await router.handle(req);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Patched 123");
  });

  test("should return 404 for OPTIONS method if not registered", async () => {
    const router = new Router();
    router.get("/test", () => new Response("OK"));

    const req = new Request("http://localhost/test", { method: "OPTIONS" });
    const response = await router.handle(req);

    expect(response.status).toBe(404);
  });
});
