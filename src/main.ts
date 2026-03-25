import { createSSRApp } from 'vue';
import { createPinia } from "pinia";
import uviewPlus from "uview-plus";
import "uview-plus/index.scss";
import App from './App.vue';
import { useUserStore } from '@/stores/index';

const pinia = createPinia();

export function createApp() {
  const app = createSSRApp(App);
  app.use(uviewPlus);
  app.use(pinia);
  app.config.globalProperties.$u = {
    ...app.config.globalProperties.$u, // 保留 uview-plus 原有的 $u 方法
    vuex: (name: string, value: any) => {
      const store = useUserStore();
      store.$uStore({ name, value });
    }
  };
  return {
    app,
  };
}
