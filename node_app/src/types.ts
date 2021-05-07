import { Request } from 'express';

/**
 * An Express Request with a buffer containing the raw HTTP body
 */
export interface RequestWithRawBody extends Request {
  /** The raw HTTP body */
  rawBody: Buffer;
}
