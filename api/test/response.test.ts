import { describe, test, expect } from "bun:test";
import { ResponseBuilder } from "../src/utils/response";

describe("ResponseBuilder", () => {
  describe("success()", () => {
    test("should create success response with data", async () => {
      const data = { id: 1, name: "Test" };
      const response = ResponseBuilder.success(data);

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("application/json");

      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data).toEqual(data);
    });

    test("should create success response with message", async () => {
      const data = { id: 1 };
      const message = "Operation successful";
      const response = ResponseBuilder.success(data, message);

      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data).toEqual(data);
      expect(json.message).toBe(message);
    });

    test("should handle null data", async () => {
      const response = ResponseBuilder.success(null);

      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data).toBe(null);
    });

    test("should handle array data", async () => {
      const data = [1, 2, 3];
      const response = ResponseBuilder.success(data);

      const json = (await response.json()) as any;
      expect(json.data).toEqual(data);
    });
  });

  describe("created()", () => {
    test("should create 201 response", async () => {
      const data = { id: 1, name: "New Item" };
      const response = ResponseBuilder.created(data);

      expect(response.status).toBe(201);

      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data).toEqual(data);
    });

    test("should create 201 response with message", async () => {
      const data = { id: 1 };
      const message = "Resource created";
      const response = ResponseBuilder.created(data, message);

      const json = (await response.json()) as any;
      expect(json.message).toBe(message);
    });
  });

  describe("noContent()", () => {
    test("should create 204 response", () => {
      const response = ResponseBuilder.noContent();

      expect(response.status).toBe(204);
    });

    test("should have no body", async () => {
      const response = ResponseBuilder.noContent();
      const text = await response.text();

      expect(text).toBe("");
    });
  });

  describe("error()", () => {
    test("should create error response with default status", async () => {
      const message = "Something went wrong";
      const response = ResponseBuilder.error(message);

      expect(response.status).toBe(400);

      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error).toBe(message);
    });

    test("should create error response with custom status", async () => {
      const message = "Custom error";
      const status = 418;
      const response = ResponseBuilder.error(message, status);

      expect(response.status).toBe(418);

      const json = (await response.json()) as any;
      expect(json.error).toBe(message);
    });
  });

  describe("notFound()", () => {
    test("should create 404 response with default message", async () => {
      const response = ResponseBuilder.notFound();

      expect(response.status).toBe(404);

      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error).toBe("Resource not found");
    });

    test("should create 404 response with custom message", async () => {
      const message = "User not found";
      const response = ResponseBuilder.notFound(message);

      const json = (await response.json()) as any;
      expect(json.error).toBe(message);
    });
  });

  describe("unauthorized()", () => {
    test("should create 401 response with default message", async () => {
      const response = ResponseBuilder.unauthorized();

      expect(response.status).toBe(401);

      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error).toBe("Unauthorized");
    });

    test("should create 401 response with custom message", async () => {
      const message = "Invalid credentials";
      const response = ResponseBuilder.unauthorized(message);

      const json = (await response.json()) as any;
      expect(json.error).toBe(message);
    });
  });

  describe("forbidden()", () => {
    test("should create 403 response with default message", async () => {
      const response = ResponseBuilder.forbidden();

      expect(response.status).toBe(403);

      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error).toBe("Forbidden");
    });

    test("should create 403 response with custom message", async () => {
      const message = "Access denied";
      const response = ResponseBuilder.forbidden(message);

      const json = (await response.json()) as any;
      expect(json.error).toBe(message);
    });
  });

  describe("serverError()", () => {
    test("should create 500 response with default message", async () => {
      const response = ResponseBuilder.serverError();

      expect(response.status).toBe(500);

      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error).toBe("Internal server error");
    });

    test("should create 500 response with custom message", async () => {
      const message = "Database connection failed";
      const response = ResponseBuilder.serverError(message);

      const json = (await response.json()) as any;
      expect(json.error).toBe(message);
    });
  });

  describe("Content-Type header", () => {
    test("all responses should have application/json content type", async () => {
      const responses = [
        ResponseBuilder.success({ test: true }),
        ResponseBuilder.created({ test: true }),
        ResponseBuilder.error("Error"),
        ResponseBuilder.notFound(),
        ResponseBuilder.unauthorized(),
        ResponseBuilder.forbidden(),
        ResponseBuilder.serverError(),
      ];

      for (const response of responses) {
        expect(response.headers.get("Content-Type")).toBe("application/json");
      }
    });
  });
});

