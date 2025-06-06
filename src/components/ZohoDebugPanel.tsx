import { useZoho } from '@/providers/useZoho';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ZohoDebugPanel() {
  const { isZohoReady, dealData, error, loading, rawPageLoadData, refreshData } = useZoho();
  const [sdkStatus, setSdkStatus] = useState<string>('Checking...');
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    const checkSDK = () => {
      if (typeof window !== 'undefined') {
        if (window.ZOHO) {
          if (window.ZOHO.embeddedApp) {
            setSdkStatus('SDK Available & Ready');
          } else {
            setSdkStatus('ZOHO object found, but embeddedApp missing');
          }
        } else {
          setSdkStatus('ZOHO SDK not loaded');
        }
      }
    };
    
    checkSDK();
    const interval = setInterval(checkSDK, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    if (error) return <XCircle className="h-4 w-4 text-red-500" />;
    if (isZohoReady && rawPageLoadData) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Loading...';
    if (error) return 'Error';
    if (isZohoReady && rawPageLoadData) return 'Connected & Data Loaded';
    if (isZohoReady) return 'Connected, No Data';
    return 'Not Connected';
  };
  return (
    <Card className="mb-4 bg-white rounded-lg border flex-shrink-0 p-1">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span>Zoho Widget Debug Panel</span>
            <Badge variant={isZohoReady ? 'default' : 'destructive'} className="text-lg">
              {getStatusText()}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-3 text-lg">
          {/* SDK Status */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">SDK Status:</span>
              <div className="text-gray-600">{sdkStatus}</div>
            </div>
            <div>
              <span className="font-medium">Widget Context:</span>
              <div className="text-gray-600">
                {typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                  ? 'Production/Zoho' 
                  : 'Development/Local'}
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Zoho Ready:</span>
              <div className="text-gray-600">{isZohoReady ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <span className="font-medium">Loading:</span>
              <div className="text-gray-600">{loading ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Data Status */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Raw Data Available:</span>
              <div className="text-gray-600">{rawPageLoadData ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <span className="font-medium">Deal Data Parsed:</span>
              <div className="text-gray-600">{dealData ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Raw Data Preview */}
          {rawPageLoadData && (
            <div>
              <span className="font-medium">Raw Data Keys:</span>
              <div className="text-gray-600 bg-gray-50 p-2 rounded mt-1 max-h-20 overflow-auto">
                {Object.keys(rawPageLoadData).join(', ')}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div>
              <span className="font-medium text-red-600">Error:</span>
              <div className="text-red-600 bg-red-50 p-2 rounded mt-1">
                {error}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">            <Button 
              onClick={refreshData} 
              size="sm" 
              variant="outline"
              className="text-lg"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button 
              onClick={() => {
                console.log('=== MANUAL DEBUG INFO ===');
                console.log('Window.ZOHO:', window.ZOHO);
                console.log('State:', { isZohoReady, dealData, error, loading, rawPageLoadData });
              }}
              size="sm" 
              variant="outline"
              className="text-lg"
            >
              Log Debug Info
            </Button>
          </div>

          {/* Troubleshooting Tips */}
          {!isZohoReady && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
              <div className="font-medium text-yellow-800 text-lg mb-1">Troubleshooting:</div>
              <ul className="text-yellow-700 text-lg space-y-1">
                <li>• Ensure the widget is embedded in Zoho CRM</li>
                <li>• Check if the PageLoad event is being fired</li>
                <li>• Verify the deal has data in Subform_1</li>
                <li>• Open browser console for detailed logs</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      )}
    </Card>
  );
}
