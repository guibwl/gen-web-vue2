import type { Data } from './interfaces';

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