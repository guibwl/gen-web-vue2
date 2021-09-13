// 捕获括号：async?, params?, curly braces?, content?
export const ARROW_FUNCTION_REGEX = /^\s*(async)?\s*\(?([^\)]*)\)?\s*=>\s*(\{?)([\s\S]*)/;
// 捕获括号：async?, fnName?, params?, content?
export const FUNCTION_REGEX = /^\s*(async)?\s*function\s*([^\(]*)\(([^\)]*)\)\s*\{([\s\S]*)/;

const PARAM_REGEX = /\s*,\s*/;

const CONTENT_TAILING_REGEX = /(\s*)\}?;?(\s*)$/g;

export const getNameFromFunctionStr = (str: string): string => str.trim();

export const getParamsFromFunctionStr = (str: string): string[] => str.trim().split(PARAM_REGEX)?.filter(Boolean);

export const getContentFromFunctionStr = (str: string, addReturn: boolean = false): string =>
        `${ addReturn ? 'return ' : '' }${str.replace(CONTENT_TAILING_REGEX, () => '').trim()}`;

type Opt = {
    params?: {[k: string]: string} | {}
}

const parseFunction = (str: string, opt: Opt = {}): Function => {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

    if (str.match(ARROW_FUNCTION_REGEX)) {
        const { $1, $2, $3, $4 } = RegExp;
        const FunctionHandler = $1 === 'async' ? AsyncFunction : Function;
        const paramsKeys = getParamsFromFunctionStr($2);
        const addReturn = !$3;
        const content = getContentFromFunctionStr($4, addReturn);


        return (...args: any) => {
            const argsVal = [...args]

            if (opt?.params) argsVal.push(opt?.params)
            
            return new FunctionHandler(...paramsKeys, content)(...argsVal)
        };
    }

    if (str.match(FUNCTION_REGEX)) {
        const { $1, $3, $4 } = RegExp;
        const FunctionHandler = $1 === 'async' ? AsyncFunction : Function;
        const paramsKeys = getParamsFromFunctionStr($3);
        const content = getContentFromFunctionStr($4);

        return (...args: any) => {
            const argsVal = [...args]

            if (opt?.params) argsVal.push(opt?.params)
            
            return new FunctionHandler(...paramsKeys, content)(...argsVal)
        };
    }

    return () => {};
}

export default parseFunction;


export const isStringFunction = (value: any) => {
    if (typeof value !== 'string') return

    return value.match(ARROW_FUNCTION_REGEX) || value.match(FUNCTION_REGEX)
} 