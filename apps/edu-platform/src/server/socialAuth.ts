import { generateToken } from './auth';

/**
 * Handle the common social authentication flow across providers
 * @param email The verified email from the OAuth provider
 * @param env The runtime environment variables
 * @returns Result of the authentication process
 */
export async function handleSocialAuth(
  email: string,
  env: Record<string, unknown>
): Promise<{ success: boolean; token?: string; error?: string }> {
  const { JWT_SECRET } = env as {
    JWT_SECRET: string;
  };

  // Validate required environment variables
  if (!JWT_SECRET) {
    console.error('Social auth error: Missing JWT_SECRET');
    return {
      success: false,
      error: 'AUTH_CONFIG_ERROR',
    };
  }

  // Validate email format
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    console.error('Social auth error: Invalid email format', { email });
    return {
      success: false,
      error: 'INVALID_EMAIL',
    };
  }

  try {
    // Generate JWT token for direct authentication
    const token = await generateToken(email, JWT_SECRET);

    if (!token) {
      console.error('Failed to generate JWT token');
      return {
        success: false,
        error: 'TOKEN_GENERATION_ERROR',
      };
    }

    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error('Social auth error:', error);
    return {
      success: false,
      error: 'OAUTH_ERROR',
    };
  }
}
