import api from '../utils/api';
import * as types from '../constants/product.constants';
import { toast } from 'react-toastify';
import { commonUiActions } from './commonUiAction';

const getProductList = (query) => async (dispatch) => {
  try {
    dispatch({ type: types.PRODUCT_GET_REQUEST });
    const res = await api.get('/product', {
      params: { ...query },
    });

    if (res.status !== 200) throw new Error(res.error);

    dispatch({ type: types.PRODUCT_GET_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: types.PRODUCT_GET_FAIL, payload: err.error });
    dispatch(commonUiActions.showToastMessage(err.error, 'error'));
  }
};
const getProductDetail = (id) => async (dispatch) => {};

const createProduct = (formData) => async (dispatch) => {
  try {
    dispatch({ type: types.PRODUCT_CREATE_REQUEST });
    const res = await api.post('/product', formData);

    if (res.status !== 200) throw new Error(res.error);

    dispatch({
      type: types.PRODUCT_CREATE_SUCCESS,
      formData,
    });
    dispatch(commonUiActions.showToastMessage('상품 생성 완료', 'success'));
  } catch (err) {
    dispatch({ type: types.PRODUCT_CREATE_FAIL, payload: err.error });
    dispatch(commonUiActions.showToastMessage(err.error, 'error'));
  }
};
const deleteProduct = (id) => async (dispatch) => {};

const editProduct = (formData, id) => async (dispatch) => {
  try {
    dispatch({ type: types.PRODUCT_EDIT_REQUEST });
    const res = await api.put(`/product/${id}`, formData);

    if (res.status !== 200) throw new Error(res.error);
    dispatch({ type: types.PRODUCT_EDIT_SUCCESS, payload: res.data.data });
    dispatch(commonUiActions.showToastMessage('상품 수정 완료', 'success'));
    dispatch(getProductList({ page: 1, name: '' }));
  } catch (err) {
    dispatch({ type: types.PRODUCT_EDIT_FAIL, payload: err.error });
    dispatch(commonUiActions.showToastMessage(err.error, 'error'));
  }
};

export const productActions = {
  getProductList,
  createProduct,
  deleteProduct,
  editProduct,
  getProductDetail,
};
