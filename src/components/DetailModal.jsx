import React, { useEffect, useState } from 'react';
import { downloadFile } from '../api/search';
import { HiOutlineHeart, HiHeart,HiOutlineDownload } from 'react-icons/hi';
import { useLike } from '../hook/useLike';

export default function DetailModal({onClose,info,user}) {
    const [result,setResult] = useState(info);
    const result_date = new Date(result?.image_date).toString();
    const [like,setLike] = useState(result?.favorite_yn);

    const likeMutate = useLike('data'); // data가 업데이트 키
    
    useEffect(()=>{
        setResult(info);
        setLike(info?.favorite_yn);
    },[info]);

    useEffect(()=>{
        document.body.style.cssText = `
            position: fixed; 
            top: -${window.scrollY}px;
            overflow-y: scroll;
            width: 100%;`;
        return () => {
        const scrollY = document.body.style.top;
        document.body.style.cssText = "";
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
        };
    },[]);
    
    const likeImage = () => {
        likeMutate.mutate({ uid : user?.uid ,id : result?.id});
    }

    const getDate = (date_str) => {
        const date = new Date(date_str);

        const month = String(date.getMonth() + 1).padStart(2,"0");
        const day = String(date.getDate()).padStart(2,"0");
        const hour = String(date.getHours()).padStart(2,"0");
        const minites = String(date.getMinutes()).padStart(2,"0");
        const seconds = String(date.getSeconds()).padStart(2,"0");

        return date.getFullYear().toString()+'-'+month+'-'+day+' '+hour+':'+minites+':'+seconds;
    }

    const RGBToHex = (rgb) => {
        const r = rgb.red.toString(16).padStart(2, '0');
        const g = rgb.green.toString(16).padStart(2, '0');
        const b = rgb.blue.toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    return(
        <>
        <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex max-h-full w-full items-center justify-center p-4 sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className='grid grid-cols-4'>
                                <div className='flex col-span-2 w-full h-96 items-center'>
                                    <img src={result?.image_url} alt='url'/>
                                </div>
                                <div className='col-span-2 pl-4'>
                                    <header className='flex'>
                                        <div className='w-5/6 outline-none focus:outline-none p-5'></div>
                                        <button type="button" className="w-1/6 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={onClose} >
                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        </button>
                                    </header>
                                    <ul className='grid grid-cols-1 gap-x-3 gap-y-3'>
                                        <li>size : {result?.image_width} x {result?.image_height}</li>
                                        <li>category : {result?.parent_name} &gt; {result?.category_name}</li>
                                        <li className='pb-3'>created : {getDate(result_date)}</li>
                                        {result?.rgb_info && 
                                            <li> color :
                                            {result?.rgb_info.map((rgb)=> (
                                                <div className='inline-block m-2'
                                                    style={{backgroundColor : RGBToHex(rgb)}}>{RGBToHex(rgb)+" "}</div>
                                            ))}
                                            </li>
                                        }
                                        {result?.image_location &&
                                            <li>place : {result?.image_location}</li>}
                                        <li className="absolute bottom-0 w-full pt-2">
                                            <hr/>
                                            <div className="grid grid-cols-9 pt-2 pb-3">
                                                <div className="text-2xl col-span-1" onClick={likeImage}>{like === 'n' ? <HiOutlineHeart className="text-gray-500"/> : <HiHeart className="text-red-400"/>}</div>
                                                <HiOutlineDownload className="text-2xl right-0" onClick={()=>{downloadFile(info.image_url)}}/>
                                            </div>
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}