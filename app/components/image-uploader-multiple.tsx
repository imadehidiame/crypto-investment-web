import React,{ useCallback, useEffect, useState } from "react"
import { useDropzone } from 'react-dropzone';
import { Button } from "./ui/button";
//import { return_random_uuid, upload_image_file } from "@/app/lib/app-write-server-query";
//import Image from "next/image";
import { Trash } from "lucide-react";
const ImageUploaderMultiple:React.FC<{fieldChange:(file:any)=>void,mediaUrl:string[]|File[],extensions?:string[],is_multiple?:boolean,size_limit?:number,file_count?:number,on_change?:(value:string[]|File[])=>void}> = ({fieldChange,mediaUrl,extensions,is_multiple,size_limit,file_count,on_change})=>{
    //const [file, set_file] = useState('');
    const [file_url,set_file_url] = useState('');
    const [file_urls,set_file_urls] = useState<string[]>([]);
    //const [is_upload,set_is_upload] = useState(false);

   

    useEffect(()=>{
        const upload_file = async ()=>{

            if(mediaUrl && mediaUrl.length > 0){
                if(is_multiple){
                    const files_array:string[] = [];
                    mediaUrl.forEach(element => {
                        if(element instanceof File){
                                //set_file_url(URL.createObjectURL(element)); 
                                files_array.push(URL.createObjectURL(element))
                            }else{
                                //set_file_url(element);
                                files_array.push(element);
                        }    
                    });
                    //const element = mediaUrl[0];
                    set_file_urls(files_array);

                }else{

                    const element = mediaUrl[0];
                    if(element instanceof File){
                        set_file_url(URL.createObjectURL(element)); 
                    
                    /*const reader = new FileReader();

                    reader.addEventListener('loadend',async ()=>{
                        const {file_id,mime} = await upload_image_file(reader.result as ArrayBuffer,false,undefined,'webp',50,'71e28344-6057-41b1-8b24-fef35ae7618f');         
                        console.log({file_id,mime});
                    });
                    reader.readAsArrayBuffer(element);*/
                    
                }else{
                    set_file_url(element);
                }

                }
                
                }else{
                    if(is_multiple)
                        set_file_urls([]);
                    else
                        set_file_url('');
                }
        }
        upload_file();
        
    },[mediaUrl]);

    const onDrop = useCallback((acceptedFiles: File[]) =>{
        //const file_reader = new FileReader();

        if(is_multiple){
            const accepted:File[] = [];
            if(file_count){
                let current_count = 0;
                for (let index = 0; index < acceptedFiles.length; index++) {
                    const element = acceptedFiles[index];
                    if(size_limit){
                        if( Math.ceil(size_limit * 1024 * 1024) >= element.size){
                            accepted.push(element);
                            current_count++        
                        }
                    }else{
                            accepted.push(element);
                            current_count++;
                    }
                    if(current_count == file_count)
                        break;
                }
                if(accepted.length > 0){
                    fieldChange(accepted);
                    on_change?.(accepted);
                    //set_file_url(URL.createObjectURL(accepted[0]/*new Blob([element])*/));
                }else{
                    fieldChange([]);
                    on_change?.([]);
                    //set_file_url('');
                }

            }else{

                for (let index = 0; index < acceptedFiles.length; index++) {
                    const element = acceptedFiles[index];
                    if(size_limit){
                        if( Math.ceil(size_limit * 1024 * 1024) >= element.size){
                            accepted.push(element);
                        }
                    }else{
                            accepted.push(element);
                    }
                }
                if(accepted.length > 0){
                    fieldChange(accepted);
                    on_change?.(accepted);
                    //set_file_url(URL.createObjectURL(accepted[0]/*new Blob([element])*/));
                }else{
                    fieldChange([]);
                    on_change?.([]);
                    //set_file_url('');
                }

            }
            
            
            

        }else{
            const accepted:File[] = [];
            for (let index = 0; index < acceptedFiles.length; index++) {
                const element = acceptedFiles[index];
                if(size_limit){
                    if( (size_limit * 1024 * 1024) >= element.size){
                        accepted.push(element);
                        break;
                    }
                }else{
                    accepted.push(element);
                    break;     
                }
            }
            if(accepted.length > 0){
                fieldChange(accepted);
                on_change?.(accepted);
                //set_file_url(URL.createObjectURL(accepted[0]/*new Blob([element])*/));
            }else{
                fieldChange([]);
                on_change?.([]);
                //set_file_url('');
            }
        }

    },[]);
    const { getRootProps,getInputProps,isDragActive,open } = useDropzone(
        {
            onDrop,
            noClick:true,
            noKeyboard:true,
            //multiple:is_multiple,
            //maxFiles:file_count,
            //maxSize:size_limit ? Math.ceil(size_limit * 1024 * 1024) : undefined,
            accept:{
                'image/*': extensions ? extensions.map(e=>e.startsWith('.')?e.toLocaleUpperCase():`.${e.toLocaleLowerCase()}`) : ['.png','.jpeg','.jpg','.svg','.webp','.zip','.pdf','.mp4','.mp3','.txt']
                //fffdgood day 
            }

    });
    return (

            is_multiple ? 

    <div {...getRootProps()} className="flex justify-start flex-col rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />
      {file_urls.length > 0 ? (
        <div className="w-full bg-slate-400 rounded-2xl p-4 overflow-x-auto">
            {/*<div className="flex flex-row flex-wrap gap-2">*/}
          <div className="flex flex-row gap-2">
            {file_urls.map((file_url, index) => (
              <div key={index} className="relative w-[150px] h-[150px] flex-shrink-0">
                <img
                  src={file_url}
                  className="w-full h-full object-contain rounded-lg"
                  alt={`Uploaded image ${index + 1}`}
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent dropzone trigger
                    //removeImage(index);
                    open();
                  }}
                  variant="default"
                  size="icon"
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-[300px] bg-slate-400 rounded-2xl max-w-5xl flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="70"
            className="mb-3"
            viewBox="0 0 30 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 5h6" />
            <path d="M19 2v6" />
            <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            <circle cx="9" cy="9" r="2" />
            <g transform="translate(0, 8)">
              <rect x="2" y="7" width="20" height="20" rx="1" ry="1" />
              <path d="M10 8l4 2-4 2z" fill="currentColor" />
            </g>
          </svg>
          <h3 className="font-bold">Drag photo here</h3>
          <p>
            [{extensions ? extensions.join(",") : [".png", ".jpeg", ".jpg", ".svg", ".webp", ".zip", ".pdf", ".mp4", ".mp3", ".txt"].join(",")}]
          </p>
          <Button
            variant="default"
            size="default"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
          >
            Select from device
          </Button>
        </div>
      )}
    </div>

            :

            <div {...getRootProps()} className="flex justify-start flex-col rounded-xl cursor-pointer">
                <input {...getInputProps()} className="cursor-pointer" />
                {

                    file_url ?
                    <div className="w-full h-[300px] bg-slate-400 rounded-2xl max-w-5xl flex flex-col items-center justify-center relative">
            <div className="w-[300px] h-[300px] relative">

            
                <img
                    src={file_url}
                    className="absolute top-0 left-0 w-full h-full object-contain"
                    alt=""
                    style={{ objectPosition: 'center' }}
                />
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        open();
                    }}
                    variant={'default'}
                    size={'icon'}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                >
                    <Trash />
                </Button>
            </div>
        </div>
                    :
                    <div className="w-full h-[300px] bg-slate-400 rounded-2xl max-w-5xl flex flex-col items-center justify-center">



                        {/*<img src="http://localhost:3009/api/cdn/image/67dbb18e0006234c4cf3" className="w-[100px] h-[100px]" />*/}

<svg xmlns="http://www.w3.org/2000/svg" width="100" height="70" className="mb-3" viewBox="0 0 30 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M16 5h6" />
  <path d="M19 2v6" />
  <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  <circle cx="9" cy="9" r="2" />

  <g transform="translate(0, 8)">
    <rect x="2" y="7" width="20" height="20" rx="1" ry="1" />
    <path d="M10 8l4 2-4 2z" fill="currentColor" />
  </g>
</svg>
<h3 className="font-bold">Drag photo here</h3>
<p>[{extensions?extensions.join(','):['.png','.jpeg','.jpg','.svg','.webp','.zip','.pdf','.mp4','.mp3','.txt'].join(',')}]</p>
<Button variant={'default'} size={'default'} onClick={(e)=>{e.preventDefault();open()}}>Select from device</Button>

                    </div>
                }
            </div>
        )
}

export default ImageUploaderMultiple;