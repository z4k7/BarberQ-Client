import { createAction, props } from '@ngrx/store';
import { IUser } from 'src/app/models/user';

export const saveUser = createAction(
  '[User] SaveUser',
  props<{ userDetails: IUser }>()
);

export const deleteUser = createAction('[User] DeleteUser');
