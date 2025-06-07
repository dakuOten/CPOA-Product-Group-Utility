import { z, ZodError } from 'zod'

// ES2025 enhanced Zoho schemas with Zod 4.0 features

// Zoho User schema - more flexible
const ZohoUserSchema = z.union([
  z.object({
    name: z.string(),
    id: z.string(),
  }),
  z.string().transform(name => ({ name, id: 'unknown' })),
]).optional().default({ name: 'Unknown', id: 'unknown' })

// Zoho Product schema - matches the actual structure
const ZohoProductSchema = z.object({
  name: z.string(),
  id: z.string(),
})

// Enhanced Product Subform schema for PM Request Contract - more flexible
const ZohoProductSubformSchema = z.object({
  // Core product identification
  Products: ZohoProductSchema.optional(),
  Product_Type: z.string().optional(),
  
  // Contract specific fields
  Is_Contract: z.boolean().optional().default(false),
  Product_Grouping: z.string().nullable().optional(),
  
  // Pricing and terms
  Quantity: z.coerce.number().optional().default(1),
  Terms: z.string().optional().default("Co-Terminus"),
  Unit_Price: z.coerce.number().optional().default(0),
  Total_Pricing: z.union([z.coerce.number(), z.string()]).optional().default(0),
  
  // Additional fields for contract management
  Pricing: z.string().nullable().optional(),
  Vendor: z.string().nullable().optional(),
  Service_Type: z.string().optional(),
  
  // PM Request specific fields
  PM_Request_Status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
  Contract_Duration: z.string().optional(),
  
  // Internal tracking
  id: z.string().optional(),
  record_id: z.string().optional(),
}).passthrough() // Allow additional unknown fields

// Enhanced Deal Data schema for PM Request Contract - much more flexible
const ZohoDealDataSchema = z.object({
  // Core deal identification - required fields
  id: z.string(),
  Deal_Name: z.string(),
  Account_Name: ZohoUserSchema,
  
  // Deal ownership and tracking - with defaults
  Owner: ZohoUserSchema,
  Created_By: ZohoUserSchema,
  Modified_By: ZohoUserSchema,
  
  // Financial information - flexible
  Amount: z.coerce.number().optional().default(0),
  Currency: z.string().optional().default('USD'),
  Exchange_Rate: z.string().optional().default('1'),
  
  // Deal progression - with defaults
  Stage: z.string().optional().default('Unknown'),
  Probability: z.coerce.number().optional().default(0),
  Closing_Date: z.string().optional().default(''),
    // Product subform - the main products array - more flexible
  Subform_1: z.record(z.string(), z.unknown()).optional().default({}),
}).passthrough() // Allow all other fields to pass through

// Zoho PageLoad Data schema - very flexible
const ZohoPageLoadDataSchema = z.object({
  data: ZohoDealDataSchema,
}).passthrough()

// Export types
export type ZohoUser = z.infer<typeof ZohoUserSchema>
export type ZohoProduct = z.infer<typeof ZohoProductSchema>
export type ZohoProductSubform = z.infer<typeof ZohoProductSubformSchema>
export type ZohoDealData = z.infer<typeof ZohoDealDataSchema>
export type ZohoPageLoadData = z.infer<typeof ZohoPageLoadDataSchema>

// Export schemas for runtime validation
export {
  ZohoUserSchema,
  ZohoProductSchema,
  ZohoProductSubformSchema,
  ZohoDealDataSchema,
  ZohoPageLoadDataSchema,
}

// Utility functions for parsing unknown data - with better error handling
export const parseZohoDealData = (data: unknown): ZohoDealData | null => {
  try {
    return ZohoDealDataSchema.parse(data)
  } catch (error) {
    console.error('Failed to parse ZohoDealData:', error)
    if (error instanceof ZodError) {
      console.error('Validation errors:', error)
    }
    return null
  }
}

export const parseZohoPageLoadData = (data: unknown): ZohoPageLoadData | null => {
  try {
    return ZohoPageLoadDataSchema.parse(data)
  } catch (error) {
    console.error('Failed to parse ZohoPageLoadData:', error)
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error)
    }
    return null
  }
}

// Type guards
export const isZohoDealData = (data: unknown): data is ZohoDealData => {
  try {
    ZohoDealDataSchema.parse(data)
    return true
  } catch {
    return false
  }
}

export const validateProductSubform = (data: unknown): data is ZohoProductSubform => {
  try {
    ZohoProductSubformSchema.parse(data)
    return true
  } catch {
    return false
  }
}