import { create } from "zustand";

interface DeleteState {
    is_open:boolean;
    set_open:(action:()=>void|Promise<void>,close_modal:boolean)=>void;
    close:()=>void;
    close_modal?:boolean;
    delete_action:(()=>void|Promise<void>)|null;
    on_confirm:()=>void;
}

export const useDeleteModal = create<DeleteState>((set,get)=>(
    {
        is_open:false,
        delete_action:null,
        close_modal:true,
        set_open:(action,close_modal)=>{
            set({delete_action:action,is_open:true,close_modal})
            //set({is_open:true})
        },
        close() {
            set({is_open:false})
        },
        on_confirm() {
            const { delete_action,close_modal } = get();
            if(delete_action){
                const act = delete_action();
                if(act instanceof Promise){
                    if(close_modal)
                    act.finally(()=>set({is_open:false,delete_action:null}));
                    
                }else{
                    if(close_modal)
                    set({is_open:false,delete_action:null});
                    else
                    console.log('Close modal is false');
                }
            }
            
            set({is_open:false});
        }, 
    }
))