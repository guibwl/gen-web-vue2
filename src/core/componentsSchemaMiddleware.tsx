import { h } from '@vue/composition-api';
import parseFunction from '@/utils/parseFunction';
import { isString } from "@/utils/typeCheck";
import type { Data } from './interfaces';

// In here we handle some specific feature for component.
export default function componentsSchemaMiddleware(node: Data) {

    if (node.type === 'Table')
       return handleTableSchema(node);

    return node;
}

function handleTableSchema(node: Data) {

    const columns = node.data?.props?.columns || [];

    columns.forEach((column: Data) => {
        if (column?.customRender && isString(column?.customRender)) {
            column.customRender = parseFunction(column?.customRender, {params: { h, node }});
        }
    })
    
    return node;
}