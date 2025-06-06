import { useEffect, useState, type ReactNode } from 'react'
import { type ZohoDealData } from '@/types/zoho'
import { 
  ZohoStateContext, 
  ZohoActionsContext, 
  type ZohoContextState, 
  type ZohoContextActions 
} from '@/contexts/ZohoContext'

interface ZohoProviderProps {
  readonly children: ReactNode
}

// Helper function to safely extract string values
const safeString = (value: unknown, defaultValue = ''): string => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'name' in value) {
    return String((value as Record<string, unknown>).name)
  }
  return defaultValue
}

// Helper function to safely extract nullable string values
const safeStringOrNull = (value: unknown): string | null => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'name' in value) {
    return String((value as Record<string, unknown>).name)
  }
  return null
}

// Helper function to safely extract user objects
const safeUser = (value: unknown, defaultName = 'Unknown'): { name: string; id: string } => {
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    return {
      name: safeString(obj.name || obj, defaultName),
      id: safeString(obj.id, 'unknown')
    }
  }  return { name: defaultName, id: 'unknown' }
}

// Helper function to safely extract numbers
const safeNumber = (value: unknown, defaultValue = 0): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? defaultValue : parsed
  }
  return defaultValue
}

// Helper function to safely extract subform data
const safeSubform = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

// Manual parser for Zoho data - bypassing Zod for now
const parseZohoDataManually = (data: unknown): ZohoDealData | null => {
  console.log('🔧 === STARTING MANUAL PARSING ===');
  console.log('🔧 Input data type:', typeof data);
  console.log('🔧 Input data:', data);
  
  const parsedData = data as Record<string, unknown> | null;
  if (!parsedData) {
    console.error('❌ Parsed data is null or undefined');
    return null;
  }

  console.log('🔧 Top-level keys:', Object.keys(parsedData));
  
  const dealData = parsedData.data as Record<string, unknown>;
  if (!dealData || typeof dealData !== 'object') {
    console.error('❌ No "data" field found or data field is not an object');
    console.error('❌ Available top-level fields:', Object.keys(parsedData));
    return null;
  }

  console.log('🔧 === MANUAL PARSING ===');
  console.log('🔧 Available deal data fields:', Object.keys(dealData));
  console.log('🔧 Deal ID:', dealData.id);
  console.log('🔧 Deal Name:', dealData.Deal_Name);
  console.log('🔧 Subform_1 type:', typeof dealData.Subform_1);
  console.log('🔧 Subform_1 content:', dealData.Subform_1);

  // Create a safe deal data object
  const safeDealData: ZohoDealData = {
    // Required fields
    id: safeString(dealData.id, 'unknown'),
    Deal_Name: safeString(dealData.Deal_Name, 'Unknown Deal'),
    
    // User objects
    Account_Name: safeUser(dealData.Account_Name, 'Unknown Account'),
    Owner: safeUser(dealData.Owner, 'Unknown Owner'),
    Created_By: safeUser(dealData.Created_By, 'Unknown Creator'),
    Modified_By: safeUser(dealData.Modified_By, 'Unknown Modifier'),
    
    // Financial fields
    Amount: safeNumber(dealData.Amount, 0),
    Currency: safeString(dealData.Currency, 'USD'),
    Exchange_Rate: safeString(dealData.Exchange_Rate, '1'),
    
    // Status fields
    Stage: safeString(dealData.Stage, 'Unknown'),
    Probability: safeNumber(dealData.Probability, 0),
    Closing_Date: safeString(dealData.Closing_Date, ''),      // Product subform
    Subform_1: safeSubform(dealData.Subform_1),
      // Additional fields - safely extract them
    Contract_ID_ADIVB_Number: safeStringOrNull(dealData.Contract_ID_ADIVB_Number),
    PM_Request_Id: safeStringOrNull(dealData.PM_Request_Id),
    Contract_Product: Boolean(dealData.Contract_Product),
    Group_Product: Boolean(dealData.Group_Product),
    
    // Dates
    Contract_Signed_Date: safeStringOrNull(dealData.Contract_Signed_Date),
    Counter_Signed_Date: safeStringOrNull(dealData.Counter_Signed_Date),
    Order_Handoff_Date: safeStringOrNull(dealData.Order_Handoff_Date),
    Project_Completed_Date: safeStringOrNull(dealData.Project_Completed_Date),
    Project_Completed: safeStringOrNull(dealData.Project_Completed),
    
    // Location fields
    Service_Street: safeStringOrNull(dealData.Service_Street),
    Service_City: safeStringOrNull(dealData.Service_City),
    Service_State: safeStringOrNull(dealData.Service_State),
    Service_Zip_Code: safeStringOrNull(dealData.Service_Zip_Code),
    Timezone: safeStringOrNull(dealData.Timezone),
    
    Street: safeStringOrNull(dealData.Street),
    City: safeStringOrNull(dealData.City),
    State: safeStringOrNull(dealData.State),
    Zip_Code1: safeStringOrNull(dealData.Zip_Code1),
    
    // Technical fields
    Circuit_Id: safeStringOrNull(dealData.Circuit_Id),
    MCN: safeStringOrNull(dealData.MCN),
    MAC_P: safeStringOrNull(dealData.MAC_P),
    Sub_Account_ID: safeStringOrNull(dealData.Sub_Account_ID),
    Federal_Tax_ID: safeStringOrNull(dealData.Federal_Tax_ID),
    
    // Service provider fields
    Internet_Provider_and_Speed_Free_Field: safeStringOrNull(dealData.Internet_Provider_and_Speed_Free_Field),
    Wireless_Carrier_and_Number_of_Lines_Free_Field: safeStringOrNull(dealData.Wireless_Carrier_and_Number_of_Lines_Free_Field),
    Phone_Provider_and_Number_of_Lines_Free_Field: safeStringOrNull(dealData.Phone_Provider_and_Number_of_Lines_Free_Field),
    Phone_System_Make_Model: safeStringOrNull(dealData.Phone_System_Make_Model),
    
    // Business fields
    Deal_Department: safeStringOrNull(dealData.Deal_Department),
    Deal_Type: safeStringOrNull(dealData.Deal_Type),
    Deal_Focus: safeStringOrNull(dealData.Deal_Focus),
    Lead_Type: safeStringOrNull(dealData.Lead_Type),
    Lead_Source: safeStringOrNull(dealData.Lead_Source),
    
    Product_Type: safeStringOrNull(dealData.Product_Type),
    Data_Interface_Type: safeStringOrNull(dealData.Data_Interface_Type),
    Curent_Services: safeStringOrNull(dealData.Curent_Services),
    Total_Wireline: safeStringOrNull(dealData.Total_Wireline),
    
    // Status flags
    Locked: Boolean(dealData.Locked),
    Is_Disconnected: Boolean(dealData.Is_Disconnected),
    Managed: safeStringOrNull(dealData.Managed),
    Voice_Handoff: safeStringOrNull(dealData.Voice_Handoff),
    
    Description: safeStringOrNull(dealData.Description),
    Layout_Name: safeStringOrNull(dealData.Layout_Name),
    Layout: safeStringOrNull(dealData.Layout),
    
    // Partner fields
    Partner_Vendor_1: safeUser(dealData.Partner_Vendor_1),
    Partner_Vendor_2: safeUser(dealData.Partner_Vendor_2),
      // Workflow fields
    Validated_By: safeStringOrNull(dealData.Validated_By),
    Processed_By: safeStringOrNull(dealData.Processed_By),
    Order_Validation_Link: safeStringOrNull(dealData.Order_Validation_Link),
    
    // Integration
    zohoworkdriveforcrm__Workdrive_Folder_URL: safeStringOrNull(dealData.zohoworkdriveforcrm__Workdrive_Folder_URL),
    
    // System flags
    Testing_trigger: Boolean(dealData.Testing_trigger),
    Developer_Space: Boolean(dealData.Developer_Space),
    
    // Sales fields
    Sales_Traction: safeStringOrNull(dealData.Sales_Traction),
    Forecast_Category__s: safeStringOrNull(dealData.Forecast_Category__s),
    
    Account_Number: safeStringOrNull(dealData.Account_Number),
    Campaign: safeStringOrNull(dealData.Campaign),
    Email_Marketing_Status: safeStringOrNull(dealData.Email_Marketing_Status),
    
    // Technical specs
    With_Call_Paths: safeStringOrNull(dealData.With_Call_Paths),
    Porting_Moving_TNs: Boolean(dealData.Porting_Moving_TNs),
    
    // Disconnect reasons
    Previous_Deal_Disconnect: safeStringOrNull(dealData.Previous_Deal_Disconnect),
    Reason_for_Closed_Lost1: safeStringOrNull(dealData.Reason_for_Closed_Lost1),
  }
  console.log('✅ Manual parsing successful')
  return safeDealData
}

