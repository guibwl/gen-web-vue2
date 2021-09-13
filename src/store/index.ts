import { InjectionKey } from '@vue/composition-api';
import { Store } from 'vuex';

// define injection key
export const injectionKey: InjectionKey<Store<object>> = Symbol('Injection key');

export default Store
