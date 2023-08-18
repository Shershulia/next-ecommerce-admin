import React, {useEffect, useState} from 'react';
import {Layout, Spinner} from "@/components";
import axios from "axios";

const OrdersPage = () => {

    const [orders,setOrders]= useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(()=>{
        setIsLoading(true);
        axios.get('/api/orders').then(response=>{
            setOrders(response.data);
            setIsLoading(false);
        })
    },[])
    return (
        <Layout>
            <h1>Orders</h1>
            <table className={'basic'}>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Paid</th>
                    <th>Recipient</th>
                    <th>Products</th>
                </tr>
                </thead>
                <tbody>
                {isLoading && (
                    <tr>
                        <td colSpan={4}>
                            <div className={'py-4'}>
                                <Spinner fullWidth={true}/>
                            </div>
                        </td>
                    </tr>
                )}
                {orders.length>0 && orders.map(order=>(
                    <tr key={order._id}>
                        <td>
                            {(new Date(order.createdAt)).toLocaleString()}
                        </td>
                        <td className={`${order.paid ? 'bg-green-100' : 'bg-red-100' }`}>{order.paid ? 'YES' : 'NO'}</td>
                        <td>{order.name} {order.email} <br/>
                            {order.city} {order.postalCode} {order.country} <br/>
                            {order.streetAddress}</td>
                        <td>
                            {order.line_items.map(l=>(
                                <>
                                    {/*{l.price_data.name} X {l.quantity}*/}
                                    {l.price_data?.product_data.name} X {l.quantity} <br/>
                                </>
                            ))}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default OrdersPage;