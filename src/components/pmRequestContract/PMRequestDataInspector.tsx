import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  type: string;
  quantity?: number;
  terms?: string;
  unitPrice?: number;
  totalPricing?: number | string;
  vendor?: string | null;
  productGrouping?: string | null;
  isContract?: boolean;
}

interface ProductFormData extends ProductItem {
  dealId: string;
}

interface PMRequestDataInspectorProps {
  products: ProductItem[];
  rawPageLoadData: Record<string, unknown> | null; // Refined to explicitly allow null or a record
  editableProducts: ProductFormData[];
  dealId: string;
  isRecord: (value: unknown) => value is Record<string, unknown>; // Kept as is since it's already correct
}

export default function PMRequestDataInspector({
  products,
  rawPageLoadData,
  editableProducts,
  dealId,
  isRecord,
}: PMRequestDataInspectorProps) {  const [isDataSectionExpanded, setIsDataSectionExpanded] = useState(false);
  return (
    <div className="bg-white rounded-lg border flex-shrink-0 p-1">
      <button
        type="button"
        onClick={() => setIsDataSectionExpanded(!isDataSectionExpanded)}
        className="w-full p-2 sm:p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"      ><div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 text-lg">Raw Data Inspector</span>
          <Badge variant="outline" className="text-lg">Developer</Badge>
        </div>
        {isDataSectionExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>      {isDataSectionExpanded && (
        <div className="border-t bg-gray-50">
          {/* Scrollable container for the entire accordion content */}
          <div className="max-h-96 overflow-y-auto p-2 sm:p-3">
            <div className="space-y-3">              {/* Extracted Products */}
              <div>
                <h5 className="font-medium text-gray-700 text-lg mb-2">Extracted Products (from all sources):</h5>
                <div className="bg-white rounded border p-2">
                  <pre className="text-lg text-gray-600 whitespace-pre-wrap">
                    {products.length > 0 ? JSON.stringify(products, null, 2) : 'No products extracted'}
                  </pre>
                </div>
              </div>

              {/* Raw Page Load Data */}
              <div>
                <h5 className="font-medium text-gray-700 text-lg mb-2">Raw Page Load Data (all fields):</h5>
                <div className="bg-white rounded border p-2">
                  <pre className="text-lg text-gray-600 whitespace-pre-wrap">
                    {rawPageLoadData ? JSON.stringify(rawPageLoadData, null, 2) : 'No raw page load data available'}
                  </pre>
                </div>
              </div>

              {/* Form Products with Deal ID */}
              <div>
                <h5 className="font-medium text-gray-700 text-lg mb-2">Form Products (with hidden Deal ID):</h5>
                <div className="bg-white rounded border p-2">
                  <pre className="text-lg text-gray-600 whitespace-pre-wrap">
                    {editableProducts.length > 0 ? JSON.stringify(editableProducts, null, 2) : 'No form products available'}
                  </pre>
                </div>
              </div>              {/* Data Source Summary */}
              <div>                <h5 className="font-medium text-gray-700 text-lg mb-2">Data Source Summary:</h5>
                <div className="bg-white rounded border p-2">
                  <div className="text-lg text-gray-600 space-y-1">
                    <div>Raw Page Load Data Available: {rawPageLoadData ? 'Yes' : 'No'}</div>
                    <div>Deal ID: {dealId || 'Not found'}</div>
                    <div>Products Extracted: {products.length}</div>
                    <div>Editable Products: {editableProducts.length}</div>
                    {rawPageLoadData && isRecord(rawPageLoadData) && (
                      <div>Raw Data Keys: {Object.keys(rawPageLoadData).join(', ')}</div>
                    )}
                  </div>
                </div>
              </div>              {/* Editable Products Section - Improved UI/UX */}
              <div>
                <h5 className="font-medium text-gray-700 text-lg mb-2">Editable Products:</h5>
                <div className="space-y-2">
                  {editableProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-2">
                      {/* Product Grouping Input */}                      <input
                        type="text"
                        value={product.productGrouping || ''}
                        onChange={(e) => {
                          const sanitizedValue = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); // Restrict to A-Z only
                          const updatedProducts = [...editableProducts];
                          updatedProducts[index].productGrouping = sanitizedValue;
                          // Update editableProducts state (if managed externally)
                        }}
                        className="border rounded px-2 py-1 text-center text-lg"
                        style={{ width: '20px' }} // Fixed width for one character
                        placeholder="A"
                        maxLength={1}
                      />
                      {/* Read-Only Fields */}                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-lg text-gray-600">{product.name}</span>
                        <span className="text-lg text-gray-600">{product.type}</span>
                        <span className="text-lg text-gray-600">{product.quantity}</span>
                        <span className="text-lg text-gray-600">{product.terms}</span>
                        <span className="text-lg text-gray-600">${product.unitPrice?.toLocaleString()}</span>
                        <span className="text-lg text-gray-600">${product.totalPricing}</span>
                        <span className="text-lg text-gray-600">{product.vendor || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>              {/* Submit Button at the Bottom */}
              <div className="mt-4">                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-lg"
                  onClick={() => {
                    // Handle submit logic here
                    console.log('Submit clicked');
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
