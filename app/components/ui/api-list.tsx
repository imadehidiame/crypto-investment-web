'use client';

import { useOrigin } from "@/hooks/use-origin";
//import { useParams, useRouter } from "next/navigation";
import ApiAlert from "./api-alert";

interface ApiListProps{
    entity_name:string;
    entity_id_name: string;
    params:{
        store?:string
    }
}

export default function({entity_id_name,entity_name,params}:ApiListProps){

    //const params = useParams();
    const origin = useOrigin();

    const base_url = `${origin}/api/${params.store}`;

    return (
        <>
            <ApiAlert title="GET" variant="public" description={`${base_url}/${entity_name}`} />
            <ApiAlert title="GET" variant="public" description={`${base_url}/${entity_name}/{${entity_id_name}}`} />
            <ApiAlert title="POST" variant="admin" description={`${base_url}/${entity_name}`} />
            <ApiAlert title="PATCH" variant="admin" description={`${base_url}/${entity_name}/{${entity_id_name}}`} />
            <ApiAlert title="DELETE" variant="admin" description={`${base_url}/${entity_name}/{${entity_id_name}}`} />
        </>
    )
}