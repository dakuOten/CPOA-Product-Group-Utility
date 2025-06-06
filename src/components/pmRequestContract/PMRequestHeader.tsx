import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { closeZohoWidget } from '@/services/zohoClient';

interface PMRequestHeaderProps {
  onRefresh: () => void;
}

export default function PMRequestHeader({ onRefresh }: PMRequestHeaderProps) {
  const { toast } = useToast();

  const handleClose = () => {
    closeZohoWidget((message) => toast(message));
  };

  return (
    <Card className="flex-shrink-0">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Header Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 mb-1">PM Request Contract</h1>
            <p className="text-sm text-gray-600 break-words whitespace-normal">
              Manage contract products for deal records
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:flex-shrink-0">
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">Refresh Data</span>
            </Button>
            
            <Button
              onClick={handleClose}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">Close Application</span>
            </Button>
          </div>
        </div>
        
        {/* Detailed Descriptions */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-500">
            <div className="flex items-start gap-2">
              <RefreshCw className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
              <span className="break-words">
                Reload to get latest data from Zoho CRM
              </span>
            </div>
            <div className="flex items-start gap-2">
              <X className="h-3 w-3 mt-0.5 text-red-500 flex-shrink-0" />
              <span className="break-words">
                Closes the widget and updates the Contract_Product field
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
