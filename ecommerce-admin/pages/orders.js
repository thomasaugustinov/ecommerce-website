import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        })
    }, []);
    return  (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Product</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr>
                            <td>{(new Date(order.createdAt)).toLocaleString('ro-RO')}</td>
                            <td>
                                {order.name} <br /> {order.email} <br />
                                {order.country} {order.state} <br />
                                {order.city} {order.postalCode} {order.streetAddress} <br />
                            </td>
                            <td>
                                {order.line_items.map(line => (
                                    <>
                                    {line.price_data?.product_data.name} Quantity: {line.quantity} <br />
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}