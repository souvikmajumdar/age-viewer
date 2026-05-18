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

interface CookieOptions {
  path?: string;
  expires?: Date;
  secure?: boolean;
}

const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

const defaultOptions: CookieOptions = {
  path: '/',
  expires: oneYearFromNow,
  secure: false,
};

const parseCookies = (): Record<string, unknown> => {
  const cookies: Record<string, unknown> = {};
  document.cookie.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      try {
        cookies[name] = JSON.parse(decodeURIComponent(rest.join('=')));
      } catch {
        cookies[name] = decodeURIComponent(rest.join('='));
      }
    }
  });
  return cookies;
};

export const loadFromCookie = (cookieName: string): unknown => {
  const cookies = parseCookies();
  return cookies[cookieName] !== undefined ? cookies[cookieName] : undefined;
};

export const saveToCookie = (cookieName: string, value: unknown, options: CookieOptions = defaultOptions): void => {
  let cookieString = `${cookieName}=${encodeURIComponent(JSON.stringify(value))}`;
  if (options.path) cookieString += `; path=${options.path}`;
  if (options.expires) cookieString += `; expires=${options.expires.toUTCString()}`;
  if (options.secure) cookieString += '; secure';
  document.cookie = cookieString;
};

export const loadAllFromCookie = (): Record<string, unknown> => parseCookies();
