import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Spinner} from "@/components/index";
import {subHours} from "date-fns";
const HomeStats = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(()=>{
        setIsLoading(true);
        axios.get('/api/orders').then(res=>{
            setOrders(res.data);
            setIsLoading(false);
        })
    },[])
    function ordersTotal(orders){
        let sum = 0;
        orders.forEach(o=>{
            const {line_items}= o;
            line_items.forEach(lineItem=>{
                const lineSummary = lineItem.quantity * lineItem.price_data.unit_amount / 100;
                sum+=lineSummary;
            })
        })
        return new Intl.NumberFormat('sv-SE').format(sum);
    }
    if (isLoading) {
        return (<div className={'my-4'}>
                    <Spinner fullWidth={true}/>
                </div>)
    }

    const ordersToday = orders.filter(o=> new Date(o.createdAt) > subHours(new Date,24));
    const ordersWeek = orders.filter(o=> new Date(o.createdAt) > subHours(new Date,24*7));
    const ordersMonth = orders.filter(o=> new Date(o.createdAt) > subHours(new Date,24*30));


    return (
        <div>
            <h2>Orders</h2>
            <div className={'tiles-grid'}>
                <div className={'tile'}>
                    <h3 className={'tile-header'}>Today</h3>
                    <div className={'tile-number'}>
                        {ordersToday.length}
                    </div>
                    <div className={'tile-desc'}>{ordersToday.length} orders today</div>

                </div>
                <div className={'tile'}>
                    <h3 className={'tile-header'}>This week</h3>
                    <div className={'tile-number'}>
                        {ordersWeek.length}
                    </div>
                    <div className={'tile-desc'}>
                        {ordersWeek.length} orders this week</div>

                </div>
                <div className={'tile'}>
                    <h3 className={'tile-header'}>This month</h3>
                    <div className={'tile-number'}>
                        {ordersMonth.length}
                    </div>
                    <div className={'tile-desc'}> {ordersMonth.length} orders this month</div>
                </div>
            </div>
            <h2>Revenue</h2>
            <div className={'tiles-grid'}>
                <div className={'tile'}>
                    <h3 className={'tile-header'}>Today</h3>
                    <div className={'tile-number'}>
                        $ {ordersTotal(ordersToday)}
                    </div>
                    <div className={'tile-desc'}>{ordersToday.length} orders today</div>

                </div>
                <div className={'tile'}>
                    <h3 className={'tile-header'}>This week</h3>
                    <div className={'tile-number'}>
                        $ {ordersTotal(ordersWeek)}
                    </div>
                    <div className={'tile-desc'}> {ordersWeek.length} orders this week</div>

                </div>
                <div className={'tile'}>
                    <h3 className={'tile-header'}>This month</h3>
                    <div className={'tile-number'}>
                        $ {ordersTotal(ordersMonth)}
                    </div>
                    <div className={'tile-desc'}> {ordersMonth.length} orders this month</div>

                </div>
            </div>

        </div>
    );
};

export default HomeStats;