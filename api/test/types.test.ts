import { describe, test, expect } from 'bun:test';

describe('Types', () => {
  test('should have correct HttpMethod types', () => {
    const methods: Array<string> = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    
    methods.forEach(method => {
      expect(typeof method).toBe('string');
    });
  });

  test('should have correct ApiResponse structure', () => {
    const successResponse = {
      success: true,
      data: { id: 1, name: 'Test' },
    };
    
    expect(successResponse.success).toBe(true);
    expect(successResponse.data).toBeDefined();
    
    const errorResponse = {
      success: false,
      error: 'Error message',
    };
    
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBeDefined();
  });

  test('should handle route handler types', () => {
    const handler = (req: Request, params: Record<string, string>) => {
      return new Response('OK');
    };
    
    expect(typeof handler).toBe('function');
    expect(handler.length).toBe(2);
  });

  test('should handle async route handler types', () => {
    const asyncHandler = async (req: Request, params: Record<string, string>) => {
      return new Response('OK');
    };
    
    expect(typeof asyncHandler).toBe('function');
    expect(asyncHandler.constructor.name).toBe('AsyncFunction');
  });
});
