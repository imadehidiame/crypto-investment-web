import AlertModal from "@/components/modals/alert-modals";
import { useDeleteModal } from "@/hooks/use-delete-modal";
import { useNavigation } from "react-router";

export default function DeleteAlertProvider(){
    const useDelete = useDeleteModal();
    const navigation = useNavigation();
    return <AlertModal is_open={useDelete.is_open} on_close={()=>{useDelete.close()}} on_confirm={()=>{useDelete.on_confirm()}} loading={navigation.state == 'loading' || navigation.state == 'submitting'} />
}