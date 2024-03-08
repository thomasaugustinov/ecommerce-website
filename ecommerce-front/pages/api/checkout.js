import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if(req.method !== 'POST') {
        res.json({message: 'Method not allowed'});
        return;
    }
    const {name, email, country, state, city, postalCode, streetAddress, cartProducts} = req.body;
    await mongooseConnect();
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfo = await Product.find({_id: uniqueIds});

    let line_items = [];
    for(const productId of uniqueIds) {
        const product = productsInfo.find(p => p._id.toString() === productId);
        const quantity = productsIds.filter(id => id === productId)?.length || 0;
        if(quantity > 0 && product) {
            line_items.push({
                quantity,
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: product.title,
                    },
                    unit_amount: product.price * quantity * 100,
                },
            });
        }
    }

    const orderDoc = await Order.create({
        line_items,
        name,
        email,
        country,
        state,
        city,
        postalCode,
        streetAddress,
        paid: false,
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.PUBLIC_URL + '/cart?success=1',
        cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
        metadata: {
            orderId: orderDoc._id.toString(),
        },
    });

    res.json({
        url: session.url
    });
}