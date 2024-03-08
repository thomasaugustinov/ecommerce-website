import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { useRouter } from 'next/router';
import { set } from "mongoose";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.3fr .7fr;
    gap: 40px;
    margin-top: 50px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 100px;
    height: 100px;
    padding: 10px;
    border:1px solid rgba(0,0,0,.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        max-width: 80px;
        max-height: 80px;
    }
`;

const QuantityLabel = styled.span`
    padding: 0px 3px;
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

export default function CartPage() {
    const router = useRouter();
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    useEffect(() => {
        if(cartProducts.length > 0) {
            axios.post('/api/cart', {ids: cartProducts}).then(res => {
                setProducts(res.data);
            });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);
    useEffect(() => {
        if(typeof window === 'undefined') {
            return;
        }
        if(window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
        }
        axios.get('/api/address'). then(res => {
            if (res.data && res.data.name) {
                setName(res.data.name);
                setEmail(res.data.email);
                setCountry(res.data.country);
                setState(res.data.state);
                setCity(res.data.city);
                setPostalCode(res.data.postalCode);
                setStreetAddress(res.data.streetAddress);
            }
        })
    }, []);
    function moreOfThisProduct(id) {
        addProduct(id);
    }
    function lessOfThisProduct(id) {
        removeProduct(id);
    }
    async function goToPayment() {
        const response = await axios.post('/api/checkout', {
            name,
            email,
            country,
            state,
            city,
            postalCode,
            streetAddress,
            cartProducts,
        })
        if(response.data.url) {
            window.location = response.data.url;
        }
    }
    let total = 0;
    for(const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price;
    }
    if(isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnsWrapper>
                        <Box>
                            <h1>Thank you for your order!</h1>
                            <p>Your order will be processed as soon as possible.</p>
                        </Box>
                    </ColumnsWrapper>
                </Center>
            </>
        );
    }
    return (
        <>
        <Header />
        <Center>
            <ColumnsWrapper>
                <Box>
                    <h2>Cart</h2>
                    {!cartProducts?.length > 0 && (
                        <div>Your cart is empty</div>
                    )}
                    {products?.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr>
                                        <ProductInfoCell>
                                            <ProductImageBox>
                                                <img src={product.images[0]} alt={product.title} />
                                            </ProductImageBox>
                                            {product.title}
                                        </ProductInfoCell>
                                        <td>
                                            <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                                            <QuantityLabel>
                                            {cartProducts.filter(id => id === product._id).length}
                                            </QuantityLabel>
                                            <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                        </td>
                                        <td>${cartProducts.filter(id => id === product._id).length * product.price}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>${total}</td>
                                </tr>
                            </tbody>
                        </Table>
                    )}
                </Box>
                {!!cartProducts?.length && (
                    <Box>
                        <h2>Order information</h2>
                        <Input type="text" placeholder="Full Name" name="name" value={name} onChange={ev => setName(ev.target.value)}/>
                        <Input type="text" placeholder="Email" name="email" value={email} onChange={ev => setEmail(ev.target.value)}/>
                        <Input type="text" placeholder="Country" name="country" value={country} onChange={ev => setCountry(ev.target.value)}/>
                        <Input type="text" placeholder="State" name="state" value={state} onChange={ev => setState(ev.target.value)}/>
                        <CityHolder>
                            <Input type="text" placeholder="City" name="city" value={city} onChange={ev => setCity(ev.target.value)}/>
                            <Input type="text" placeholder="Postal Code" name="postalCode" value={postalCode} onChange={ev => setPostalCode(ev.target.value)}/>
                        </CityHolder>
                        <Input type="text" placeholder="Street Address" name="streetAddress" value={streetAddress} onChange={ev => setStreetAddress(ev.target.value)}/>
                        <Button black block onClick={goToPayment}>Continue to payment</Button>
                    </Box>
                )}
            </ColumnsWrapper>
        </Center>
        </>
    );
}