/**
 * Typed Redux hooks for the AGE Viewer frontend.
 * Use these instead of plain `useDispatch` and `useSelector` for type safety.
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../types/redux';
import type store from './store';

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
