import {
  defineAsyncComponent,
  ref,
  h,
} from "@vue/composition-api";
import { camelCase } from "change-case";
import { isObject, isString } from "@/utils/typeCheck";
import componentsImporter from "@/components/index";
import eventsHandler, { isStringFunction, addUpdatesHandler } from "./eventsHandler";
import componentsSchemaMiddleware from './componentsSchemaMiddleware';
import type { Data } from './interfaces';

const componentsLoadCache: Data = {};

export const markRelatedNode = () => {
  const parentNodes: Data[] = [];

  return (node: Data) => {
    const [parentNode = null] = parentNodes;

    Reflect.defineProperty(node, "parentNode", {
      value: parentNode,
    });

    if (Array.isArray(node?.children) && node.children.length) {
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];

      Reflect.defineProperty(node, "firstChild", {
        value: firstChild,
      });

      Reflect.defineProperty(node, "lastChild", {
        value: lastChild,
      });

      parentNodes.unshift(node);
    }

    if (node.parentNode?.lastChild === node) {

      const [parentNode] = parentNodes;

      // The `parentNode` may just did `unshift` in above,
      // so here we need to delete second `parentNodes`.
      if (parentNode === node)
        parentNodes.splice(1, 1);
      else
        parentNodes.shift();
    }

    return node;
  }
};

const markComponentsNodes = (node: Data, state: Data) => {

  const componentsNodes = {
    [node.id]: node
  };

  if (isObject(state.__componentsNodes))
    Object.assign(componentsNodes, state.__componentsNodes);


  Reflect.defineProperty(state, '__componentsNodes', {
    value: componentsNodes,
    writable: true,
  });
}

const childrenEnhancer = ({ node }: Data): Data => {

  if (typeof node.children === 'string')
    node.children = ref(node.children);

  return node;
}

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

const getLeafChildren = (node: Data, Comp: unknown) => {
  const children = node?.children?.value || node?.children;

  if (isString(children) && isString(Comp)) {

    return children;
  } else if (isString(children)) {

    return children;
  }
}

const createLeafComponentInstance = (node: Data) => {
  
  const Comp = node?.__component?.value;
  const data = node?.__component?.data;
  const children = getLeafChildren(node, Comp);

  Reflect.defineProperty(node, "__component", {
    value: h(Comp, data, children),
    writable: true,
  });
}

const createComponentInstance = (node: Data) => {

  const { data, value: Comp } = node.__component;
  const children = node.__component_children.slice();
  
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

const isLeafNodeChecker = (node: Data): boolean => {
  const child = node?.children;

  if (!child) return true;
  if (Array.isArray(child) && !child?.length) return true;
  if (typeof child === 'string') return true;
  if (typeof child?.value === 'string') return true;

  return false;
}

const markComponentChildren = (currentNode: Data, parentNode?: Data) => {
  // init, its mark on currentNode
  if (currentNode)
    Reflect.defineProperty(currentNode, "__component_children", {
      value: null,
      writable: true,
    });

  // add values on parentNode, witch is initialized on above.
  if (parentNode && currentNode)
    (
      parentNode.__component_children || (parentNode.__component_children = [])
    ).push(currentNode.__component);
};


const commitComponents = (node: Data, componentsContainer: any[]) => {

  markComponentChildren(node);

  if (isLeafNodeChecker(node)) {
    // start commit process

    createLeafComponentInstance(node);

    let parentNode = node.parentNode;
    let currentNode = node;

    markComponentChildren(currentNode, parentNode);

    while (parentNode) {
      if (parentNode.lastChild === currentNode) {

        createComponentInstance(parentNode);

        if (!parentNode.parentNode)
          componentsContainer.push(parentNode?.__component);

        currentNode = parentNode;
        parentNode = parentNode.parentNode;

        markComponentChildren(currentNode, parentNode);

      } else {
        parentNode = null;
      }
    }

    if (!node?.parentNode)
      componentsContainer.push(node?.__component);
  }
}

export const loopDFS = (nodes: Data[], cb: CallableFunction) => {
  nodes = [...nodes];
  let n = 0;
  while (nodes.length) {
    const node: Data = nodes.shift() || {};
    if (Array.isArray(node?.children) && node.children.length)
      nodes.unshift(...node.children);

    cb(node, n++, nodes);
  }
}

const componentsRender = ({
  store,
  state,
}: Data) => {
  const componentsSchema = state?.schema;
  const componentsKeys: string[] = [];

  const componentsFactory = (schema: Data[]): any[] => {
    const componentsContainer: any[] = [];
    const markRelatedNodeInstance = markRelatedNode();

    loopDFS(schema, (node: Data) => {

      if (!node?.id)
        throw new Error(`expect 'id' property in each node inside the 'schema'.`);

      if (!isString(node?.id))
        throw new Error(`expect 'id' property as a string in node inside the 'schema', but got ${node?.id}.`);

      markRelatedNodeInstance(node);

      markComponentsNodes(node, state);

      addUpdatesHandler({ node, store, state });

      const data = hDataEnhancer({ node });

      node = childrenEnhancer({ node });

      node = componentsSchemaMiddleware(node);

      componentsGenerator(node, data);

      commitComponents(node, componentsContainer);

      componentsKeys.push(node.id);
    });

    return componentsContainer;
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