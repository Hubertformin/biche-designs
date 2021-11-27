import {applyMiddleware, createStore} from "redux";
import {ADD_CART, REMOVE_CART} from "./actionTypes";
import {useMemo} from "react";
import {composeWithDevTools} from "redux-devtools-extension";

let store;
const initialState = {
    cart: getCartFromSession()
};

function cartReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_CART: {
            const exist = state.cart.find(el => el.id === action.payload.id);
            if (!exist) {
                console.log(state.cart, action.payload);
                state.cart = [...state.cart, action.payload];
                // save to session storage
                saveCartToSession(state.cart);
            }
            console.log(state.cart);
            return state;
        }
        case REMOVE_CART: {
            const { id } = action.payload;
            state.cart = state.cart.filter(el => el.id !== id);
            // save to session storage
            saveCartToSession(state.cart);
            return state;
        }
        default:
            return state;
    }
}

function initStore(preloadedState = initialState) {
    return createStore(
        cartReducer,
        preloadedState,
        composeWithDevTools(applyMiddleware())
    )
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? initStore(preloadedState);

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = initStore({
            ...store.getState(),
            ...preloadedState,
        });
        // Reset the current store
        store = undefined
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store;
    // Create the store once in the client
    if (!store) store = _store;

    return _store
};

export function useStore(initialState) {
    const store = useMemo(() => initializeStore(initialState), [initialState]);
    return store
}



function getCartFromSession() {
    if (typeof window !== "undefined" ) {
        if (sessionStorage.getItem('cart')) {
            return JSON.parse(sessionStorage.getItem('cart'));
        }
        return [];
    }
    return [];
}

function saveCartToSession(cart) {
    if (typeof window !== "undefined" ) {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }
}
