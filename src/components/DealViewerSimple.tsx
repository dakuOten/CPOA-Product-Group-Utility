import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RefreshCw, AlertTriangle, Database, TrendingUp, DollarSign, User, Building } from 'lucide-react'
import { useZoho } from '@/providers/useZoho'

// Type guards for unknown data
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const getString = (obj: Record<string, unknown>, key: string): string => {
  const value = obj[key]
  return typeof value === 'string' ? value : String(value || 'N/A')
}

const getNumber = (obj: Record<string, unknown>, key: string): number => {
  const value = obj[key]
  return typeof value === 'number' ? value : parseFloat(String(value || '0')) || 0
}

const getNestedString = (obj: Record<string, unknown>, key: string, nestedKey: string): string => {
  const nested = obj[key]
  if (isRecord(nested)) {
    return getString(nested, nestedKey)
  }
  return 'N/A'
}

// Modern ES2024 formatting utilities
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// Loading skeleton component
const DealSkeleton = () => (
  <div className="min-h-screen bg-background py-8 px-4">
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

// Error component
const DealError = ({ 
  error, 
  onRetry, 
  onClear 
}: { 
  readonly error: string
  readonly onRetry: () => void
  readonly onClear: () => void 
}) => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="max-w-md w-full mx-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Deal Data</AlertTitle>
        <AlertDescription className="mt-2 mb-4">
          {error}
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={onRetry} variant="default" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
        <Button onClick={onClear} variant="outline" size="sm">
          Clear Error
        </Button>
      </div>
    </div>
  </div>
)

// Empty state component
const EmptyState = ({ onRefresh }: { readonly onRefresh: () => void }) => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center max-w-md mx-4">
      <Database className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Deal Data Available</h3>
      <p className="text-muted-foreground mb-6">
        Waiting for Zoho PageLoad event to fetch deal information...
      </p>
      <Button onClick={onRefresh} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  </div>
)

// Deal stats component
const DealStats = ({ dealData }: { readonly dealData: Record<string, unknown> }) => {
  const dealAmount = getNumber(dealData, 'Amount')
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="flex items-center space-x-3">
        <Building className="h-5 w-5 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Account</p>
          <p className="text-lg font-semibold">
            {getNestedString(dealData, 'Account_Name', 'name')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <DollarSign className="h-5 w-5 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Deal Amount</p>
          <p className="text-lg font-semibold">
            {currencyFormatter.format(dealAmount)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Stage</p>
          <p className="text-lg font-semibold">
            {getString(dealData, 'Stage')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <User className="h-5 w-5 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Owner</p>
          <p className="text-lg font-semibold">
            {getNestedString(dealData, 'Owner', 'name')}
          </p>
        </div>
      </div>
    </div>
  )
}

// Product table component
const ProductsTable = ({ dealData }: { readonly dealData: Record<string, unknown> }) => {
  const subformData = dealData['Subform_1']
  
  const products = useMemo(() => {
    if (!isRecord(subformData)) return []
    
    return Object.values(subformData).filter(isRecord)
  }, [subformData])

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Products
          </CardTitle>
          <CardDescription>No products found for this deal</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Products ({products.length})
          </CardTitle>
          <Badge variant="secondary">{products.length} items</Badge>
        </div>
        <CardDescription>Products associated with this deal</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Terms</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {getNestedString(product, 'Products', 'name')}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getString(product, 'Product_Type')}
                  </Badge>
                </TableCell>
                <TableCell>{getNumber(product, 'Quantity')}</TableCell>
                <TableCell>{getString(product, 'Terms')} months</TableCell>
                <TableCell className="text-right">
                  {currencyFormatter.format(getNumber(product, 'Total_Pricing'))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Main DealViewer component
export default function DealViewer() {
  const { isZohoReady, dealData, error, loading, refreshData, clearError } = useZoho()

  // Show loading state
  if (loading) {
    return <DealSkeleton />
  }

  // Show error state
  if (error) {
    return <DealError error={error} onRetry={refreshData} onClear={clearError} />
  }

  // Show empty state
  if (!dealData || !isRecord(dealData)) {
    return <EmptyState onRefresh={refreshData} />
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Deal Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {getString(dealData, 'Deal_Name')}
                </CardTitle>
                <CardDescription>
                  Deal ID: {getString(dealData, 'id')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isZohoReady ? "default" : "secondary"}>
                  {isZohoReady ? "Connected" : "Disconnected"}
                </Badge>
                <Button onClick={refreshData} size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DealStats dealData={dealData} />
          </CardContent>
        </Card>

        {/* Products Table */}
        <ProductsTable dealData={dealData} />

        {/* Debug Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Zoho Ready: {String(isZohoReady)}</p>
              <p>Data Available: {dealData ? 'Yes' : 'No'}</p>
              <p>Closing Date: {getString(dealData, 'Closing_Date')}</p>
              <p>Currency: {getString(dealData, 'Currency')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
