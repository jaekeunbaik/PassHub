import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { checkSupabaseConnection } from "./lib/supabase";

const app = createApp(App).use(router);

checkSupabaseConnection().then((result) => {
  if (result.ok) {
    // eslint-disable-next-line no-console
    console.log("[Supabase] 연결 성공", result.session ? "(세션 존재)" : "(세션 없음)");
  } else {
    // eslint-disable-next-line no-console
    console.error("[Supabase] 연결 실패", result.error);
  }
});

app.mount("#app");
