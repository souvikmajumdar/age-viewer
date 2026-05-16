import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../app/reducers';
import SingleAlert from '../components/alert/presentations/Alert';

describe('Alert Component', () => {
  let store;
  const mockSetCommand = vi.fn();
  const mockRemoveAlert = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    store = configureStore({ reducer: rootReducer });
    // Suppress Carbon's interactive children warning
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const renderAlert = (alertName, errorMessage = '') => render(
    <Provider store={store}>
      <SingleAlert
        alertKey="test-key"
        alertName={alertName}
        errorMessage={errorMessage}
        setCommand={mockSetCommand}
        removeAlert={mockRemoveAlert}
      />
    </Provider>,
  );

  it('renders ErrorServerConnectFail alert', () => {
    renderAlert('ErrorServerConnectFail', 'Connection refused');
    expect(screen.getByText('Database Connection Failed')).toBeInTheDocument();
  });

  it('renders ErrorMetaFail alert', () => {
    renderAlert('ErrorMetaFail');
    expect(screen.getByText('Metadata Load Error')).toBeInTheDocument();
  });

  it('renders ErrorCypherQuery alert', () => {
    renderAlert('ErrorCypherQuery');
    expect(screen.getByText('Query Error')).toBeInTheDocument();
  });

  it('renders CreateGraphSuccess alert', () => {
    renderAlert('CreateGraphSuccess');
    expect(screen.getByText('Graph Created')).toBeInTheDocument();
  });

  it('renders ErrorPlayLoadFail alert', () => {
    renderAlert('ErrorPlayLoadFail', 'target.html');
    expect(screen.getByText('Failed to Load Play Target')).toBeInTheDocument();
  });

  it('renders nothing for unknown alert name', () => {
    const { container } = renderAlert('UnknownAlert');
    // Should render empty fragment
    expect(container.children).toHaveLength(0);
  });

  it('auto-clears after 10 seconds', () => {
    renderAlert('ErrorMetaFail');
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(mockRemoveAlert).toHaveBeenCalledWith('test-key');
  });
});
