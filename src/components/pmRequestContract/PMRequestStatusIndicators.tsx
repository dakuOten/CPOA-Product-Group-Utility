import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface PMRequestStatusIndicatorsProps {
  error: string | null;
  rawPageLoadData: unknown; // Adjust this type as needed
  isRecord: (value: unknown) => value is Record<string, unknown>;
  getString: (obj: Record<string, unknown>, key: string) => string;
  getNestedString: (obj: Record<string, unknown>, key: string, nestedKey: string) => string;
}

export default function PMRequestStatusIndicators({
  error,
  rawPageLoadData,
  isRecord,
  getString,
  getNestedString,
}: PMRequestStatusIndicatorsProps) {
  return (
    <>
      {/* Connection Status */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border flex-shrink-0">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-xs font-medium text-green-700">Connected to Zoho CRM</span>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="flex-shrink-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">{String(error)}</AlertDescription>
        </Alert>
      )}

      {/* Deal Information */}
      {rawPageLoadData && isRecord(rawPageLoadData) && isRecord(rawPageLoadData.data) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 flex-shrink-0">
          <h2 className="font-semibold text-blue-900 mb-1 text-xs sm:text-sm">
            Deal: {getString(rawPageLoadData.data as Record<string, unknown>, 'Deal_Name')}
          </h2>
          <div className="text-xs text-blue-700 flex flex-col sm:flex-row sm:gap-4 gap-1">
            <span><span className="font-medium">Account:</span> {getNestedString(rawPageLoadData.data as Record<string, unknown>, 'Account_Name', 'name')}</span>
            <span><span className="font-medium">Stage:</span> {getString(rawPageLoadData.data as Record<string, unknown>, 'Stage')}</span>
            <span><span className="font-medium">Amount:</span> ${getString(rawPageLoadData.data as Record<string, unknown>, 'Amount')}</span>
          </div>
        </div>
      )}
    </>
  );
}
