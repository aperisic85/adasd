// src/components/ErrorBoundary.jsx
import React from "react";
import "./ErrorBoundary.css"; 
export default class ErrorBoundary extends React.Component {
  state = { hasError: false, errorMessage:"" };

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || "Failed to render LORA data" };
  }

  render() {
    if (this.state.hasError) {
      return <div className="error">Error: {this.state.errorMessage}</div>;
    }
    return this.props.children;
  }
}
