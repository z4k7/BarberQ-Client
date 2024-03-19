import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUserState } from './user.reducer';

export const selectUserState = createFeatureSelector<IUserState>('user');
export const selectUserDetails = createSelector(
  selectUserState,
  (state: IUserState) => state.userDetails
);
