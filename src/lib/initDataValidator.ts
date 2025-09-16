import { 
  validate,
  parse, 
  AuthDateInvalidError,
  ExpiredError,
  SignatureInvalidError,
  SignatureMissingError
} from '@telegram-apps/init-data-node';

/**
 * Validates Telegram Mini App initialization data
 * @param initData - Raw init data string from Telegram
 * @param botToken - Bot token for validation
 * @param options - Validation options
 * @returns Parsed and validated init data
 */
export async function validateInitData(
  initData: string,
  botToken: string,
  options: {
    expiresIn?: number; // Expiration time in seconds (default: 86400 = 1 day)
  } = {}
) {
  try {
    // Set default expiration to 1 day if not specified
    const expiresIn = options.expiresIn ?? 86400;
    
    // Validate the signature and expiration
    await validate(initData, botToken, { expiresIn });
    
    // Parse the validated data
    const parsedData = parse(initData);
    
    console.log('✅ Init data validation successful');
    return {
      isValid: true,
      data: parsedData,
      error: null
    };
  } catch (error: any) {
    console.error('❌ Init data validation failed:', error.message);
    
    // Handle specific error types
    let errorType = 'UNKNOWN_ERROR';
    let errorMessage = 'Unknown validation error';
    
    if (error instanceof AuthDateInvalidError) {
      errorType = 'AUTH_DATE_INVALID';
      errorMessage = 'Authentication date is invalid or missing';
    } else if (error instanceof SignatureInvalidError) {
      errorType = 'SIGNATURE_INVALID';
      errorMessage = 'Signature is invalid';
    } else if (error instanceof SignatureMissingError) {
      errorType = 'SIGNATURE_MISSING';
      errorMessage = 'Signature is missing';
    } else if (error instanceof ExpiredError) {
      errorType = 'EXPIRED';
      errorMessage = 'Init data has expired';
    }
    
    return {
      isValid: false,
      data: null,
      error: {
        type: errorType,
        message: errorMessage,
        originalError: error.message
      }
    };
  }
}

/**
 * Simple validation check without throwing errors
 * @param initData - Raw init data string
 * @param botToken - Bot token for validation
 * @returns Boolean indicating validity
 */
export async function isValidInitData(
  initData: string,
  botToken: string
): Promise<boolean> {
  try {
    await validate(initData, botToken);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract user data from validated init data
 * @param initData - Raw init data string
 * @param botToken - Bot token for validation
 * @returns User data if valid, null otherwise
 */
export async function extractUserFromInitData(
  initData: string,
  botToken: string
) {
  const result = await validateInitData(initData, botToken);
  
  if (result.isValid && result.data?.user) {
    return {
      id: result.data.user.id,
      firstName: result.data.user.firstName,
      lastName: result.data.user.lastName,
      username: result.data.user.username,
      languageCode: result.data.user.languageCode,
      isPremium: result.data.user.isPremium,
      photoUrl: result.data.user.photoUrl
    };
  }
  
  return null;
}