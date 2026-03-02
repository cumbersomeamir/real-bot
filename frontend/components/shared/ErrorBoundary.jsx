'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="surface-card m-4 p-6 text-center">
          <h3>Something went wrong</h3>
          <p className="mt-2 text-slate-400">Please refresh the page and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
