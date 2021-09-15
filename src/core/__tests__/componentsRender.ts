import {
    checkIdDuplicateExecute
} from '../componentsRender';

  
test('expect each string in array are unique:', () => {

    const errMsg = (key: string) => `Component id in 'schema' should be unique, but got '${key}' which is duplicated.`;

    expect(() => checkIdDuplicateExecute(['foo', 'foo'])).toThrowError(errMsg('foo'));
    expect(() => checkIdDuplicateExecute(['foo', 'bar', 'foo'])).toThrowError(errMsg('foo'));
    expect(() => checkIdDuplicateExecute(['foo', 'bar', 'foo', 'bar'])).toThrowError(errMsg('foo'));
    expect(() => checkIdDuplicateExecute(['foo', 'bar', '', 'bar', ''])).toThrowError(errMsg('bar'));
    expect(() => checkIdDuplicateExecute(['foo', '', '', 'bar', ''])).toThrowError(errMsg(''));
    expect(checkIdDuplicateExecute(['foo'])).toBeUndefined();
});

