import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  readonly hasError: boolean
  readonly error: Error | null
  readonly errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  readonly children: ReactNode
  readonly fallback?: ReactNode
  readonly onError?: (error: Error, errorInfo: ErrorInfo) => void
}

/**
 * Modern Error Boundary component using ES2024 class features
 * Provides comprehensive error handling with recovery options
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Private class fields using ES2024 syntax
  #retryCount = 0
  readonly #maxRetries = 3

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    } as const
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    } as const
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Update state with error information
    this.setState(prevState => ({
      ...prevState,
      error,
      errorInfo,
    } as const))

    // Call optional error callback
    this.props.onError?.(error, errorInfo)    // Report to error tracking service if available
    if (window.ZOHO?.CRM?.API?.logError) {
      window.ZOHO.CRM.API.logError({
        message: error.message,
        stack: error.stack,
      })
    }
  }

  #handleRetry = (): void => {
    if (this.#retryCount < this.#maxRetries) {
      this.#retryCount++
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      } as const)
    } else {
      // Max retries reached, reload the page
      window.location.reload()
    }
  }

  #handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI with modern design
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                {this.state.error?.message || 'An unexpected error occurred'}
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={this.#handleRetry}
                disabled={this.#retryCount >= this.#maxRetries}
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {this.#retryCount >= this.#maxRetries ? 'Max Retries Reached' : `Retry (${this.#retryCount}/${this.#maxRetries})`}
              </Button>
              
              <Button
                onClick={this.#handleReload}
                variant="outline"
                className="flex-1"
              >
                Reload Page
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 p-4 bg-muted rounded-lg text-sm">
                <summary className="cursor-pointer font-medium">Error Details (Development)</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto">
                  {this.state.error?.stack}
                  {'\n\nComponent Stack:'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
