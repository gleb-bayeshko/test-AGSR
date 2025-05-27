// Методы и константы для унифицированного формата ответов

import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  error: string | null;
  data: T | null;
  status: HttpStatus;
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,

  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,

  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

export function createResponse<T>(
  data: T,
  status: HttpStatus = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      error: null,
      data,
      status,
    },
    { status }
  );
}

export function createErrorResponse(
  error: string,
  status: HttpStatus = 500
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error,
      data: null,
      status,
    },
    { status }
  );
}
