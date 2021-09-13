export const isObject = (object: unknown): boolean =>
    Object.prototype.toString.call(object) === '[object Object]';
export const isFunction = (object: unknown): boolean =>
    Object.prototype.toString.call(object) === '[object Function]';
export const isAsyncFunction = (object: unknown): boolean =>
    Object.prototype.toString.call(object) === '[object AsyncFunction]';
export const isGeneratorFunction = (object: unknown): boolean =>
    Object.prototype.toString.call(object) === '[object GeneratorFunction]';
export const isString = (object: unknown): boolean =>
    Object.prototype.toString.call(object) === '[object String]';
