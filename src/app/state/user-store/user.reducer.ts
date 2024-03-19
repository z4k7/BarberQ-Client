import { createReducer, on } from '@ngrx/store';
import { IUser } from 'src/app/models/user';
import { deleteUser, saveUser } from './user.actions';

export interface IUserState {
  userDetails: IUser | null;
}

export const initialUserState: IUserState = {
  userDetails: null,
};

export const userReducer = createReducer(
  initialUserState,

  on(saveUser, (state, { userDetails }): IUserState => {
    return { ...state, userDetails };
  }),

  on(deleteUser, (state): IUserState => {
    return { ...state, userDetails: null };
  })
);
