import {
    ARROW_FUNCTION_REGEX,
    FUNCTION_REGEX,
    getNameFromFunctionStr,
    getParamsFromFunctionStr,
    getContentFromFunctionStr,
  } from '../parseFunction';
  
  
  describe('expect string is a function: ', () => {
  
    const arrowFunction1 = `() =>return 1`;
    const arrowFunction2 = `( ...args ) => {return 1 }`;
    const arrowFunction3 = `( a, b,  )=> { return () => console.log(1); }`;
    const arrowFunction4 = `(a, b,k, j )   => () => console.log(1);`;
    const arrowFunction5 = `
      (  a   ) =>   
            ( k ) => console.log(1);
    `;
    const arrowFunction6Content = `
        const x = ( k ) => console.log(1);
  
        return x();
    `;
    const arrowFunction6 = `
      (  ) => {
            ${arrowFunction6Content}
      }
    `;
    const arrowFunction7Content = `
        const foo = ( k, cb ) => console.log(1, k, x) && cb(k);
        const bar = ( k ) => console.log(2, k, z);
  
        return foo('start', bar);
    `;
    const arrowFunction7 = `
      ( x, z ) => {
  
            ${arrowFunction7Content}
  
      }
    `;
    const arrowFunction8 = `async (a, b ) => {return 1; }`;
    const arrowFunction9 = `  async() => {return 1 }`;
    const arrowFunction10 = `function() {
      return () => { return 1 }
    }`;
    const arrowFunction11 = `async function() {
      return () => { return 1 }
    }`;
  
    const arrowFunction12Content = `const x = async () => console.log('0-44491 >');
  
    x();
  
    function xxx (z) {
      console.log(' >', z);
    };
  
    xxx('ggg')
  
    const p =  new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
  
      return 111112;
    })
  
    console.log('>>>', e)`;
    const arrowFunction12 = `(e, ...arg) => {
      
      ${arrowFunction12Content}
  
    }`;

    const arrowFunction13 = `a => {}`;
    const arrowFunction14 = `a=> {}`;
    const arrowFunction15 = `async a=> {}`;
    const arrowFunction16 = `a=> \`\${value}%\`;`;
  
    test('is arrow function', () => {
      {
        expect(arrowFunction1.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $2, $4 } = RegExp;
        expect(getParamsFromFunctionStr($2)).toStrictEqual([]);
        expect(getContentFromFunctionStr($4)).toBe('return 1');
      }
      {
        expect(arrowFunction2.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $2, $4 } = RegExp;
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['...args']);
        expect(getContentFromFunctionStr($4)).toBe('return 1');
      }
      {
        expect(arrowFunction3.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $2, $4 } = RegExp;
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['a', 'b']);
        expect(getContentFromFunctionStr($4)).toBe('return () => console.log(1);');
      }
      {
        expect(arrowFunction4.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $2, $4 } = RegExp;
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['a', 'b', 'k', 'j']);
        expect(getContentFromFunctionStr($4)).toBe('() => console.log(1)');
      }
      {
        expect(arrowFunction5.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $2, $4 } = RegExp;
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['a']);
        expect(getContentFromFunctionStr($4)).toBe('( k ) => console.log(1)');
      }
      {
        expect(arrowFunction6.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $2, $4 } = RegExp;
        expect(getParamsFromFunctionStr($2)).toStrictEqual([]);
        expect(getContentFromFunctionStr($4)).toBe(arrowFunction6Content.trim());
      }
      {
        expect(arrowFunction7.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $2, $4 } = RegExp;
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['x', 'z']);
        expect(getContentFromFunctionStr($4)).toBe(arrowFunction7Content.trim());
      }
      {
        expect(arrowFunction8.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $1, $2, $4 } = RegExp;
        expect($1).toBe('async');
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['a', 'b']);
        expect(getContentFromFunctionStr($4)).toBe('return 1;');
      }
      {
        expect(arrowFunction9.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $1, $2, $4 } = RegExp;
        expect($1).toBe('async');
        expect(getParamsFromFunctionStr($2)).toStrictEqual([]);
        expect(getContentFromFunctionStr($4)).toBe('return 1');
      }
      expect(arrowFunction10.match(ARROW_FUNCTION_REGEX)).toBeFalsy();
      expect(arrowFunction11.match(ARROW_FUNCTION_REGEX)).toBeFalsy();
      {
        expect(arrowFunction12.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $1, $2, $4 } = RegExp;
        expect($1).toBe('');
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['e', '...arg']);
        expect(getContentFromFunctionStr($4)).toBe(arrowFunction12Content);
      }
      {
        expect(arrowFunction13.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $2, $4 } = RegExp;
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['a']);
        expect(getContentFromFunctionStr($4)).toBe('');
      }
      {
        expect(arrowFunction14.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const { $2, $4 } = RegExp;
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['a']);
        expect(getContentFromFunctionStr($4)).toBe('');
      }
      {
        expect(arrowFunction15.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const {$1, $2, $4 } = RegExp;
        expect($1).toBe('async');
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['a']);
        expect(getContentFromFunctionStr($4)).toBe('');
      }
      {
        expect(arrowFunction16.match(ARROW_FUNCTION_REGEX)).toBeTruthy();
        const {$1, $2, $3, $4 } = RegExp;
        const addReturn = !$3;
        expect($1).toBe('');
        expect(getParamsFromFunctionStr($2)).toStrictEqual(['a']);
        expect(getContentFromFunctionStr($4, addReturn)).toBe('return \`\${value}%\`');
      }
    });
  
  
    const commonFunction1 = `function x() {}`;
    const commonFunction2 = `function( x ,) { return !!x; }`;
    const commonFunction3 = ` async function xs( x , z, b) { 
      return x+z-b; }`;
    const commonFunction4Content = `
        const foo = (n) => n*2;
        function bar(n) {
          return n + 1;
        }
  
        return foo(3) + bar(5);
    `;
    const commonFunction4 = `function xsz ( x , z, b) { 
  
        ${commonFunction4Content}
    }`;
    const commonFunction5 = `() => function( x ,) { return !!x; }`;
    const commonFunction6 = `async () => function( x ,) { return !!x; }`;
  
    test('is common function', () => {
      {
        expect(commonFunction1.match(FUNCTION_REGEX)).toBeTruthy();
        const { $1, $2, $3, $4 } = RegExp;
        expect($1).toBe('');
        expect($2).toBe('x');
        expect(getParamsFromFunctionStr($3)).toStrictEqual([]);
        expect(getContentFromFunctionStr($4)).toBe('');
      }
      {
        expect(commonFunction2.match(FUNCTION_REGEX)).toBeTruthy();
        const { $3, $4 } = RegExp;
        expect(getParamsFromFunctionStr($3)).toStrictEqual(['x']);
        expect(getContentFromFunctionStr($4)).toBe('return !!x;');
      }
      {
        expect(commonFunction3.match(FUNCTION_REGEX)).toBeTruthy();
        const { $1, $2, $3, $4 } = RegExp;
        expect($1).toBe('async');
        expect($2).toBe('xs');
        expect(getParamsFromFunctionStr($3)).toStrictEqual(['x', 'z', 'b']);
        expect(getContentFromFunctionStr($4)).toBe('return x+z-b;');
      }
      {
        expect(commonFunction4.match(FUNCTION_REGEX)).toBeTruthy();
        const { $1, $2, $3, $4 } = RegExp;
        expect($1).toBe('');
        expect(getNameFromFunctionStr($2)).toBe('xsz');
        expect(getParamsFromFunctionStr($3)).toStrictEqual(['x', 'z', 'b']);
        expect(getContentFromFunctionStr($4)).toBe(commonFunction4Content.trim());
      }
      expect(commonFunction5.match(FUNCTION_REGEX)).toBeFalsy();
      expect(commonFunction6.match(FUNCTION_REGEX)).toBeFalsy();
    });
  });
  
  