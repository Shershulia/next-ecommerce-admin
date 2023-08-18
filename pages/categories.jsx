import React, {useEffect, useState} from 'react';
import {Layout, Spinner} from "@/components";
import axios from "axios";
import Swal from "sweetalert2";

const Categories = () => {
    const [name,setName] = useState('');
    const [categories,setCategories] = useState([]);
    const [parentCategory,setParentCategory] = useState('');
    const [editedCategory,setEditedCategory]= useState(null);
    const [properties,setProperties]= useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const saveCategory = async (ev) =>{
        ev.preventDefault();
        const data = {name,parentCategory,properties:properties.map(property=>{
            if (typeof property.values === "string")
                return {name:property.name,values: property.values.split(',')};
            else return {...property};
            })};
        if(editedCategory){
            await axios.put('/api/categories', {...data,_id:editedCategory._id,});
            setEditedCategory(null);
            setParentCategory('');
            setProperties([]);
        }else{
            await axios.post('/api/categories', data);
        }
        setName('');
        fetchCategories();
    }

    const deleteCategory = async (category) =>{
        Swal.fire({
            title: `Do you want to delete the category ${category.name}?`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                await axios.delete(`/api/categories?id=${category._id}`);
                Swal.fire('Deleted!', '', 'success');
                fetchCategories();
            }
        })
    }

    const fetchCategories = () =>{
        setIsLoading(true);
        axios.get('/api/categories').then(result=>{
            setCategories(result.data);
            setIsLoading(false);
        });
    }
    const editCategory = (category) =>{
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties);
    }
    const addProperty = () =>{
        setProperties(prev => {
            return [...prev,{name:'',values:''}]
        });
    }
    useEffect(()=>{
        fetchCategories();
    },[])

    const handlePropertyNameChange = (index,property,newName)=>{
        setProperties(prevState => {
            const properties = [...prevState];
            properties[index].name=newName
            return properties
        })
    }
    const handlePropertyValuesChange = (index,property,newValues)=>{
        setProperties(prevState => {
            const properties = [...prevState];
            properties[index].values=newValues
            return properties
        })
    }
    const removeProperty = (index)=>{
        setProperties([...properties.slice(0,index),...properties.slice(index+1,properties.length)])
        };

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit category ${editedCategory.name}` :'Create new category'}</label>
            <form className={'my-2'} onSubmit={saveCategory}>
                <div className={'flex gap-2'}>
                    <input className={'mb-0 max-w-lg'} type='text' placeholder={'Category name'} value={name} onChange={ev=>setName(ev.target.value)}/>
                    <select className={'mb-0 max-w-lg'} value={parentCategory} onChange={event => setParentCategory(event.target.value)}>
                        <option value={''}>No parent category</option>
                        {categories.length>0 && categories.map(category=>(
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={'my-2'}>
                    <label className={'block'}>Properties</label>
                    <button type={'button'} className={'btn-secondary mt-2'}
                    onClick={addProperty}>Add new property</button>
                    {properties.length>0 && properties.map((property,index)=>(
                        <div className={'flex gap-1 my-2'} key={index}>
                            <input type={"text"}
                                   className={'mb-0'}
                                   value={property.name}
                                   onChange={(ev)=>handlePropertyNameChange(index,property,ev.target.value)}
                                   placeholder={'property name (example:color)'}/>
                            <input type={"text"}
                                   value={property.values}
                                   className={'mb-0'}
                                   onChange={(ev)=>handlePropertyValuesChange(index,property,ev.target.value)}
                                   placeholder={'values, comma separated'}/>
                            <button className={'btn-red'} onClick={()=>removeProperty(index)} type={'button'}>Remove</button>
                        </div>
                    ))}
                </div>
                <div className={'flex gap-2'}>
                    <button className={'btn-primary'} type={'submit'}>Save</button>
                    {editedCategory && (
                        <button className={'btn-red'} type={'button'}
                        onClick={()=>{
                            setName('');
                            setEditedCategory(null);
                            setParentCategory('');
                            setProperties([]);
                        }}>Cancel</button>
                    )}
                </div>
            </form>
            {!editedCategory && (
                <table className={'basic'}>
                    <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={3}>
                                <div className='py-4'>
                                    <Spinner fullWidth={true}></Spinner>
                                </div>
                            </td>
                        </tr>
                    )}
                    {categories.length>0 && categories.map(category=>(
                        <tr key={category._id}>
                            <td>
                                {category.name}
                            </td>
                            <td>
                                {category?.parent?.name}
                            </td>
                            <td>
                                <div className={'flex items-center justify-around md:flex-row flex-col'}>
                                    <button className={'btn-primary my-1'} onClick={()=>editCategory(category)}>Edit</button>
                                    <button className={'btn-red mb-1'} onClick={()=>deleteCategory(category)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
};

export default Categories;