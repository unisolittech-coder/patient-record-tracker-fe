import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error);
    console.error(errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col justify-center items-center">
          <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-4" />

          <h2 className="text-3xl font-bold">
            Something Went Wrong
          </h2>

          <p className="text-gray-500 mt-2">
            Please refresh the page.
          </p>

          <button
            onClick={this.handleRefresh}
            className="mt-5 bg-blue-600 text-white px-5 py-2 rounded"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;