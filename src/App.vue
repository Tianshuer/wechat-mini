<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
/* 全局样式 - 莫兰迪色系 */
page {
  background-color: #F5F5F0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 通用卡片样式 */
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 通用按钮样式 - 莫兰迪色 */
.btn-primary {
  background: #8FA89B;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 16px;
  &.outline {
    background: transparent;
    border: 1px solid #8FA89B;
    color: #8FA89B;
  }
}

/* 通用输入框样式 */
.input-field {
  background: #F0F0E8;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  &:focus {
    background: #fff;
    box-shadow: 0 0 0 2px rgba(143, 168, 155, 0.3);
  }
}

/* 通用渐变背景 - 莫兰迪色 */
.bg-weather {
  background: linear-gradient(180deg, #C9D6DF 0%, #F5F5F0 100%);
}
</style>
