import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  type: string;
  quantity?: number;
  terms?: string;
  unitPrice?: number;
  totalPricing?: number | string;
  vendor?: string | null;
  productGrouping?: string | null;
  dealId: string;
  isContract?: boolean;
}

interface PMRequestFormProps {
  editableProducts: Product[];
  dealId: string;
  handleSubmitForm: (e: React.FormEvent) => void;
  handleProductGroupingChange: (index: number, value: string) => void;
  isApiAvailable?: boolean;
}

export default function PMRequestForm({
  editableProducts,
  dealId,
  handleSubmitForm,
  handleProductGroupingChange,
  isApiAvailable = false,
}: PMRequestFormProps) {  return (
    <form onSubmit={handleSubmitForm} className="bg-white rounded-lg border shadow-sm flex-1 min-h-0 flex flex-col">      <div className="flex-1 overflow-y-auto p-2 sm:p-3 max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {editableProducts.length === 0 ? (
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-gray-600 text-xs sm:text-sm mb-3">
              No products found. Check the raw data section below for debugging.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Scroll indicator for many products */}
            {editableProducts.length > 5 && (
              <div className="sticky top-0 bg-blue-50 border border-blue-200 rounded p-2 mb-3 z-10">
                <p className="text-xs text-blue-700 text-center">
                  📋 {editableProducts.length} products available - scroll to view all
                </p>
              </div>
            )}            {/* Table Header - Sticky */}
            <div className="sticky top-0 bg-gray-100 border-b-2 border-gray-300 px-3 py-2 grid grid-cols-9 gap-2 text-xs font-semibold text-gray-700 z-10">
              <div>Group</div>
              <div className="col-span-2">Product Name</div>
              <div>Type</div>
              <div>Qty</div>
              <div>Terms</div>
              <div>Unit Price</div>
              <div>Total</div>
              <div>Vendor</div>
            </div>            {/* Product Rows */}
            {editableProducts.map((product, index) => (
              <div key={product.id} className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="grid grid-cols-9 gap-2 items-center text-xs">
                  {/* Product Grouping - EDITABLE */}
                  <div className="flex justify-center">
                    <input
                      type="text"
                      value={product.productGrouping || ''}
                      onChange={(e) => {
                        const sanitizedValue = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                        handleProductGroupingChange(index, sanitizedValue);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-center font-medium focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                      style={{ width: '35px' }}
                      maxLength={1}
                      placeholder="A"
                      title="Enter product grouping (A-Z)"
                    />
                  </div>
                  
                  {/* Product Name */}                  <div className="col-span-2">
                    <span className="font-medium text-gray-800 truncate block" title={product.name}>
                      {product.name}
                    </span>
                  </div>
                  
                  {/* Type */}
                  <div className="truncate" title={product.type}>{product.type}</div>
                  
                  {/* Quantity */}
                  <div className="text-center">{product.quantity}</div>
                  
                  {/* Terms */}
                  <div className="truncate" title={product.terms}>{product.terms}</div>
                  
                  {/* Unit Price */}
                  <div className="text-right">${product.unitPrice?.toLocaleString() || '0.00'}</div>
                  
                  {/* Total */}
                  <div className="text-right font-medium">${product.totalPricing}</div>
                  
                  {/* Vendor */}
                  <div className="text-xs text-gray-600 truncate" title={product.vendor || 'N/A'}>
                    {product.vendor || 'N/A'}
                  </div>
                </div>

                {/* Hidden Deal ID and Is_Contract fields */}
                <input type="hidden" value={product.dealId} />
                <input type="hidden" value={product.isContract ? 'true' : 'false'} />
              </div>
            ))}
            
            {/* Bottom scroll indicator */}
            {editableProducts.length > 5 && (
              <div className="sticky bottom-0 bg-green-50 border border-green-200 rounded p-2 mt-3">
                <p className="text-xs text-green-700 text-center">
                  ✅ End of product list ({editableProducts.length} total)
                </p>
              </div>
            )}
          </div>
        )}
      </div>      <div className="p-2 sm:p-3 border-t bg-gray-50 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            {editableProducts.length} products | {dealId}
            <span className={`ml-2 px-2 py-1 rounded text-xs ${isApiAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isApiAvailable ? 'API Available' : 'API Unavailable'}
            </span>
          </div><Button
            type="submit"
            variant="default"
            size="sm"
            className={`${isApiAvailable ? 'bg-green-400 hover:bg-green-500' : 'bg-gray-400 hover:bg-gray-500'} text-white`}
            disabled={!isApiAvailable}
          >
            <Save className="h-4 w-4 mr-2" />
            {isApiAvailable ? 'Submit to Zoho CRM' : 'API Unavailable'}
          </Button>
        </div>
      </div>
    </form>
  );
}
