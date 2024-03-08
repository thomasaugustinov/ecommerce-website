import { createContext, useEffect } from 'react';
import { useState } from 'react';

export const CartContext = createContext({});


export function CartContextProvider({ children }) {
    const ls = typeof window !== 'undefined' ? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState([]);
    useEffect(() => {
        if(cartProducts?.length) {
            ls?.setItem('cart', JSON.stringify(cartProducts));
        }
    }, [cartProducts]);
    useEffect(() => {
        if(ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart')));
        }
    }, []);
    function addProduct (productId) {
        setCartProducts(prev => [...prev, productId]);
    }
    function removeProduct (productId) {
        setCartProducts(prev => {
            const index = prev.indexOf(productId);
            if(index > -1) {
                return prev.filter((value, i) => i !== index);
            }
            return prev;
        });
    }
    function clearCart() {
        setCartProducts([]);
        ls?.removeItem('cart');
    }
    return (
        <CartContext.Provider value={{cartProducts, setCartProducts, addProduct, removeProduct, clearCart}}>
            {children}
        </CartContext.Provider>
    );
}