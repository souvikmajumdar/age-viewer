import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Frame from '../components/frame/Frame';
import { renderWithProviders, userEvent } from './test-utils';

describe('Frame Component', () => {
  const defaultProps = {
    reqString: 'MATCH (n) RETURN n',
    refKey: 'frame-1',
    isTable: false,
  };

  it('renders the request string', () => {
    renderWithProviders(<Frame {...defaultProps}><div>Content</div></Frame>);
    expect(screen.getByText('MATCH (n) RETURN n')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithProviders(<Frame {...defaultProps}><div>My Content</div></Frame>);
    expect(screen.getByText('My Content')).toBeInTheDocument();
  });

  it('renders expand/collapse button', () => {
    renderWithProviders(<Frame {...defaultProps}><div>Content</div></Frame>);
    const hideButton = screen.getByTitle('Hide');
    expect(hideButton).toBeInTheDocument();
  });

  it('renders close button', () => {
    renderWithProviders(<Frame {...defaultProps}><div>Content</div></Frame>);
    const closeButton = screen.getByTitle('Close Window');
    expect(closeButton).toBeInTheDocument();
  });

  it('renders fullscreen button', () => {
    renderWithProviders(<Frame {...defaultProps}><div>Content</div></Frame>);
    const expandButton = screen.getByTitle('Expand');
    expect(expandButton).toBeInTheDocument();
  });

  it('renders filter button when onSearch is provided', () => {
    const onSearch = vi.fn();
    renderWithProviders(
      <Frame {...defaultProps} onSearch={onSearch}><div>Content</div></Frame>,
    );
    const filterButton = screen.getByTitle('Filter/Search');
    expect(filterButton).toBeInTheDocument();
  });

  it('does not render filter button when onSearch is null', () => {
    renderWithProviders(<Frame {...defaultProps}><div>Content</div></Frame>);
    expect(screen.queryByTitle('Filter/Search')).not.toBeInTheDocument();
  });

  it('renders refresh button when onRefresh is provided and not table', () => {
    const onRefresh = vi.fn();
    renderWithProviders(
      <Frame {...defaultProps} onRefresh={onRefresh}><div>Content</div></Frame>,
    );
    const refreshButton = screen.getByTitle('Refresh');
    expect(refreshButton).toBeInTheDocument();
  });

  it('does not render refresh button for table view', () => {
    const onRefresh = vi.fn();
    renderWithProviders(
      <Frame {...defaultProps} isTable onRefresh={onRefresh}><div>Content</div></Frame>,
    );
    expect(screen.queryByTitle('Refresh')).not.toBeInTheDocument();
  });
});
