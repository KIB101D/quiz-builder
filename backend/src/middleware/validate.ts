import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { HttpError } from '../lib/http-error.js';

type Source = 'body' | 'params' | 'query';

/**
 * Validates `req[source]` against a Zod schema.
 * Parsed (trimmed / coerced) data is stored in `res.locals[source]`
 * so controllers always work with typed, sanitized input.
 */
export const validate =
  (schema: z.ZodType, source: Source = 'body'): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        HttpError.badRequest(
          'Validation failed',
          result.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
        ),
      );
    }

    res.locals[source] = result.data;
    next();
  };
