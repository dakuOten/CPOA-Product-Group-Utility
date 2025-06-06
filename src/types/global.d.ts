// Global type declarations for Zoho CRM Widget SDK

interface ZohoEmbeddedApp {
  on(event: string, callback: (data: unknown) => void): void;
  init(): void;
}

interface ZohoCRM {
  UI: {
    Resize(options: { height?: string; width?: string }): void;
  };
  API: {
    logError(error: { message: string; stack?: string }): void;    updateRecord(options: {
      Entity: string;
      APIData: {
        id: string;
        [key: string]: unknown; // Allow dynamic properties like Subform_1
      };
      Trigger?: string[];
    }): Promise<{
      data: Array<{
        code: string;
        details: {
          Modified_Time: string;
          Modified_By: {
            name: string;
            id: string;
          };
          Created_Time: string;
          id: string;
        };
        message: string;
        status: string;
      }>;
    }>;
  };
}

interface ZohoClient {
  close(options: { exit: boolean }): void;
}

interface ZohoSDK {
  embeddedApp: ZohoEmbeddedApp;
  CRM: ZohoCRM;
}

declare global {
  interface Window {
    ZOHO?: ZohoSDK;
    $Client?: ZohoClient;
  }
  
  // Declare $Client as a global variable so it can be used directly
  const $Client: ZohoClient | undefined;
}

export {};
