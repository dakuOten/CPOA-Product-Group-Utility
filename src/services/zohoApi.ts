// Zoh//   "Subform_1": [
//     {
//       "Product_Type": "AT&T Transactional",
//       "Is_Contract": true,
//       "Product_Grouping": "A",
//       "Quantity": 2,
//       "Terms": "Co-Terminus", 
//       "Pricing": 500,
//       "Total_Pricing": "1,000.00",
//       "Vendor": null,
//       "Products": "6637555000000864095"
//       // NOTE: No "id" field - Zoho manages subform record IDs automatically
//     }vice for Product Management
// Handles updating product arrays in Subform_1 using Zoho CRM API v3
// 
// IMPORTANT: API Structure must be flat with Subform_1 at root level:
// {
//   "id": "6637555000000860679",
//   "Subform_1": [
//     {
//       "Product_Type": "AT&T Transactional",
//       "Is_Contract": true,
//       "Product_Grouping": "A",
//       "Quantity": 2,
//       "Terms": "Co-Terminus", 
//       "Pricing": 500,
//       "Total_Pricing": "1,000.00",
//       "Vendor": null,
//       "Products": "6637555000000864095"
//       // NOTE: No "id" field - Zoho manages subform record IDs automatically
//     }
//   ]
// }

import type { ProductFormData } from '@/types/product';

/**
 * Interface for the response from Zoho CRM updateRecord API
 */
interface ZohoUpdateResponse {
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
}

/**
 * Interface for individual product records in Subform_1
 * Matches the exact structure provided by Zoho CRM
 * NOTE: id field is excluded as Zoho manages subform record IDs automatically
 */
interface ZohoProductRecord {
  Product_Type: string;
  Is_Contract: boolean;
  Product_Grouping: string | null;
  Quantity: number;
  Terms: string;
  Pricing: number;
  Total_Pricing: string | number;
  Vendor: string | null;
  Products: string; // Product ID as required by Zoho
  // id is NOT included - Zoho manages subform record IDs automatically
}

/**
 * Updates the entire product array in Subform_1 for a specific deal
 * * API Data Structure:
 * {
 *   "id": "6637555000000860679",
 *   "Subform_1": [
 *     {
 *       "Product_Type": "AT&T Transactional",
 *       "Is_Contract": true,
 *       "Product_Grouping": "A",
 *       "Quantity": 2,
 *       "Terms": "Co-Terminus",
 *       "Pricing": 500,
 *       "Total_Pricing": "1,000.00",
 *       "Vendor": null,
 *       "Products": "6637555000000864095"
 *       // NOTE: No "id" field - Zoho manages subform record IDs automatically
 *     }
 *   ]
 * }
 * 
 * @param dealId - The unique identifier of the deal record
 * @param products - Array of product data to update in Subform_1
 * @returns Promise resolving to the Zoho API response
 */
export async function updateProductSubformArray(
  dealId: string,
  products: ProductFormData[]
): Promise<ZohoUpdateResponse> {
  console.log('🔄 Starting product subform array update...');
  console.log('📋 Deal ID:', dealId);
  console.log('📦 Products to update:', products.length);
  
  if (!dealId) {
    const error = new Error('Deal ID is required for updating products');
    console.error('❌ Update failed:', error.message);
    throw error;
  }

  if (!products || products.length === 0) {
    const error = new Error('Products array cannot be empty');
    console.error('❌ Update failed:', error.message);
    throw error;
  }

  // Validate Zoho SDK availability
  if (!window.ZOHO?.CRM?.API?.updateRecord) {
    const error = new Error('Zoho CRM API is not available. Ensure the widget is properly embedded in Zoho CRM.');
    console.error('❌ Update failed:', error.message);
    throw error;
  }

  try {    // Transform ProductFormData to Zoho-compatible format
    const zohoProductRecords: ZohoProductRecord[] = products.map((product, index) => {
      console.log(`🔄 Processing product ${index + 1}:`, {
        name: product.name,
        id: product.id,
        grouping: product.productGrouping,
        isContract: product.isContract
      });        return {
        Product_Type: product.type,
        Is_Contract: product.isContract ?? false,
        Product_Grouping: product.productGrouping || null,
        Quantity: product.quantity || 1,
        Terms: product.terms || 'Co-Terminus',
        Pricing: product.unitPrice || 0,
        Total_Pricing: typeof product.totalPricing === 'string' 
          ? product.totalPricing 
          : String(product.totalPricing || 0),
        Vendor: product.vendor || null,
        Products: product.id // Product ID as required by Zoho
        // NOTE: subform record id field is excluded - Zoho manages them automatically
      };
    });console.log('🔧 Transformed product records:', zohoProductRecords);

    // Prepare the API request data with the correct structure - Subform_1 at root level
    const apiData = {
      id: dealId,  // Deal ID should be at root level
      Subform_1: zohoProductRecords // Subform_1 directly at root level, not nested
    };    console.log('📤 API Request data:', JSON.stringify(apiData, null, 2));
    console.log('🔍 Verifying correct structure:');
    console.log('✅ Deal ID at root:', apiData.id);
    console.log('✅ Subform_1 at root:', !!apiData.Subform_1);
    console.log('✅ Products count in Subform_1:', apiData.Subform_1.length);
    console.log('✅ No product IDs included (Zoho manages them automatically)');    console.log('🔄 Looping through all products to confirm structure...');
    apiData.Subform_1.forEach((product, index) => {
      console.log(`📋 Product ${index + 1} structure:`, {
        'Product_Type': product.Product_Type,
        'Is_Contract': product.Is_Contract,
        'Product_Grouping': product.Product_Grouping,
        'Quantity': product.Quantity,
        'Terms': product.Terms,
        'Pricing': product.Pricing,
        'Total_Pricing': product.Total_Pricing,
        'Vendor': product.Vendor,
        'Products': product.Products
        // NOTE: No 'id' field - Zoho manages subform record IDs automatically
      });
    });

    // Make the API call to update the record
    const response = await window.ZOHO.CRM.API.updateRecord({
      Entity: 'Deals',
      APIData: apiData,
      Trigger: ['workflow'] // Enable workflow triggers
    });

    console.log('✅ Zoho API Response:', response);

    // Validate the response
    if (!response?.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format from Zoho API');
    }

    const firstResult = response.data[0];
    if (!firstResult) {
      throw new Error('No response data received from Zoho API');
    }

    // Check if the update was successful
    if (firstResult.code === 'SUCCESS') {
      console.log('✅ Product subform array updated successfully!');
      console.log(`📊 Record ID: ${firstResult.details.id}`);
      console.log(`⏰ Modified Time: ${firstResult.details.Modified_Time}`);
      console.log(`👤 Modified By: ${firstResult.details.Modified_By.name}`);
    } else {
      console.warn('⚠️ Update completed with warnings:', firstResult.message);
    }

    return response;

  } catch (error) {
    console.error('❌ Error updating product subform array:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      // Log error to Zoho if available
      if (window.ZOHO?.CRM?.API?.logError) {
        window.ZOHO.CRM.API.logError({
          message: `Product Subform Update Error: ${error.message}`,
          stack: error.stack
        });
      }
    }

    // Re-throw the error for handling by the calling code
    throw error;
  }
}

