import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import ServerConnectFrame from '../components/frame/presentations/ServerConnectFrame';
import { renderWithProviders } from './test-utils';

vi.stubGlobal('fetch', vi.fn());

describe('ServerConnectFrame Component', () => {
  const defaultProps = {
    refKey: 'connect-frame-1',
    isPinned: false,
    reqString: ':server connect',
    currentGraph: '',
  };

  it('renders the connect heading', () => {
    renderWithProviders(<ServerConnectFrame {...defaultProps} />);
    expect(screen.getByText('Connect to Database')).toBeInTheDocument();
  });

  it('renders description text', () => {
    renderWithProviders(<ServerConnectFrame {...defaultProps} />);
    expect(screen.getByText(/Database access might require/i)).toBeInTheDocument();
  });

  it('renders the Connect button', () => {
    renderWithProviders(<ServerConnectFrame {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const connectBtn = buttons.find((b) => b.textContent.includes('Connect'));
    expect(connectBtn).toBeDefined();
  });

  it('renders host input with placeholder', () => {
    renderWithProviders(<ServerConnectFrame {...defaultProps} />);
    expect(screen.getByPlaceholderText('192.168.0.1')).toBeInTheDocument();
  });

  it('renders multiple input fields', () => {
    renderWithProviders(<ServerConnectFrame {...defaultProps} />);
    const inputs = screen.getAllByPlaceholderText('postgres');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('renders within a Frame with reqString', () => {
    renderWithProviders(<ServerConnectFrame {...defaultProps} />);
    expect(screen.getByText(':server connect')).toBeInTheDocument();
  });
});
