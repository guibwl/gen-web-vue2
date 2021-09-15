import {
  defineComponent,
  toRefs,
  h
} from "@vue/composition-api";
import _ from 'lodash';
import { Fragment } from 'vue-fragment'
import SymbolTree from 'symbol-tree'
import componentsRender from './componentsRender';
import { isObject } from "@/utils/typeCheck";
import {loopDFS} from '../utils/loopTree';
import type { Data } from './interfaces';

const store: Data = {};

const createScope = (data: Data, formId?: string) => {
    const state = _.cloneDeep(data);

    const tree = mark(state)

    if (formId && typeof formId === 'string')
        store[formId] = state;

    return {
        state,
        store,
        tree
    }
}

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

function mark(state: Data) {
    const data: Data[] = state.schema
    const tree: Data = new SymbolTree();
    const parentNodes: Data[] = [];
    const rootNodes: Data[] = [];

    loopDFS(data, (node: Data) => {
      const [parentNode = null] = parentNodes;

      if (parentNode)
        tree.appendChild(parentNode, node);
      else
        rootNodes.unshift(node);

      if (rootNodes.length > 1) {
        const [rootNodeB, rootNodeA] = rootNodes;

        tree.insertAfter(rootNodeA, rootNodeB);
        rootNodes.pop();
      }

      if (parentNode?.lastChild === node) {
  
        parentNodes.shift();
        Reflect.deleteProperty(parentNode, "lastChild");
      }

      if (Array.isArray(node?.children) && node.children.length) {
        const lastChild = node.children[node.children.length - 1];

        Reflect.defineProperty(node, "lastChild", {value: lastChild, writable: true});
        parentNodes.unshift(node);
      }

      markComponentsNodes(node, state);
    })

    return tree
}

export default defineComponent({
  props: {
    data: {
        type: Object,
        default: {},
    },
    id: {
        type: String,
        default: '',
    },
  },
  setup(props) {
      
    const { data, id } = toRefs<Data>(props);

    // Store ready for the components.
    const {
        store,
        state,
        tree
    } = createScope(data.value, id.value);

    Reflect.defineProperty(window, "__symbolTree", {value: tree})
    
    return () => h(
      Fragment,
      componentsRender({
        store,
        state
      })
    )
  },
});