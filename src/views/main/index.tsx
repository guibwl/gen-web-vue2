import {
  defineComponent,
} from '@vue/composition-api';
import style from './style.module.scss';
import GenWeb from '@/index';
import { adminBpsMockVue2 } from './mock';


export default defineComponent({
  setup() {
    return () => <div class={style.content}>
      <GenWeb data={adminBpsMockVue2} id='web-001' />
    </div>
  }
});
