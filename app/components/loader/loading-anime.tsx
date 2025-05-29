//'use client';
//import { usePathname } from 'next/navigation';
import styles from './loader-styles.module.css'
import { cn } from './../../lib/utils'
import { use, useEffect,useState } from 'react';
import toast from 'react-hot-toast';

export default function LoadingAnime() {
    //const path = usePathname();
    //const [path_name,set_path_name] = useState(path);

    useEffect(()=>{
        
    },);
    /*useEffect(()=>{
        const loading_bar = document.getElementById('loading-bar');
        if(loading_bar){
            loading_bar.classList.remove('hidden');
        }
    },[path]);*/
    return ( 
    <>
        <div id='loading-bar' className={cn(styles.load_bar,'hidden')}></div>
        <div id="loading-circle" className={cn('fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-white bg-opacity-30','hidden')}>
        {/*<div className="w-20 h-20 border-8 border-t-8 border-blue-200 rounded-full animate-spin"></div>*/}
        <div className={styles.loading_circle}></div> 
        </div>
    </>
    )
}

interface LoaderInit {
    loading:'both'|'circular'|'bar';
    duration?:number;
    is_show?:boolean;
}

const hide_show_anime =  ({loading,is_show}:LoaderInit)=>{
    const loading_bar = document.getElementById('loading-bar');
    const loading_circle = document.getElementById('loading-circle');
    switch (loading) {
        case 'circular':
            if(is_show){
                loading_circle?.classList.remove('hidden');
                loading_circle?.classList.add('flex');
            }
            else
                loading_circle?.classList.add('hidden');
            break;
        case 'bar':
            if(is_show)
                loading_bar?.classList.remove('hidden');
            else
                loading_bar?.classList.add('hidden');
            break;
        case 'both':
            if(is_show){
                loading_circle?.classList.remove('hidden');
                loading_circle?.classList.add('flex');
                loading_bar?.classList.remove('hidden');
            }else{
                loading_circle?.classList.add('hidden');
                loading_bar?.classList.add('hidden');
            }
            break;
        default:
            throw new Error('Invalid loading option',{cause:500});
            //break;
    }
} 

export const loader = ({loading,duration,is_show}:LoaderInit)=>{
    //if(loader_init.hasOwnProperty('')){}
    if(duration){
        hide_show_anime({loading,is_show});
        setTimeout(()=>{
            hide_show_anime({loading,is_show:!is_show});
        },duration);
    }else{
        hide_show_anime({loading,is_show});
    }
}

export class LoadAnimation {
    static show = (loading:'both'|'circular'|'bar',duration?:number)=>{
        loader({loading,duration,is_show:true});
    }
    static hide = (loading:'both'|'circular'|'bar',duration?:number,log?:string)=>{
        loader({loading,duration,is_show:false});
        if(log){
            console.log('LoadAnimation.hide() called in '+log);
        }
    }
    static is_animation_invisible = (loading:'both'|'circular'|'bar') =>{
        const loading_bar = document.getElementById('loading-bar');
        const loading_circle = document.getElementById('loading-circle');
        switch (loading) {
            case 'bar':
            return loading_bar?.classList.contains('hidden');        
            //break;
            case 'circular': 
            return loading_circle?.classList.contains('hidden');
            case 'both':
            return loading_bar?.classList.contains('hidden') && loading_circle?.classList.contains('hidden');
            default:
            return loading_bar?.classList.contains('hidden') && loading_circle?.classList.contains('hidden');
            //break; 
        }
    }
} 

export class Toasting {
    static success = (message:string,duration=10000,position?:'top-center') => {
        toast.success(message,{duration,position:position?position:'top-center'})
        //toast(message,{duration,})
    }
    static error = (message:string,duration=10000,position?:'top-center') => {
        toast.error(message,{duration,position:position?position:'top-center'})
        //toast(message,{duration,})
    }
}