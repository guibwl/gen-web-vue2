import { isString } from '@/utils/typeCheck';
import parseFunction, { isStringFunction } from '@/utils/parseFunction';
import type { Data } from './interfaces';

export { isStringFunction } from '@/utils/parseFunction';

const eventsHandler = ({
    node,
    method,
    specificKey
}: Data) => {
    const enhancedEvents = node?.data?.[method];

    if (isString(specificKey) && specificKey) {
        enhancer(specificKey, enhancedEvents[specificKey])
    } else {
        for (const [key, value] of Object.entries(enhancedEvents))
            enhancer(key, value)
    }

    function enhancer(key: string, value: unknown) {
        
        if (isStringFunction(value))
            enhancedEvents[key] =
                (...args: any) => parseFunction(value as string)(...args, {node});
    }

    return enhancedEvents;
}

export default eventsHandler;


export const addUpdatesHandler = ({
    store,
    state, 
    node,
}: Data) => {
    const updateDataEnhancer = (data: unknown, id?: string): unknown => {

        if (id && !isString(id))
            throw new Error(`expect id for updateEvents should be a string, but got ${typeof id}`);

        if (id)
            return Object.assign(state.__componentsNodes[id].data, data);

        return Object.assign(node.data, data);
    };

    const updateChildrenEnhancer = (children: unknown, id?: string): unknown => {

        if (id && !isString(id))
            throw new Error(`expect id for updateEvents should be a string, but got ${typeof id}`);

        if (id) {
            return state.__componentsNodes[id].children.value = children;
        }

        return node.children.value = children;
    };

    Reflect.defineProperty(node, 'store', { value: store });
    Reflect.defineProperty(node, 'state', { value: state });
    Reflect.defineProperty(node, 'updateData', { value: updateDataEnhancer });
    Reflect.defineProperty(node, 'updateChildren', { value: updateChildrenEnhancer });
}