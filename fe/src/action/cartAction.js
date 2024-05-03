import api from '../utils/api';
import * as types from '../constants/cart.constants';
import { commonUiActions } from '../action/commonUiAction';
const addToCart =
  ({ id, size }) =>
  async (dispatch) => {
    try {
      dispatch({ type: types.ADD_TO_CART_REQUEST });
      const res = await api.post('/cart', { productId: id, size, qty: 1 });

      if (res.status !== 200) throw new Error(res.error);

      dispatch({ type: types.ADD_TO_CART_SUCCESS, payload: res.data.cartItemQty });
      dispatch(commonUiActions.showToastMessage('카트 상품 추가', 'success'));
    } catch (err) {
      dispatch({ type: types.ADD_TO_CART_FAIL, error: err.error });
      dispatch(commonUiActions.showToastMessage('카트 상품 실패', 'error'));
    }
  };

const getCartList = () => async (dispatch) => {};
const deleteCartItem = (id) => async (dispatch) => {};

const updateQty = (id, value) => async (dispatch) => {};
const getCartQty = () => async (dispatch) => {};
export const cartActions = {
  addToCart,
  getCartList,
  deleteCartItem,
  updateQty,
  getCartQty,
};
