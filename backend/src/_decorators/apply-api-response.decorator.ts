// src/common/decorators/global-api-responses.decorator.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ApplyApiResponse(codes: number[]) {
  const decorators = codes.map((code) => {
    switch (code) {
      case 200:
        return ApiResponse({
          status: 200,
          description: 'OK',
          schema: {
            example: {
              statusCode: 200,
              message: 'Success',
              data: {},
            },
          },
        });

      case 201:
        return ApiResponse({
          status: 201,
          description: 'Created',
          schema: {
            example: {
              statusCode: 201,
              message: 'Resource created successfully',
              data: {},
            },
          },
        });

      case 400:
        return ApiBadRequestResponse({
          description: 'Bad request',
          schema: {
            example: {
              statusCode: 400,
              message: 'Error',
              error: 'Bad Request',
            },
          },
        });

      case 401:
        return ApiUnauthorizedResponse({
          description: 'Unauthorized',
          schema: {
            example: {
              statusCode: 401,
              message: 'Invalid, malformed, or expired token',
              error: 'Unauthorized',
            },
          },
        });

      case 403:
        return ApiForbiddenResponse({
          description: 'Forbidden',
          schema: {
            example: {
              statusCode: 403,
              message:
                'The action you are trying to perform is not allowed or just cannot be done',
              error: 'Forbidden',
            },
          },
        });

      case 404:
        return ApiNotFoundResponse({
          description: 'Not found',
          schema: {
            example: {
              statusCode: 404,
              message: 'Resource not found',
              error: 'Not Found',
            },
          },
        });

      case 500:
        return ApiInternalServerErrorResponse({
          description: 'Internal server error',
          schema: {
            example: {
              statusCode: 500,
              message: 'Something went wrong',
              error: 'Internal Server Error',
            },
          },
        });
      default:
        return ApiResponse({
          status: code,
          description: `HTTP ${code}`,
          schema: {
            example: {
              statusCode: code,
              message: `Error ${code}`,
              error: 'Error',
            },
          },
        });
    }
  });

  return applyDecorators(...decorators);
}
