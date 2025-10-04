export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Route {
  method: HttpMethod;
  path: string;
  handler: RouteHandler;
}

export type RouteHandler = (req: Request, params: Record<string, string>) => Promise<Response> | Response;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
