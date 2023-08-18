import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import axios from "axios";
import Image from "next/image";
import {Spinner} from "@/components/index";
import {ReactSortable} from "react-sortablejs";

const ProductForm = ({_id,title,desc,price,images:existingImages,category:existingCategory,properties:existingProperties}) => {
    const [titleForm, setTitleForm] = useState(title || '');
    const [descForm, setDescForm] = useState(desc ||'');
    const [priceForm, setPriceForm] = useState(price || '');
    const [images,setImages] = useState(existingImages || []);
    const [isUploading,setIsUploading] = useState(false);
    const [categories,setCategories] = useState([]);
    const router = useRouter();
    const [category,setCategory]= useState(existingCategory);
    const [productProperties,setProductProperties]= useState(existingProperties || {});
    const [catIsLoading,setCatIsLoading] = useState(false);

    const data = {title:titleForm,desc:descForm,price:priceForm,images,category,properties:productProperties}

    useEffect(()=>{
        setCatIsLoading(true);
        axios.get('/api/categories').then(result=>{
            setCategories(result.data);
            setCatIsLoading(false);

        });
    },[])
    const  saveProduct = async (e) => {
        e.preventDefault();
        if( _id) {
            await axios.put('/api/products', {...data,_id});
        }else{
            await axios.post('/api/products', data);

        }
        router.push('/products')
    }

    const uploadImage = async (ev) =>{
        ev.preventDefault();
        const files = ev.target?.files;
        if (files?.length>0){
            setIsUploading(true);
            const data = new FormData();
            for (const file of files){
                data.append('file',file);
            }
            const response = await axios.post('/api/upload',data,{
                headers:{'Content-Type':'multipart/form-data'}
            });
            setImages(oldImages => {
                return [...oldImages,...response.data]});
        }   setIsUploading(false);
    }
    const updateImagesOrder = (newOrder) => {
        const newImagesOrder = newOrder.map((item) => item.toString());
        setImages(newImagesOrder);
    };
    const propertiesToFill=[];
    if (categories.length>0 && category){
        let newCategory = categories.find(categoryFrom=> categoryFrom._id===category);
        propertiesToFill.push(...newCategory.properties);
        while (newCategory.parent) {
            newCategory = newCategory.parent;
            newCategory = categories.find(categoryFrom => categoryFrom._id === newCategory._id);
            propertiesToFill.push(...newCategory.properties);
        }
    }

    const changeProductProp = (name,value) =>{
        setProductProperties(prev=>{
            const newProps = {...prev};
            newProps[name]=value;
            return newProps;
        })
    }


    return (
            <div>
                <form onSubmit={saveProduct}>
                    <label>Product name: </label>
                    <input type='text' placeholder='product name' value={titleForm} onChange={(e)=>setTitleForm(e.target.value)}/>
                    <label>Category: </label>
                    <select value={category} onChange={ev=> setCategory(ev.target.value)}>
                        <option value={''}>Uncategorized</option>
                        {categories.length>0 && categories.map(category=>(
                            <option value={category._id} key={category._id}>{category.name}</option>
                        ))}
                    </select>
                    <label>Properties:</label>
                    <div>
                        {catIsLoading && (<Spinner fullWidth={true}/>)}
                        {propertiesToFill.length>0 && propertiesToFill.map(property=>(
                        <div key={property} className={'flex flex-row justify-start items-center'}>
                            <p className={'pr-10 mb-2 flex-1'}> {property.name} </p>
                            <select value={productProperties[property.name]}
                                className={'flex-1'}
                                    onChange={(ev)=>changeProductProp(property.name,ev.target.value)}>
                                {property.values.map(value=>(
                                    <option key={value} className={'text-center'} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                        )
                    )}
                    </div>

                    <label>
                        Photos
                    </label>
                    <div className={'mb-2 flex gap-2 items-center flex-wrap'}>
                        <ReactSortable
                            list={images}
                            setList={updateImagesOrder}
                            className="flex justify-start items-center flex-wrap my-2 gap-2"
                        >
                        {images?.length && (
                            images.map((image)=>(
                                <div key={image} className={'h-12 w-12 md:w-24  md:h-24 relative z-0'}>
                                    <Image src={image} alt={'Image'} fill className={'rounded-lg'}/>
                                </div>
                                )
                            )
                        )
                        }
                        </ReactSortable>
                        {isUploading &&
                            (<div className={'h-12 w-12 md:w-24  md:h-24 relative flex justify-center items-center'}>
                                <Spinner/>
                            </div>)
                        }
                        <label className={'w-12 h-12 md:w-24 md:h-24 rounded-lg bg-gray-200 flex justify-center cursor-pointer'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="black" className="w-12 h-12 md:w-24 md:h-24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"/>
                            </svg>
                            <input type={'file'} className={'hidden'} onChange={uploadImage}/>
                        </label>
                    </div>
                    <label>Description </label>
                    <textarea placeholder='description' value={descForm} onChange={(e)=>setDescForm(e.target.value)}></textarea>
                    <label>Price (in USD)</label>
                    <input type='number' placeholder='price' value={priceForm} onChange={(e)=>setPriceForm(e.target.value)}/>
                    <button type='submit' className='btn-primary'>Save</button>
                </form>
            </div>
    )
};

export default ProductForm;