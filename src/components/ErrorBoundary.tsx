//@ts-nocheck
import { Component } from "react";
import { getLogInfo } from "../backend/utils";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const logInfo = getLogInfo();
    logInfo(
      `error boundary: ${JSON.stringify(error)}, ${JSON.stringify(errorInfo)}`
    );
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
