import * as types from '../constants/product.constants';
const initialState = {};

function productReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.PRODUCT_CREATE_REQUEST:
      return { ...state, loading: true };
    case types.PRODUCT_DELETE_SUCCESS:
      return { ...state, loading: false, error: '' };
    case types.PRODUCT_CREATE_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
}

export default productReducer;
