import { useZoho } from '@/providers/useZoho';
import { useMemo, useState, useCallback } from 'react';
import { isRecord } from '@/utils/dataHelpers';
import type { ProductItem, ProductFormData } from '@/types/product';
import { updateProductSubformArray, validateProductData, isZohoApiAvailable } from '@/services/zohoApi';
import { useToast } from '@/hooks/use-toast';

export function useProductManagement() {
  const { rawPageLoadData } = useZoho();
  const [editableProducts, setEditableProducts] = useState<ProductFormData[]>([]);
  const { toast } = useToast();

  const dealId = useMemo(() => {
    if (rawPageLoadData && isRecord(rawPageLoadData)) {
      const dataField = rawPageLoadData.data;
      if (isRecord(dataField)) {
        return dataField.id as string;
      }
    }
    return '';
  }, [rawPageLoadData]);

  const products = useMemo((): ProductItem[] => {
    let dealRecord: Record<string, unknown> | null = null;

    if (rawPageLoadData && isRecord(rawPageLoadData)) {
      const dataField = rawPageLoadData.data;
      if (isRecord(dataField)) {
        dealRecord = dataField;
      }
    }

    if (!dealRecord) {
      return [];
    }

    const subform1 = dealRecord.Subform_1;
    if (!Array.isArray(subform1)) {
      return [];
    }

    console.log('🔄 Extracting products from Subform_1...');
    console.log('📦 Total items in Subform_1:', subform1.length);

    const extractedProducts: ProductItem[] = subform1
      .filter((item) => isRecord(item))
      .map((item, index) => {
        const productRecord = item as Record<string, unknown>;
        
        // Check if we have a nested Products object (old structure) or direct id (new structure)
        let productId: string;
        let productName: string;
        
        if (productRecord.Products && isRecord(productRecord.Products)) {
          // Old nested structure
          const productsInfo = productRecord.Products;
          productId = (productsInfo.id as string) || `product-${index}`;
          productName = (productsInfo.name as string) || 'Unknown Product';
        } else {
          // New flat structure - product ID is directly in the record
          productId = (productRecord.id as string) || `product-${index}`;
          productName = (productRecord.Product_Name as string) || 
                       (productRecord.name as string) || 
                       `Product ${index + 1}`; // Fallback name
        }        console.log(`📋 Processing product ${index + 1}:`, {
          id: productId,
          name: productName,
          type: productRecord.Product_Type,
          grouping: productRecord.Product_Grouping,
          isContract: productRecord.Is_Contract
        });

        return {
          id: productId,
          name: productName,
          type: (productRecord.Product_Type as string) || '',
          quantity: (productRecord.Quantity as number) || 0,
          terms: (productRecord.Terms as string) || '',
          unitPrice: (productRecord.Pricing as number) || 0,
          totalPricing: (productRecord.Total_Pricing as string | number) || '',
          vendor: (productRecord.Vendor as string) || null,
          productGrouping: (productRecord.Product_Grouping as string) || '',
          isContract: Boolean(productRecord.Is_Contract),
        };
      });

    console.log('✅ Extracted products from Subform_1:', extractedProducts);

    if (extractedProducts.length > 0 && dealId) {
      const formProducts: ProductFormData[] = extractedProducts.map((product) => ({
        ...product,
        dealId,
      }));
      setEditableProducts(formProducts);
      console.log('📝 Set editable products for form:', formProducts.length);
    } else {
      setEditableProducts([]);
      console.log('❌ No products or deal ID found');
    }

    return extractedProducts;
  }, [rawPageLoadData, dealId]);  const handleProductGroupingChange = useCallback((index: number, value: string) => {
    const sanitizedValue = value.replace(/[^A-Za-z]/g, '').toUpperCase();
    setEditableProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], productGrouping: sanitizedValue };
      return updated;
    });
  }, []);

  // New function to update a single product grouping via API
  const updateSingleProductGrouping = async (index: number, value: string) => {
    const sanitizedValue = value.replace(/[^A-Za-z]/g, '').toUpperCase();
    
    if (!dealId || !editableProducts[index]) {
      console.error('❌ Cannot update: Missing deal ID or product');
      return;
    }

    const product = editableProducts[index];
    
    try {
      console.log('🔄 Updating single product grouping...');
      console.log('📋 Product:', product.name);
      console.log('🔤 New grouping:', sanitizedValue);

      // Update the local state first for immediate UI feedback
      handleProductGroupingChange(index, sanitizedValue);

      // Prepare the updated product array
      const updatedProducts = [...editableProducts];
      updatedProducts[index] = { ...updatedProducts[index], productGrouping: sanitizedValue };      // Call the API to update
      await updateProductSubformArray(dealId, updatedProducts);
      
      console.log('✅ Product grouping updated successfully');
        // Show success toast
      toast({
        title: "Product Updated",
        description: `Successfully updated ${product.name} grouping to ${sanitizedValue}`,
        variant: "success",
      });
      
    } catch (error) {
      console.error('❌ Failed to update product grouping:', error);
      
      // Revert the local state change on error
      handleProductGroupingChange(index, product.productGrouping || '');
      
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Unknown error occurred';
        
      // Show error toast
      toast({
        title: "Update Failed",
        description: `Failed to update product grouping: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };  const handleSubmitForm = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started...');
    console.log('📊 Products to submit:', editableProducts.length);
    console.log('🔄 Ensuring ALL products in Subform_1 are included...');    // Log each product to verify the complete loop
    editableProducts.forEach((product, index) => {
      console.log(`📋 Product ${index + 1}/${editableProducts.length} will be sent as:`, {
        'Product_Type': product.type,
        'Is_Contract': product.isContract,
        'Product_Grouping': product.productGrouping,
        'Quantity': product.quantity,
        'Terms': product.terms,
        'Pricing': product.unitPrice,
        'Total_Pricing': product.totalPricing,
        'Vendor': product.vendor
        // NOTE: 'id' is excluded - Zoho manages subform record IDs automatically
      });
    });    // Validate that we have a deal ID
    if (!dealId) {
      const errorMessage = 'Cannot submit: Deal ID is missing';
      console.error('❌', errorMessage);
      toast({
        title: "Submission Failed",
        description: "Unable to save changes - deal information is missing",
        variant: "destructive",
      });
      return;
    }

    // Validate that we have products to submit
    if (editableProducts.length === 0) {
      const errorMessage = 'Cannot submit: No products found to update';
      console.error('❌', errorMessage);
      toast({
        title: "Submission Failed", 
        description: "No products found to update",
        variant: "destructive",
      });
      return;
    }

    // Check if Zoho API is available
    if (!isZohoApiAvailable()) {
      const errorMessage = 'Cannot submit: Zoho CRM API is not available. Ensure the widget is embedded in Zoho CRM.';
      console.error('❌', errorMessage);
      toast({
        title: "API Unavailable",
        description: "Unable to connect to CRM system - please refresh and try again",
        variant: "destructive",
      });
      return;
    }    // Validate product data
    const validationErrors = validateProductData(editableProducts);
    if (validationErrors.length > 0) {
      console.error('❌ Validation errors:', validationErrors);
      toast({
        title: "Validation Failed",
        description: "Please check your product data and try again",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('📤 Submitting ALL products in exact Subform_1 structure...');
      
      // Call the API to update the entire product array
      const response = await updateProductSubformArray(dealId, editableProducts);      // Check if the update was successful
      const firstResult = response.data[0];
      if (firstResult && firstResult.code === 'SUCCESS') {
        const successMessage = `Successfully updated ${editableProducts.length} product${editableProducts.length === 1 ? '' : 's'}!`;
        console.log('✅', successMessage);
        console.log('📋 Updated Record ID:', firstResult.details.id);
        console.log('🔄 All products in Subform_1 structure have been processed and updated');
        
        toast({
          title: "Update Successful",
          description: successMessage,
          variant: "success",
        });
      } else {
        const warningMessage = `Update completed with status: ${firstResult?.message || 'Unknown status'}`;
        console.warn('⚠️', warningMessage);
        
        toast({
          title: "Update Warning",
          description: warningMessage,
          variant: "warning",
        });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Unknown error occurred';
      
      console.error('❌ Submit failed:', error);
        toast({
        title: "Update Failed",
        description: `Failed to update products: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }, [dealId, editableProducts, toast]);
  return {
    dealId,
    products,
    editableProducts,
    handleProductGroupingChange,
    updateSingleProductGrouping,
    handleSubmitForm,
    isApiAvailable: isZohoApiAvailable(),
  };
}