export const ZohoProvider = ({ children }: ZohoProviderProps) => {
  const [state, setState] = useState<ZohoContextState>({
    isZohoReady: false,
    dealData: null,
    error: null,
    loading: true,
    rawPageLoadData: null,
  } as const)
  // Initialize Zoho SDK and handle PageLoad event using modern async patterns
  useEffect(() => {
    const initializeZoho = async () => {
      console.log('🔄 Initializing Zoho SDK...')
      console.log('Window.ZOHO available:', !!window.ZOHO)
      console.log('EmbeddedApp available:', !!window.ZOHO?.embeddedApp)
      
      if (!window.ZOHO) {
        console.error('❌ ZOHO SDK not available')
        setState(prev => ({
          ...prev,
          error: 'ZOHO SDK not available',
          loading: false,
        }))
        return
      }

      try {
        console.log('📋 Setting up PageLoad event listener...')
        
        // Subscribe to PageLoad event before initialization
        window.ZOHO.embeddedApp.on('PageLoad', (data: unknown) => {
          console.log('🎯 === ZOHO PAGELOAD EVENT TRIGGERED ===')
          console.log('📊 PageLoad data type:', typeof data)
          console.log('📊 PageLoad data received:', JSON.stringify(data, null, 2))
          console.log('📊 Raw data keys:', data && typeof data === 'object' ? Object.keys(data as Record<string, unknown>) : 'No keys')
          
          // Use manual parsing instead of Zod for now
          const dealData = parseZohoDataManually(data)
          
          setState(prev => ({
            ...prev,
            isZohoReady: true,
            dealData,
            rawPageLoadData: data as Record<string, unknown>,
            error: dealData ? null : 'Failed to parse deal data',
            loading: false,
          }))
          
          console.log('✅ === ZOHO CONTEXT UPDATED ===')
          console.log('✅ Deal Data:', dealData)
          console.log('✅ Raw Page Load Data stored:', !!data)
          
          // Resize widget for better visibility - set to 50% width
          if (window.ZOHO?.CRM?.UI?.Resize) {
            try {
              window.ZOHO.CRM.UI.Resize({
                height: '100%',
                width: '50%',
              })
              console.log('Widget resized to 50% width successfully')
            } catch (error: unknown) {
              console.error('Error resizing widget:', error)
            }
          }        })

        // Add additional event listeners for debugging
        console.log('📋 Setting up additional event listeners for debugging...')
          // Listen for any other events that might be fired
        const eventTypes = ['EntityInfo', 'Error', 'Ready', 'Load'];
        eventTypes.forEach(eventType => {
          window.ZOHO?.embeddedApp?.on(eventType, (data: unknown) => {
            console.log(`🔍 Event: ${eventType}`, data);
          });
        });

        // Initialize the EmbeddedApp
        console.log('🚀 Calling ZOHO.embeddedApp.init()...')
        window.ZOHO.embeddedApp.init()
        console.log('✅ ZOHO EmbeddedApp initialized successfully')
          // Set a timeout to check if PageLoad event fired
        setTimeout(() => {
          setState(currentState => {
            if (!currentState.isZohoReady && !currentState.error) {
              console.warn('⚠️ PageLoad event has not fired after 5 seconds')
              console.warn('⚠️ This might indicate the widget is not properly embedded in Zoho CRM')
              console.warn('⚠️ Attempting alternative data fetching methods...')
              
              // Try alternative approach - check if we're in development
              if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                console.warn('🔄 Development mode detected - providing mock data for testing')
                const mockData = {
                  data: {
                    id: 'mock-deal-123',
                    Deal_Name: 'Mock Deal for Development',
                    Account_Name: { name: 'Mock Account', id: 'mock-account-123' },
                    Owner: { name: 'Mock Owner', id: 'mock-owner-123' },
                    Created_By: { name: 'Mock Creator', id: 'mock-creator-123' },
                    Modified_By: { name: 'Mock Modifier', id: 'mock-modifier-123' },
                    Subform_1: [
                      {
                        Products: { name: 'Mock Product 1', id: 'mock-product-1' },
                        Product_Type2: 'Software',
                        Is_Contract: true,
                        Product_Grouping: null,
                        Quantity: 1,
                        Terms: 'Co-Terminus',
                        Unit_Price: 100,
                        Total_Pricing: 100,
                        Vendor: 'Mock Vendor'
                      }
                    ]
                  }
                };
                
                const dealData = parseZohoDataManually(mockData);
                return {
                  ...currentState,
                  isZohoReady: true,
                  dealData,
                  rawPageLoadData: mockData as Record<string, unknown>,
                  error: null,
                  loading: false,
                };
              }
              
              return {
                ...currentState,
                error: 'PageLoad event timeout - Widget may not be embedded in Zoho CRM context',
                loading: false,
              };
            }
            return currentState;
          });
        }, 5000)
        
      } catch (error) {
        console.error('Error initializing ZOHO EmbeddedApp:', error)
        setState(prev => ({
          ...prev,
          error: `Failed to initialize Zoho: ${error instanceof Error ? error.message : 'Unknown error'}`,
          loading: false,
        }))
      }
    }    // Check if ZOHO SDK is available with retry mechanism using modern syntax
    const checkZohoAvailability = () => {
      console.log('🔍 Checking ZOHO SDK availability...')
      console.log('🔍 Window.ZOHO:', !!window.ZOHO)
      console.log('🔍 Window.ZOHO.embeddedApp:', !!window.ZOHO?.embeddedApp)
      
      if (window.ZOHO?.embeddedApp) {
        console.log('✅ ZOHO SDK available, initializing...')
        initializeZoho()
      } else {
        console.log('⏳ ZOHO SDK not yet available, retrying in 100ms...')
        setTimeout(checkZohoAvailability, 100)
      }
    }

    console.log('🎬 Starting ZOHO availability check...')
    checkZohoAvailability()
  }, [])

  // Context actions using modern function declarations
  const refreshData = () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Reload the widget to get fresh data
      window.location.reload()
    } catch (error) {
      console.error('Error refreshing data:', error)
      setState(prev => ({
        ...prev,
        error: 'Failed to refresh data',
        loading: false,
      }))
    }
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  const actions: ZohoContextActions = {
    refreshData,
    clearError,
  } as const

  return (
    <ZohoStateContext.Provider value={state}>
      <ZohoActionsContext.Provider value={actions}>
        {children}
      </ZohoActionsContext.Provider>
    </ZohoStateContext.Provider>
  )
}
