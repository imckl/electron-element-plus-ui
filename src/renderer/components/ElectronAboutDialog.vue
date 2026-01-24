<template>
  <el-dialog
    v-model="modelValue"
    title="关于"
    :width="width"
  >
    <div class="about-content">
      <div class="about-icon">
        <el-icon :size="64" :color="iconColor">
          <component :is="icon" v-if="icon" />
          <Monitor v-else />
        </el-icon>
      </div>
      <h2 class="about-app-name">{{ appName }}</h2>
      <p class="about-version">版本 {{ version }}</p>
      <p v-if="copyright" class="about-copyright">{{ copyright }}</p>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { Monitor } from '@element-plus/icons-vue'
import type { ElectronAboutDialogProps } from '../../shared/types'

withDefaults(defineProps<ElectronAboutDialogProps>(), {
  iconColor: '#409eff',
  width: '360px',
})

const modelValue = defineModel<boolean>({ required: true })
</script>

<style scoped>
.about-content {
  text-align: center;
  padding: 20px 0;
}

.about-icon {
  margin-bottom: 16px;
}

.about-app-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.about-version {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #909399;
}

.about-copyright {
  margin: 0;
  font-size: 12px;
  color: #c0c4cc;
}
</style>
