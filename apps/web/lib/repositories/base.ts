import { PostgrestError } from "@supabase/supabase-js";

/**
 * Standard result type for repository operations
 * Follows the Result pattern for explicit error handling
 */
export type RepositoryResult<T> =
  | { data: T; error: null }
  | { data: null; error: RepositoryError };

/**
 * Custom error type for repository operations
 */
export interface RepositoryError {
  code: string;
  message: string;
  details?: string;
}

/**
 * Convert Supabase PostgrestError to RepositoryError
 */
export function toRepositoryError(error: PostgrestError): RepositoryError {
  return {
    code: error.code,
    message: error.message,
    details: error.details,
  };
}

/**
 * Create a success result
 */
export function success<T>(data: T): RepositoryResult<T> {
  return { data, error: null };
}

/**
 * Create an error result
 */
export function failure<T>(error: RepositoryError): RepositoryResult<T> {
  return { data: null, error };
}

/**
 * Create an error result from a PostgrestError
 */
export function failureFromPostgrest<T>(
  error: PostgrestError
): RepositoryResult<T> {
  return { data: null, error: toRepositoryError(error) };
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  UNKNOWN: "UNKNOWN",
} as const;

/**
 * Create common errors
 */
export const Errors = {
  notFound: (entity: string): RepositoryError => ({
    code: ErrorCodes.NOT_FOUND,
    message: `${entity} not found`,
  }),
  alreadyExists: (entity: string): RepositoryError => ({
    code: ErrorCodes.ALREADY_EXISTS,
    message: `${entity} already exists`,
  }),
  unauthorized: (): RepositoryError => ({
    code: ErrorCodes.UNAUTHORIZED,
    message: "Unauthorized",
  }),
  unknown: (message?: string): RepositoryError => ({
    code: ErrorCodes.UNKNOWN,
    message: message || "An unknown error occurred",
  }),
};
