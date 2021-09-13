import {
  defineComponent,
  toRefs,
} from "@vue/composition-api";
import _ from 'lodash';
import componentsRender from './componentsRender';
import type { Data } from './interfaces';

const store: Data = {};

const createScope = (data: Data, formId?: string) => {
    const state = _.cloneDeep(data);

    if (formId && typeof formId === 'string')
        store[formId] = state;

    return {
        state,
        store,
    }
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
    } = createScope(data.value, id.value);
    
    return () => componentsRender({
        store,
        state,
    });
  },
});