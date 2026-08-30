import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-[#1B3022]">
          <AlertCircle className="w-12 h-12 text-[#ba1a1a] mb-4" />
          <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
          <p className="text-sm text-[#2C2C2C] mb-4 text-center max-w-md">
            {this.state.error?.message || 'Ha ocurrido un error inesperado al cargar esta sección.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-[#C5A059] text-[#1B3022] font-bold text-xs uppercase tracking-wider rounded-[4px]"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
