/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { ErrorBoundary, withErrorBoundary } from '../index'

// Test component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error during tests to avoid noise
  const originalError = console.error
  beforeAll(() => {
    console.error = vi.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders default error message when child throws error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })

  it('shows error details in development mode', () => {
    // Mock NODE_ENV for this test
    vi.stubEnv('NODE_ENV', 'development')

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error details (development only)')).toBeInTheDocument()

    // Restore
    vi.unstubAllEnvs()
  })
})

describe('withErrorBoundary HOC', () => {
  const originalError = console.error
  beforeAll(() => {
    console.error = vi.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  it('wraps component with error boundary', () => {
    const WrappedComponent = withErrorBoundary(ThrowError)

    render(<WrappedComponent shouldThrow={false} />)
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('catches errors in wrapped component', () => {
    const WrappedComponent = withErrorBoundary(ThrowError)

    render(<WrappedComponent shouldThrow={true} />)
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
  })

  it('uses custom fallback with HOC', () => {
    const customFallback = <div>HOC custom error</div>
    const WrappedComponent = withErrorBoundary(ThrowError, customFallback)

    render(<WrappedComponent shouldThrow={true} />)
    expect(screen.getByText('HOC custom error')).toBeInTheDocument()
  })
})
