import React, {useEffect, useState} from 'react'
import {useRouter} from "next/router";
import {Layout} from "@/components";
import axios from "axios";

const DeleteItem = () => {
    const [productInfo,setProductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(()=>{
        if (id) {
            axios.get(`/api/products?id=${id}`).then(response => {
                setProductInfo(response.data)
            })
        } else {
            return;
        }
    },[id])

    const deleteProduct = async () =>{
        await axios.delete(`/api/products?id=${id}`);
        router.push('/products');
    }
  return (
    <div>
        <Layout>
            {productInfo &&
                <div className={'flex flex-col justify-center items-center h-full'} >
                    <h1 className={'text-center'}>Do you really want to delete product {productInfo.title}?</h1>
                <div className={'flex gap-2'}>
                    <button className={'btn-red'} onClick={deleteProduct}>Yes</button>
                    <button className={'btn-primary'} onClick={()=>router.push('/products')}>No</button>
                 </div>
                </div>}

        </Layout>
    </div>
  )
}

export default DeleteItem