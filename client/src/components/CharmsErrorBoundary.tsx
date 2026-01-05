// Charms Error Boundary

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { createLogger } from '../utils/logger';

const logger = createLogger('CharmsErrorBoundary');

interface Props {
  children: ReactNode;
  fallbackMode?: 'demo' | 'retry' | 'error';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class CharmsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('[CharmsErrorBoundary] Caught error:', error);
    logger.error('[CharmsErrorBoundary] Error info:', errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // reportError(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { error } = this.state;
    const { fallbackMode = 'error' } = this.props;
    const isWasmError = error?.message?.toLowerCase().includes('wasm') ||
                        error?.message?.toLowerCase().includes('module');

    // Demo mode fallback
    if (fallbackMode === 'demo' && isWasmError) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900 border border-yellow-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-yellow-300 mb-2">
                  WASM Module Error
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  The Charms WASM module failed to load. You can continue in demo mode
                  with limited functionality.
                </p>
                <div className="bg-gray-950 rounded p-3 mb-4">
                  <code className="text-xs text-red-400 break-all">
                    {error?.message}
                  </code>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={this.handleReset}
                    className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    Continue in Demo Mode
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Retry fallback
    if (fallbackMode === 'retry') {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900 border border-red-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-red-300 mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  An error occurred while processing your request. You can try again
                  or reload the page.
                </p>
                {error && (
                  <div className="bg-gray-950 rounded p-3 mb-4">
                    <code className="text-xs text-red-400 break-all">
                      {error.message}
                    </code>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={this.handleReset}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-900 border border-red-700 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-300 mb-2">
                Application Error
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                An unexpected error occurred. Please try reloading the page.
              </p>
              {error && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">Error details:</div>
                  <div className="bg-gray-950 rounded p-3 overflow-auto max-h-48">
                    <code className="text-xs text-red-400">
                      {error.toString()}
                      {this.state.errorInfo && (
                        <>
                          <br />
                          <br />
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </code>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={this.handleReset}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Reset (Dev Only)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