describe("Edge Cases", () => {
  test("should handle undefined data in success", async () => {
    const response = ResponseBuilder.success(undefined);
    const json = (await response.json()) as any;

    expect(json.success).toBe(true);
    expect(json.data).toBeUndefined();
  });

  test("should handle empty string in error", async () => {
    const response = ResponseBuilder.error("");
    const json = (await response.json()) as any;

    expect(json.success).toBe(false);
    expect(json.error).toBe("");
  });

  test("should handle complex nested data", async () => {
    const complexData = {
      user: {
        id: 1,
        profile: {
          name: "Test",
          preferences: {
            theme: "dark",
            notifications: true,
          },
        },
      },
    };

    const response = ResponseBuilder.success(complexData);
    const json = (await response.json()) as any;

    expect(json.data.user.profile.preferences.theme).toBe("dark");
  });

  test("should handle success with empty message", async () => {
    const response = ResponseBuilder.success({ id: 1 }, "");
    const json = (await response.json()) as any;

    expect(json.message).toBe("");
  });

  test("should handle created with null data", async () => {
    const response = ResponseBuilder.created(null);
    const json = (await response.json()) as any;

    expect(json.success).toBe(true);
    expect(json.data).toBe(null);
  });

  test("should handle very long error messages", async () => {
    const longMessage = "Error ".repeat(1000);
    const response = ResponseBuilder.error(longMessage);
    const json = (await response.json()) as any;

    expect(json.error).toBe(longMessage);
  });

  test("should handle special characters in messages", async () => {
    const specialMessage =
      'Error: <script>alert("XSS")</script> & "quotes" & \'apostrophes\'';
    const response = ResponseBuilder.error(specialMessage);
    const json = (await response.json()) as any;

    expect(json.error).toBe(specialMessage);
  });

  test("should handle unicode in messages", async () => {
    const unicodeMessage = "エラー: ユーザーが見つかりません 🚫";
    const response = ResponseBuilder.notFound(unicodeMessage);
    const json = (await response.json()) as any;

    expect(json.error).toBe(unicodeMessage);
  });

  test("should handle boolean data", async () => {
    const response = ResponseBuilder.success(true);
    const json = (await response.json()) as any;

    expect(json.data).toBe(true);
  });

  test("should handle number data", async () => {
    const response = ResponseBuilder.success(42);
    const json = (await response.json()) as any;

    expect(json.data).toBe(42);
  });

  test("should handle empty array", async () => {
    const response = ResponseBuilder.success([]);
    const json = (await response.json()) as any;

    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBe(0);
  });

  test("should handle Date objects", async () => {
    const date = new Date();
    const response = ResponseBuilder.success({ date });
    const json = (await response.json()) as any;

    expect(json.data.date).toBeDefined();
  });

  test("should verify all response methods are accessible", () => {
    expect(typeof ResponseBuilder.success).toBe("function");
    expect(typeof ResponseBuilder.created).toBe("function");
    expect(typeof ResponseBuilder.noContent).toBe("function");
    expect(typeof ResponseBuilder.error).toBe("function");
    expect(typeof ResponseBuilder.notFound).toBe("function");
    expect(typeof ResponseBuilder.unauthorized).toBe("function");
    expect(typeof ResponseBuilder.forbidden).toBe("function");
    expect(typeof ResponseBuilder.serverError).toBe("function");
  });
});
