/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, {
  createContext, useCallback, useContext, useState, ReactNode,
} from 'react';
import { ToastNotification } from '@carbon/react';

type NotificationKind = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  subtitle: string;
}

interface NotifyMethods {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationContext = createContext<NotifyMethods | null>(null);

const NOTIFICATION_TIMEOUT = 5000;

export function NotificationProvider({ children }: NotificationProviderProps): React.ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((kind: NotificationKind, title: string, subtitle = '') => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, {
      id, kind, title, subtitle,
    }]);
    setTimeout(() => removeNotification(id), NOTIFICATION_TIMEOUT);
  }, [removeNotification]);

  const notify: NotifyMethods = {
    success: (msg: string) => addNotification('success', 'Success', msg),
    error: (msg: string) => addNotification('error', 'Error', msg),
    warning: (msg: string) => addNotification('warning', 'Warning', msg),
    info: (msg: string) => addNotification('info', 'Info', msg),
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {notifications.map((n) => (
          <ToastNotification
            key={n.id}
            kind={n.kind}
            title={n.title}
            subtitle={n.subtitle}
            onClose={() => removeNotification(n.id)}
            timeout={NOTIFICATION_TIMEOUT}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotifyMethods {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
