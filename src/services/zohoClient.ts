// Zoho Client utility functions for widget operations
// Provides safe wrappers for Zoho $Client SDK methods

/**
 * Safely closes the Zoho widget with error handling
 * Uses the Zoho $Client.close method with exit: true
 * 
 * @param showToast - Optional function to show toast notifications
 */
export function closeZohoWidget(showToast?: (message: { title: string; description: string; variant?: 'default' | 'destructive' | 'success' | 'warning' }) => void) {
  try {
    if ($Client) {
      console.log('🔄 Closing Zoho widget...');
      $Client.close({ exit: true });
      console.log('✅ Widget close command sent successfully');
    } else {
      const errorMessage = 'Zoho $Client is not available. Unable to close widget.';
      console.warn('⚠️', errorMessage);
      
      if (showToast) {
        showToast({
          title: 'Close Failed',
          description: 'Widget close functionality is not available outside of Zoho CRM.',
          variant: 'warning'
        });
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Error closing widget:', error);
    
    if (showToast) {
      showToast({
        title: 'Close Error',
        description: `Failed to close widget: ${errorMessage}`,
        variant: 'destructive'
      });
    }
  }
}

/**
 * Checks if Zoho Client SDK is available
 * 
 * @returns boolean indicating if $Client is available
 */
export function isZohoClientAvailable(): boolean {
  return !!$Client;
}

/**
 * Gets the current status of the Zoho Client SDK for debugging purposes
 * 
 * @returns Object with Client availability status
 */
export function getZohoClientStatus() {
  return {
    clientExists: !!$Client,
    closeMethod: !!$Client?.close,
    isReady: isZohoClientAvailable()
  };
}
