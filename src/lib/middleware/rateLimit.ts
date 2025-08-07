import { NextRequest } from 'next/server';

// Simple in-memory rate limiter
// In production, you'd want to use Redis or a similar solution
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

export async function rateLimit(
  request: NextRequest,
  options: {
    limit?: number;
    windowMs?: number;
  } = {}
): Promise<RateLimitResult> {
  const limit = options.limit || 10; // 10 requests per window
  const windowMs = options.windowMs || 60 * 1000; // 1 minute window

  // Get client identifier (IP address)
  const clientId = getClientId(request);
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(clientId);
  
  if (!entry || now > entry.resetTime) {
    // Create new window
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(clientId, entry);
    
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: entry.resetTime,
    };
  }

  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(clientId, entry);

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

function getClientId(request: NextRequest): string {
  // Try to get real IP from various headers (for production with proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to a default identifier
  return 'unknown-client';
} 