/**
 * Updates the Product_Grouping field for a specific product in the subform
 * 
 * @param dealId - The unique identifier of the deal record
 * @param productId - The unique identifier of the product to update
 * @param productGrouping - The new product grouping value (A-Z)
 * @param allProducts - Complete array of products to maintain data integrity
 * @returns Promise resolving to the Zoho API response
 */
export async function updateProductGrouping(
  dealId: string,
  productId: string,
  productGrouping: string,
  allProducts: ProductFormData[]
): Promise<ZohoUpdateResponse> {
  console.log('🔄 Starting single product grouping update...');
  console.log('📋 Deal ID:', dealId);
  console.log('🏷️ Product ID:', productId);
  console.log('📝 New grouping:', productGrouping);

  // Find and update the specific product
  const updatedProducts = allProducts.map(product => 
    product.id === productId 
      ? { ...product, productGrouping: productGrouping.toUpperCase() }
      : product
  );

  // Use the main update function to maintain consistency
  return updateProductSubformArray(dealId, updatedProducts);
}

/**
 * Validates product data before sending to Zoho API
 * 
 * @param products - Array of products to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateProductData(products: ProductFormData[]): string[] {
  const errors: string[] = [];

  if (!products || !Array.isArray(products)) {
    errors.push('Products must be a valid array');
    return errors;
  }

  if (products.length === 0) {
    errors.push('Products array cannot be empty');
    return errors;
  }

  if (products.length > 100) {
    errors.push('Cannot update more than 100 products at once (Zoho API limit)');
  }

  products.forEach((product, index) => {
    const prefix = `Product ${index + 1}:`;

    if (!product.id) {
      errors.push(`${prefix} Missing product ID`);
    }

    if (!product.name || typeof product.name !== 'string') {
      errors.push(`${prefix} Missing or invalid product name`);
    }

    if (product.productGrouping && !/^[A-Z]$/.test(product.productGrouping)) {
      errors.push(`${prefix} Product grouping must be a single letter A-Z`);
    }

    if (product.quantity !== undefined && (product.quantity < 0 || !Number.isFinite(product.quantity))) {
      errors.push(`${prefix} Quantity must be a positive number`);
    }

    if (product.unitPrice !== undefined && (product.unitPrice < 0 || !Number.isFinite(product.unitPrice))) {
      errors.push(`${prefix} Unit price must be a positive number`);
    }
  });

  return errors;
}

/**
 * Utility function to check if the Zoho CRM API is available
 * 
 * @returns boolean indicating if the API is ready for use
 */
export function isZohoApiAvailable(): boolean {
  return !!(window.ZOHO?.CRM?.API?.updateRecord);
}

/**
 * Gets the current status of the Zoho SDK for debugging purposes
 * 
 * @returns Object with SDK availability status
 */
export function getZohoApiStatus() {
  return {
    zohoExists: !!window.ZOHO,
    crmExists: !!window.ZOHO?.CRM,
    apiExists: !!window.ZOHO?.CRM?.API,
    updateRecordExists: !!window.ZOHO?.CRM?.API?.updateRecord,
    embeddedAppExists: !!window.ZOHO?.embeddedApp,
    isReady: isZohoApiAvailable()
  };
}
