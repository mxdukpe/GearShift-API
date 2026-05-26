import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const message = err.message || 'Internal server error';

  if (message.includes('not found')) {
    res.status(404).json({ error: message });
    return;
  }
  if (
    message.includes('not available') ||
    message.includes('Cannot') ||
    message.includes('already')
  ) {
    res.status(409).json({ error: message });
    return;
  }
  if (message.includes('Unknown pricing')) {
    res.status(400).json({ error: message });
    return;
  }

  res.status(500).json({ error: message });
}
