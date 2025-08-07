/**
 * Validation middleware for API endpoints
 * Provides request validation and error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { ValidationError } from '@/lib/database/validation';

// Middleware wrapper for validation
export function withValidation<T>(
  validator: (data: Record<string, unknown>) => T,
  handler: (req: NextRequest, validatedData: T) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const body = await req.json();
      const validatedData = validator(body);
      return await handler(req, validatedData);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: error.message,
            field: error.field,
          },
          { status: 400 }
        );
      }
      
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          {
            error: 'Invalid JSON',
            message: 'Request body must be valid JSON',
          },
          { status: 400 }
        );
      }
      
      console.error('Validation middleware error:', error);
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
        },
        { status: 500 }
      );
    }
  };
}

// Error response helper
export function createValidationErrorResponse(error: ValidationError): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation Error',
      message: error.message,
      field: error.field,
    },
    { status: 400 }
  );
}

// Success response helper
export function createSuccessResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

// Generic validation handler
export async function handleValidatedRequest<TInput, TOutput>(
  req: NextRequest,
  validator: (data: Record<string, unknown>) => TInput,
  handler: (validatedData: TInput) => Promise<TOutput>
): Promise<NextResponse> {
  try {
    const body = await req.json();
    const validatedData = validator(body);
    const result = await handler(validatedData);
    
    return createSuccessResponse(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return createValidationErrorResponse(error);
    }
    
    console.error('Request handling error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}