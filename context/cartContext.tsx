import React, {createContext, useState} from 'react';
import {CartModel} from "../models/item.model";

export const CartContext = createContext({cart: null, addToCart: null, emptyCart: null, removeItem: null, getCartAmount: null, setCartItems: null});

/*
* session storage methods
* */
class Session {
    static saveCart(obj) {
        if (typeof window !== "undefined") {
            sessionStorage.setItem('_cart', JSON.stringify(obj));
        }
    }
    static getCart(): CartModel[] {
        if (typeof window !== "undefined") {
            if (!!sessionStorage.getItem('_cart')) {
                return JSON.parse(sessionStorage.getItem('_cart'));
            }
        }
        return [];
    }
}

const initialData = Session.getCart();

function CartContextProvider({children}) {
    const [cart, setCart] = useState<CartModel[]>(initialData);

    const addToCart = (item: CartModel) => {
        const exist = !!cart.find(it => it.id === item.id);
        if (!exist) {
            setCart([...cart, item]);
            Session.saveCart([...cart, item]);
        }
    };

    const emptyCart = () => {
        setCart([]);
        Session.saveCart([]);
    };

    const removeItem = (id) => {
        const _newData = cart.filter(item => item.id !== id);
        setCart(_newData);
        Session.saveCart(_newData);
    };

    const setCartItems = (items) => {
        setCart([...items]);
        Session.saveCart(items);
    };

    const getCartAmount = () => {
        let total = 0;
        cart.forEach(item => {
            total += Number(item.quantity) * Number(item.unitPrice);
        });
        return total;
    };

    return(
        <CartContext.Provider value={{cart, addToCart, emptyCart, removeItem, getCartAmount, setCartItems}}>
            {children}
        </CartContext.Provider>
    )

}

export default CartContextProvider;
