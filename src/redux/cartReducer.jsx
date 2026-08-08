import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  CLEAR_CART,
} from "./actionTypes";

const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existing = state.cart.find((item) => item.id === action.payload.id);

      let updatedCart;

      if (existing) {
        updatedCart = state.cart.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        updatedCart = [
          ...state.cart,
          {
            ...action.payload,
            quantity: 1,
          },
        ];
      }

      return {
        ...state,
        cart: updatedCart,
      };
    }

    case REMOVE_FROM_CART: {
      const updatedCart = state.cart.filter(
        (item) => item.id !== action.payload
      );

      return {
        ...state,
        cart: updatedCart,
      };
    }

    case CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};

export default cartReducer;
