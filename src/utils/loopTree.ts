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

// 该算法参考 React Fiber 链表算法
// https://github.com/dawn-plex/translate/blob/master/articles/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-to-walk-the-components-tree.md
export function walk(
  node: Data,
  doWork: (node: Data) => void = () => {},
  returnCallback: (node: Data) => void = () => {}
) {
  let current = node;

  while (true) {
      doWork(current)
      const child = window.__symbolTree.firstChild(current);

      // 如果child不为空, 将它设置为当前活跃节点
      if (child) {
          current = child;
          continue;
      }

      // 遍历直到我们发现兄弟节点
      while (!window.__symbolTree.nextSibling(current)) {

          // 如果我们回到了根节点，退出函数
          const parent = window.__symbolTree.parent(current)

          if (!parent) return;

          // 设置父节点为当前活跃节点
          current = parent;

          returnCallback(current);
      }

      // 如果发现兄弟节点，设置兄弟节点为当前活跃节点
      current = window.__symbolTree.nextSibling(current);
  }
}

