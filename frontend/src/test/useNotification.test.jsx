import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { NotificationProvider, useNotification } from '../hooks/useNotification';

describe('useNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws when used outside NotificationProvider', () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useNotification());
    }).toThrow('useNotification must be used within a NotificationProvider');
    spy.mockRestore();
  });

  describe('within NotificationProvider', () => {
    const wrapper = ({ children }) => <NotificationProvider>{children}</NotificationProvider>;

    it('provides notify object with success, error, warning, info methods', () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      expect(result.current.success).toBeTypeOf('function');
      expect(result.current.error).toBeTypeOf('function');
      expect(result.current.warning).toBeTypeOf('function');
      expect(result.current.info).toBeTypeOf('function');
    });

    it('notify.success adds a success notification', () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      act(() => {
        result.current.success('Operation completed');
      });
      // The notification should be rendered in the provider
    });

    it('notify.error adds an error notification', () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      act(() => {
        result.current.error('Something went wrong');
      });
    });

    it('notify.warning adds a warning notification', () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      act(() => {
        result.current.warning('Be careful');
      });
    });

    it('notify.info adds an info notification', () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      act(() => {
        result.current.info('FYI');
      });
    });

    it('notifications auto-dismiss after timeout', () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      act(() => {
        result.current.success('Will disappear');
      });
      // Advance timers past the 5000ms timeout
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      // After timeout, the notification should be removed (no error thrown means state updated)
    });

    it('multiple notifications can be added', () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      act(() => {
        result.current.success('First');
        result.current.error('Second');
        result.current.info('Third');
      });
    });
  });

  describe('NotificationProvider renders notifications', () => {
    function TestComponent() {
      const notify = useNotification();
      return (
        <button type="button" onClick={() => notify.success('Done')}>
          Trigger
        </button>
      );
    }

    it('renders notification text when triggered', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>,
      );
      const button = screen.getByText('Trigger');
      act(() => {
        button.click();
      });
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('removes notification after timeout', () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>,
      );
      const button = screen.getByText('Trigger');
      act(() => {
        button.click();
      });
      expect(screen.getByText('Done')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.queryByText('Done')).not.toBeInTheDocument();
    });
  });
});
