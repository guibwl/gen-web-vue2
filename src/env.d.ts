/// <reference types="vite/client" />

interface Window { __symbolTree: any; }
declare module '*.vue' {
  import { Component, AsyncComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: string | Component<any, any, any, any> | AsyncComponent<any, any, any, any> | (() => Component)
  export default component
}

declare module 'vue-fragment'

declare module 'symbol-tree'