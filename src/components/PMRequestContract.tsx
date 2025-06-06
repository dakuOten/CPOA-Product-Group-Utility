import { useProductManagement } from '@/hooks/useProductManagement'
import { useZoho } from '@/providers/useZoho'
import PMRequestHeader from './pmRequestContract/PMRequestHeader'
import PMRequestStatusIndicators from './pmRequestContract/PMRequestStatusIndicators'
import PMRequestForm from './pmRequestContract/PMRequestForm'
import PMRequestDataInspector from './pmRequestContract/PMRequestDataInspector'
import ZohoDebugPanel from './ZohoDebugPanel'

export default function PMRequestContract() {  const {
    dealId,
    products,
    editableProducts,
    handleProductGroupingChange,
    // updateSingleProductGrouping, // Available for future use - individual product updates
    handleSubmitForm,
    isApiAvailable,
  } = useProductManagement()

  const { error, rawPageLoadData, refreshData } = useZoho()

  // Helper function to check if a value is a record
  const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  // Helper function to safely get string values
  const getString = (obj: Record<string, unknown>, key: string): string => {
    return typeof obj[key] === 'string' ? obj[key] : String(obj[key] || '')
  }

  // Helper function to get nested string values
  const getNestedString = (obj: Record<string, unknown>, key: string, nestedKey: string): string => {
    const nested = obj[key] as Record<string, unknown>
    return nested && typeof nested[nestedKey] === 'string' ? nested[nestedKey] : ''
  }
  return (
    <div className="h-screen bg-gray-50 p-2 sm:p-3 md:p-4 overflow-hidden">
      <div className="h-full w-[90%] max-w-none mx-auto flex flex-col space-y-3 sm:space-y-4">
        <PMRequestHeader onRefresh={refreshData} />
        
        <PMRequestStatusIndicators
          error={error}
          rawPageLoadData={rawPageLoadData}
          isRecord={isRecord}
          getString={getString}
          getNestedString={getNestedString}
        /><PMRequestForm
          editableProducts={editableProducts}
          dealId={dealId}
          handleSubmitForm={handleSubmitForm}
          handleProductGroupingChange={handleProductGroupingChange}
          isApiAvailable={isApiAvailable}
        />
        
        <PMRequestDataInspector
          products={products}
          rawPageLoadData={rawPageLoadData}
          editableProducts={editableProducts}
          dealId={dealId}
          isRecord={isRecord}
        />
        
        {/* Debug Panel - Moved under products for troubleshooting */}
        <ZohoDebugPanel />
      </div>
    </div>
  )
}
