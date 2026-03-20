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
/* 全局样式 */
page {
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 通用卡片样式 */
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 通用按钮样式 */
.btn-primary {
  background: #3cc51f;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 16px;
  &.outline {
    background: transparent;
    border: 1px solid #3cc51f;
    color: #3cc51f;
  }
}

/* 通用输入框样式 */
.input-field {
  background: #f5f5f5;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  &:focus {
    background: #fff;
    box-shadow: 0 0 0 2px rgba(60, 197, 31, 0.3);
  }
}

/* 通用渐变背景 */
.bg-weather {
  background: linear-gradient(180deg, #87ceeb 0%, #f0f8ff 100%);
}
</style>
