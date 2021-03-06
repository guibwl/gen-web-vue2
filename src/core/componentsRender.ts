import {
  defineAsyncComponent,
  ref,
  h,
} from "@vue/composition-api";
import { camelCase } from "change-case";
import { isObject, isString } from "@/utils/typeCheck";
import { walk } from "@/utils/loopTree";
import componentsImporter from "@/components/index";
import eventsHandler, { isStringFunction, addUpdatesHandler } from "./eventsHandler";
import componentsSchemaMiddleware from './componentsSchemaMiddleware';
import type { Data } from './interfaces';

const componentsLoadCache: Data = {};


const hDataEnhancer = ({ node }: Data): Data => {

  // Convert to ref, it makes UI can update by state.
  const excludeFromRef = ['on', 'nativeOn']

  if (isObject(node?.data))
    Object.keys(node.data).forEach(key => {
      if (!excludeFromRef.includes(key)) {
        node.data[key] = ref(node.data[key]).value;
      }
    })
  
  if (isObject(node?.data?.props)) {
    Object.keys(node.data.props).forEach(key => {
      
      if (isStringFunction(node.data.props[key])) {
        node.data.props = eventsHandler({ node, method: 'props', specificKey: key })
      }
    })
  }

  const data = {};

  if (isObject(node?.data))
    Object.assign(data, node?.data);

  if (isObject(node?.data?.on))
    Object.assign(data, {on: eventsHandler({ node, method: 'on' })});

  if (isObject(node?.data?.nativeOn))
    Object.assign(data, {nativeOn: eventsHandler({ node, method: 'nativeOn' })});

  return data;
}


const childrenEnhancer = ({ node }: Data): Data => {

  if (typeof node.children === 'string')
    node.children = ref(node.children);

  return node;
}

const defineAntdComponent = (node: Data, data: Data, typeNameCamelCase: string) => {
  const Comp =
    componentsLoadCache[typeNameCamelCase] ||
    (componentsLoadCache[typeNameCamelCase] = defineAsyncComponent(
      componentsImporter[typeNameCamelCase] as any
    ));

  
  Reflect.defineProperty(node, "__component", {
    value: {
      data,
      value: Comp,
    },
    writable: true,
  });
}

const defineAntdSubComponent = (node: Data, data: Data, typeNameOrigin: string) => {
  const typeItems = typeNameOrigin.split(".");
  const [typeName, childTypeName] = typeItems;
  const typeNameCamelCase = camelCase(typeName);

  const comp = async () =>
    (await componentsImporter[typeNameCamelCase]()).default[childTypeName];

  const Comp: any =
    componentsLoadCache[typeNameOrigin] ||
    (componentsLoadCache[typeNameOrigin] = defineAsyncComponent(
      comp as any
    ));

  Reflect.defineProperty(node, "__component", {
    value: {
      data,
      value: Comp,
    },
    writable: true,
  });
}

const defineNormalComponent = (node: Data, data: Data, typeNameOrigin: string) => {
  const Comp = typeNameOrigin;

  Reflect.defineProperty(node, "__component", {
    value: {
      data,
      value: Comp,
    },
    writable: true,
  });
}

const componentsGenerator = (node: Data, data: Data,) => {
  const typeNameOrigin = node?.type;
  const typeNameCamelCase = camelCase(typeNameOrigin);

  if (componentsImporter[typeNameCamelCase]) {

    defineAntdComponent(node, data, typeNameCamelCase);
  } else if (typeNameOrigin.match(/^[A-Z][\S]+\.[\S]+/)) {

    defineAntdSubComponent(node, data, typeNameOrigin);
  } else {

    defineNormalComponent(node, data, typeNameOrigin);
  }
}


const isLeafNodeChecker = (node: Data): boolean => {
  const child = node?.children;

  if (!child) return true;
  if (Array.isArray(child) && !child?.length) return true;
  if (typeof child === 'string') return true;
  if (typeof child?.value === 'string') return true;

  return false;
}

const createComponentInstance = (node: Data) => {

  const { data, value: Comp } = node.__component;
  const children =
    Array.isArray(node.children) ?
    node.children.map((child: Data) => child.__component) :
    node?.children?.value || node?.children;
  
  const component = h(
    Comp,
    data,
    children
  );

  Reflect.defineProperty(node, "__component", {
    value: component,
    writable: true,
  });
}


const componentsRender = ({
  store,
  state,
}: Data) => {
  const componentsSchema = state?.schema;
  const componentsKeys: string[] = [];

  const componentsFactory = (schema: Data[]): any[] => {

    walk(
      schema[0],
      node => {
        if (!node?.id)
        throw new Error(`expect 'id' property in each node inside the 'schema'.`);

        if (!isString(node?.id))
          throw new Error(`expect 'id' property as a string in node inside the 'schema', but got ${node?.id}.`);

        addUpdatesHandler({ node, store, state });

        const data = hDataEnhancer({ node });

        node = childrenEnhancer({ node });

        node = componentsSchemaMiddleware(node);

        componentsGenerator(node, data);

        if (isLeafNodeChecker(node))
            createComponentInstance(node);

        componentsKeys.push(node.id);
      },
      node => {
        createComponentInstance(node);
      }
    )

    
    return schema.map(node => node.__component);
  };

  const result = componentsFactory(componentsSchema);

  checkIdDuplicate(componentsKeys);

  return result;
};

export default componentsRender;


function checkIdDuplicate(componentsKeys: string[]) {
  // Use setTimeout will not block the thread.
  setTimeout(checkIdDuplicateExecute, 10, componentsKeys);
}

export function checkIdDuplicateExecute(componentsKeys: string[]) {

  const uniqueKeys: string[] = []
  let duplicatedKey: string | undefined;
  for (let i = 0; i < componentsKeys.length; i++) {

    if (uniqueKeys.indexOf(componentsKeys[i]) !== -1) {
      duplicatedKey = componentsKeys[i];
      break;
    }

    uniqueKeys.push(componentsKeys[i]);
  }

  if (duplicatedKey !== undefined)
    throw new Error(`Component id in 'schema' should be unique, but got '${duplicatedKey}' which is duplicated.`);
}