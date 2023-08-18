import React, {useEffect, useState} from 'react';
import {Layout, ProductForm, Spinner} from "@/components";
import {useRouter} from "next/router";
import axios from "axios";

const EditProductPage = () => {
    const [productInfo,setProductInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {id} = router.query;
    useEffect(()=>{
        if (!id) {
            return;
        }
        setIsLoading(true);
        axios.get(`/api/products?id=${id}`).then(response=> {
            setProductInfo(response.data);
            setIsLoading(false);
        })
    },[id])
    return (
        <div>
            <Layout>
                <h1>Edit Product</h1>
                {isLoading && (<Spinner fullWidth={true}/>)}
                {productInfo && <ProductForm {...productInfo}/>}
            </Layout>
        </div>
    );
};

export default EditProductPage;