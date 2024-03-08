import {useEffect, useState} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import Layout from '@/components/Layout';
import { set } from 'mongoose';
import Spinner from './Spinner';
import {ReactSortable} from 'react-sortablejs';
import Link from 'next/link';
import swal from 'sweetalert2';

export default function ProductForm({
    _id, 
    title:existingTitle, 
    description: existingDescription, 
    price: existingPrice, 
    images: existingImages, 
    category: assignedCategory,
    properties: assignedProperties
}) {
    const[title, setTitle] = useState(existingTitle || '');
    const[description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const[price, setPrice] = useState(existingPrice || '');
    const[images, setImages] = useState(existingImages || []); 
    const[goToProducts, setGoToProducts] = useState(false);
    const[isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/categories').then(res => {
            setCategories(res.data);
        });
    }, []);
    async function saveProduct(ev){
        ev.preventDefault();
        swal.fire({
            title: 'Are you sure you want to proceed?',
            text: 'Any changes, including image removals, will be saved.',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Proceed',
            confirmButtonColor: '#d60035',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                for (let link of existingImages) {
                    if (!images.includes(link)) {
                        try {
                            await axios.delete('/api/products', { 
                                params: { 
                                    id: _id,
                                    imageUrl: link 
                                } 
                            });
                        } catch (error) {
                            console.error("Failed to delete image from the database", error);
                        }
                    }
                }
                const data = {title, description, price, images, category, properties: productProperties};
                if(_id){
                    await axios.put('/api/products', {...data, _id});
                } else {
                    await axios.post('/api/products', data);
                }
                setGoToProducts(true);
            } else if (result.isDismissed) {
                // router.push('/products');
            }
        });
    }
    if(goToProducts){
        router.push('/products');
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if(files?.length > 0){
            setIsUploading(true);
            const formData = new FormData();
            for(const file of files){
                formData.append('file', file);
            }
            const res = await axios.post('/api/upload', formData);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    function updateImagesOrder(images)
    {
        setImages(images);
    }
    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        });
    }
    const propertiesToFill = [];
    if(categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }
    function deleteImage(index) {
        setImages(prevImages => {
            return prevImages.filter((_, imageIndex) => imageIndex !== index);
        });
    }
    return(
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input type="text" placeholder="product name" value={title} onChange={ev => setTitle(ev.target.value)}/>
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">No category</option>
                {categories.length > 0 && categories.map((category, index) => (
                    <option key={index} value={category._id}>{category.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map((p, index) => (
                <div key={index} className="">
                    <label>{p.name}</label>
                    <div>
                        <select value={productProperties[p.name]} onChange={ev => setProductProp(p.name, ev.target.value)}>
                            {p.values.map((v, valueIndex) => (
                                <option key={valueIndex} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <label>
                Images
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable list={images} className="flex flex-wrap gap-1" setList={updateImagesOrder}>
                    {!!images?.length && images.map((link, index) => (
                        <div key={index} className="h-24 bg-white p-4 shadow-sm rounded-md border border-gray-200 relative group">
                            <img src={link} alt="" className="rounded-lg"/>
                            <button type="button" className="bg-bgBtnRed text-btnRed absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteImage(index, link)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner/>
                    </div>
                    )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-bgGray rounded-md bg-white shadow-sm border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Add image</div>
                    <input type="file" onChange={uploadImages} className='hidden'/>
                </label>
            </div>
            <label>Description</label>
            <textarea placeholder="description" value={description} onChange={ev => setDescription(ev.target.value)}/>
            <label>Price (in USD)</label>
            <input type="number" placeholder="price" value={price} onChange={ev => setPrice(ev.target.value)} className='mb-4'/>
            <button type="button" onClick={() => router.push('/products')} className="bg-white text-bgGray px-4 py-1 rounded-md border border-gray-200 shadow-sm mr-2">Cancel</button>
            <button className="btn-primary">Save</button>
        </form>
    );
}