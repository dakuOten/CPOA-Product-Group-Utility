/// <reference types="vite/client" />

// Zoho CRM Widget SDK types
declare global {
  interface Window {
    ZOHO?: {
      embeddedApp: {
        on(event: string, callback: (data: unknown) => void): void;
        init(): void;
      };
      CRM: {
        UI: {
          Resize(options: { height?: string; width?: string }): void;
        };
        API: {
          logError(error: { message: string; stack?: string }): void;
        };
      };
    };
  }
}
