import styled from 'styled-components';
import Button from './Button';
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from './CartContext';

const ProductWrapper = styled.div`
    // display: flex;
    // flex-direction: column;
    // gap: 10px;
`;

const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 20px;
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 100%;
        max-height: 80px;
    }
`;

const Title = styled(Link)`
    margin: 0;
    font-size: .9rem;
    color: inherit;
    text-decoration: none;
    font-weight: normal;
    color: #222;
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2px;
`;

const Price = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
    color: #222;
`;

export default function ProductBox({_id, title, descrition, price, images}) {
    const {addProduct} = useContext(CartContext);
    const url = '/product/' + _id;
    return (
        <ProductWrapper>
            <WhiteBox href={url}>
                <div>
                    <img src={images?.[0]} alt={title} />
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    <Price>${price}</Price>
                    <Button onClick={() => addProduct(_id)} primary outline>Add to cart</Button>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    );
}