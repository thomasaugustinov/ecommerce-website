import ProductBox from "./ProductBox";
import styled from "styled-components";

const StyledProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    padding-top: 10px;
    padding-bottom: 30px;
`;

export default function ProductsGrid({products}) {
    return (
        <StyledProductsGrid>
            {products?.length > 0 && products.map((product) => (
                    <ProductBox key={product._id} {...product} />
                ))}
        </StyledProductsGrid>
    );
}