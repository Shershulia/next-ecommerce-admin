import React, {useEffect, useState} from 'react';
import {Layout, Spinner} from "@/components";
import axios from "axios";
import Swal from "sweetalert2";

const SettingsPage = () => {
    const [products,setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [featuredId,setFeaturedId]= useState('');
    const [shippingFee, setShippingFee] = useState('');
    useEffect(()=>{
       setIsLoading(true);
       fetchAll().then(()=>{
           setIsLoading(false)
       });
    },[]);
    async  function fetchAll(){
        await axios.get('/api/products').then(res=>{
            setProducts(res.data)
        })
        await axios.get('api/settings?name=featuredProductId').then(
            res=>{
                setFeaturedId(res.data.value);
            }
        )
        await axios.get('api/settings?name=shippingFee').then(
            res=>{
                setShippingFee(res.data.value);
            }
        )

    }
    const saveSettings = async () =>{
        setIsLoading(true);
        await axios.put('/api/settings',{
            name:'featuredProductId',
            value:featuredId
        });
        await axios.put('/api/settings',{
            name:'shippingFee',
            value:shippingFee
        });
        setIsLoading(false);

        await Swal.fire('Saved!', '', 'success');

    }
    return (
        <Layout>
            <h1>Settings</h1>
            {isLoading && (
                <Spinner/>
            )}
            {!isLoading  && (
                <>
                    <label>Featured product</label>
                    <select value={featuredId} onChange={(ev)=>setFeaturedId(ev.target.value)}>
                        {products.length>0 && products.map(product=>(
                            <option value={product._id} key={product._id}>{product.title}</option>
                        ))}
                    </select>
                    <label>Shipping price (in usd)</label>
                    <input type={'number'} value={shippingFee} onChange={(ev)=>{setShippingFee(ev.target.value)}}/>
                    <div>
                        <button onClick={saveSettings} className={'btn-primary'}>Save featured</button>
                    </div>
                </>
            )}

        </Layout>
    );
};

export default SettingsPage;