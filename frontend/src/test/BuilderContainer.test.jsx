import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import BuilderContainer from '../components/query_builder/BuilderContainer';
import { renderWithProviders } from './test-utils';

// Mock CodeMirror since it requires browser APIs
vi.mock('../components/editor/containers/CodeMirrorWapperContainer', () => ({
  default: ({ value, onChange }) => (
    <textarea data-testid="mock-codemirror" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

describe('BuilderContainer Component', () => {
  const mockFinder = {
    hasWord: vi.fn(() => false),
    getConnectedNames: vi.fn(() => []),
  };

  it('renders nothing when open is false', () => {
    renderWithProviders(
      <BuilderContainer open={false} setOpen={vi.fn()} finder={mockFinder} />,
    );
    expect(screen.queryByText('Query Generator')).not.toBeInTheDocument();
  });

  it('renders the panel when open is true', () => {
    renderWithProviders(
      <BuilderContainer open setOpen={vi.fn()} finder={mockFinder} />,
    );
    expect(screen.getByText('Query Generator')).toBeInTheDocument();
  });

  it('renders Close button', () => {
    renderWithProviders(
      <BuilderContainer open setOpen={vi.fn()} finder={mockFinder} />,
    );
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('renders Submit button', () => {
    renderWithProviders(
      <BuilderContainer open setOpen={vi.fn()} finder={mockFinder} />,
    );
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders graph selection dropdown', () => {
    renderWithProviders(
      <BuilderContainer open setOpen={vi.fn()} finder={mockFinder} />,
    );
    expect(screen.getByText('Select Graph')).toBeInTheDocument();
  });

  it('renders the code editor', () => {
    renderWithProviders(
      <BuilderContainer open setOpen={vi.fn()} finder={mockFinder} />,
    );
    expect(screen.getByTestId('mock-codemirror')).toBeInTheDocument();
  });
});
