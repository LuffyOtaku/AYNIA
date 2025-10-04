import type { ApiResponse } from '../types/http';

export class ResponseBuilder {
  static success<T>(data: T, message?: string): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static created<T>(data: T, message?: string): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static noContent(): Response {
    return new Response(null, { status: 204 });
  }

  static error(message: string, status: number = 400): Response {
    const response: ApiResponse = {
      success: false,
      error: message,
    };
    return new Response(JSON.stringify(response), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static notFound(message: string = 'Resource not found'): Response {
    return this.error(message, 404);
  }

  static unauthorized(message: string = 'Unauthorized'): Response {
    return this.error(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): Response {
    return this.error(message, 403);
  }

  static serverError(message: string = 'Internal server error'): Response {
    return this.error(message, 500);
  }
}
