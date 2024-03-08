import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { signIn, signOut, useSession } from "next-auth/react"
import styled from "styled-components";
import { useEffect, useState } from "react";
import Input from "@/components/Input";
import axios from "axios";
import { CartContext } from "@/components/CartContext";
import { useContext } from "react";

const Wrapper = styled.div`
    margin: 40px 0;
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

export default function AccountPage() {
    const {clearCart} = useContext(CartContext);
    const {data: session} = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [loaded, setLoaded] = useState(false);
    async function logout () {
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL,
        });
        clearCart();
    }
    async function login () {
        await signIn('google');
    }
    function saveAddress() {
        const data = {name, userEmail: email, country, state, city, postalCode, streetAddress};
        axios.put('/api/address', data);
    }
    
    useEffect(() => {
        axios.get('/api/address').then(res => {
            if (res.data) {
                setName(res.data.name);
                setEmail(res.data.email);
                setCountry(res.data.country);
                setState(res.data.state);
                setCity(res.data.city);
                setPostalCode(res.data.postalCode);
                setStreetAddress(res.data.streetAddress);
                setLoaded(true);
            }
        });
    }, []);
    return (
        <>
            <Header />
            <Center>
                <Wrapper>
                    <WhiteBox>
                        <h2>Account details</h2>
                        {loaded && (
                            <>
                                <Input type="text" placeholder="Full Name" name="name" value={name} onChange={ev => setName(ev.target.value)}/>
                                <Input type="text" placeholder="Email" name="email" value={email} onChange={ev => setEmail(ev.target.value)}/>
                                <Input type="text" placeholder="Country" name="country" value={country} onChange={ev => setCountry(ev.target.value)}/>
                                <Input type="text" placeholder="State" name="state" value={state} onChange={ev => setState(ev.target.value)}/>
                                <CityHolder>
                                    <Input type="text" placeholder="City" name="city" value={city} onChange={ev => setCity(ev.target.value)}/>
                                    <Input type="text" placeholder="Postal Code" name="postalCode" value={postalCode} onChange={ev => setPostalCode(ev.target.value)}/>
                                </CityHolder>
                                <Input type="text" placeholder="Street Address" name="streetAddress" value={streetAddress} onChange={ev => setStreetAddress(ev.target.value)}/>
                                <Button black block onClick={saveAddress}>Save</Button>
                                <hr/>
                            </>
                        )}
                        {session && (
                            <Button primary onClick={logout}>Logout</Button>
                        )}
                        {!session && (
                            <Button primary onClick={login}>Login</Button>
                        )}
                    </WhiteBox>
                </Wrapper>
            </Center>
        </>
    )
}