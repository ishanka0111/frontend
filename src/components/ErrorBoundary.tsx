/**
 * Error Boundary Component
 * Catches errors in child components and provides fallback UI
 * Redirects back to role-based landing page on error
 */

import React, { ReactNode, ErrorInfo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends React.Component<Props & { navigate: any; userRole: number | undefined }, State> {
  constructor(props: Props & { navigate: any; userRole: number | undefined }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  getLandingPagePath = (): string => {
    switch (this.props.userRole) {
      case 1:
        return '/menu';
      case 2:
        return '/admin';
      case 3:
        return '/kitchen';
      case 4:
        return '/waiter';
      default:
        return '/';
    }
  };

  handleGoToLandingPage = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.navigate(this.getLandingPagePath());
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Something went wrong</h1>
            <p className="error-message">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <details className="error-details">
              <summary>Error Details</summary>
              <pre>{this.state.error?.stack}</pre>
            </details>
            <button
              onClick={this.handleGoToLandingPage}
              className="error-boundary-button"
            >
              Go to Landing Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <ErrorBoundaryClass navigate={navigate} userRole={user?.role}>
      {children}
    </ErrorBoundaryClass>
  );
};

export default ErrorBoundary;
