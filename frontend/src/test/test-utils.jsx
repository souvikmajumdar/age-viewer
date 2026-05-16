import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from '../app/reducers';
import { NotificationProvider } from '../hooks/useNotification';

/**
 * Custom render that wraps components with Redux Provider and NotificationProvider.
 * Accepts optional preloadedState and store overrides.
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({ reducer: rootReducer, preloadedState }),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export { default as userEvent } from '@testing-library/user-event';
