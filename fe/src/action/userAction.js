import api from '../utils/api';
import * as types from '../constants/user.constants';
import { commonUiActions } from './commonUiAction';
import * as commonTypes from '../constants/commonUI.constants';
const loginWithToken = () => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_WITH_TOKEN_REQUEST });
    const res = await api.get('/');
    if (res.status !== 200) throw new Error(res.error);

    dispatch({ type: types.LOGIN_WITH_TOKEN_SUCCESS, payload: res.data.user });
  } catch (err) {
    dispatch({ type: types.LOGIN_WITH_TOKEN_FAIL, payload: err });

    dispatch(logout());
  }
};

const loginWithEmail =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      dispatch({ type: types.LOGIN_REQUEST });

      const response = await api.post('/auth/login', { email, password });
      if (response.status !== 200) throw new Error(response.error);
      sessionStorage.setItem('token', response.data.token);

      dispatch({ type: types.LOGIN_SUCCESS, payload: response.data });
    } catch (err) {
      dispatch({ type: types.LOGIN_FAIL, payload: err.error });
    }
  };

const logout = () => async (dispatch) => {
  dispatch({ type: types.LOGOUT });
};

const loginWithGoogle = (credential) => async (dispatch) => {
  try {
    dispatch({ type: types.GOOGLE_LOGIN_REQUEST });
    const res = await api.post('/auth/google', { credential });

    if (res.status !== 200) throw new Error(res.error);

    dispatch({ type: types.GOOGLE_LOGIN_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: types.GOOGLE_LOGIN_FAIL, payload: err.error });
    dispatch(commonUiActions.showToastMessage(err.error, 'error'));
  }
};

const registerUser =
  ({ email, name, password }, navigate) =>
  async (dispatch) => {
    try {
      dispatch({ type: types.REGISTER_USER_REQUEST });
      const response = await api.post('/user', { email, name, password });

      if (response.status !== 200) throw new Error(response.error);

      dispatch({ type: types.REGISTER_USER_SUCCESS });
      dispatch(commonUiActions.showToastMessage('회원가입을 완료 했습니다.', 'success'));
      navigate('/login');
    } catch (err) {
      dispatch({ type: types.REGISTER_USER_FAIL, payload: err.error });
    }
  };
export const userActions = {
  loginWithToken,
  loginWithEmail,
  logout,
  loginWithGoogle,
  registerUser,
};
