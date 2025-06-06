import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  readonly size?: 'sm' | 'md' | 'lg'
  readonly className?: string
}

/**
 * Modern loading spinner component with size variants
 * Uses CSS animations for smooth performance
 */
export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  } as const

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingOverlayProps {
  readonly message?: string
  readonly className?: string
}

/**
 * Full-screen loading overlay with modern design
 */
export const LoadingOverlay = ({ 
  message = 'Loading...', 
  className 
}: LoadingOverlayProps) => (
  <div
    className={cn(
      'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
      'flex items-center justify-center',
      className
    )}
    role="dialog"
    aria-label="Loading"
  >
    <div className="flex flex-col items-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  </div>
)

interface LoadingDotsProps {
  readonly className?: string
}

/**
 * Animated loading dots for inline use
 */
export const LoadingDots = ({ className }: LoadingDotsProps) => (
  <span className={cn('inline-flex space-x-1', className)}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1 h-1 bg-current rounded-full animate-pulse"
        style={{
          animationDelay: `${i * 0.15}s`,
          animationDuration: '1s',
        }}
      />
    ))}
  </span>
)
