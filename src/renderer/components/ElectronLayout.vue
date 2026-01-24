<template>
  <el-container class="electron-layout">
    <!-- Header -->
    <el-header :style="{ height: headerHeight }" class="electron-layout__header">
      <el-icon
        v-if="showCollapseButton"
        class="electron-layout__collapse-btn"
        @click="toggleCollapse"
      >
        <Fold v-if="!collapsedModel" />
        <Expand v-else />
      </el-icon>
      <slot name="header-left" />
      <h1 class="electron-layout__title">{{ title }}</h1>
      <div class="electron-layout__header-right">
        <slot name="header-right" />
      </div>
    </el-header>

    <el-container>
      <!-- Sidebar -->
      <el-aside :width="currentSidebarWidth" class="electron-layout__sidebar">
        <!-- 优先使用 menuItems 配置 -->
        <el-menu
          v-if="menuItems?.length"
          :collapse="collapsedModel"
          :collapse-transition="false"
          :default-openeds="computedDefaultOpeneds"
          @select="handleMenuSelect"
        >
          <template v-for="item in menuItems" :key="item.index">
            <!-- 分组菜单 -->
            <el-sub-menu
              v-if="isMenuGroup(item)"
              :index="item.index"
              :disabled="item.disabled"
            >
              <template #title>
                <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child.index"
                :index="child.index"
                :disabled="child.disabled"
              >
                <el-icon v-if="child.icon"><component :is="child.icon" /></el-icon>
                <span>{{ child.label }}</span>
              </el-menu-item>
            </el-sub-menu>

            <!-- 普通菜单项 -->
            <el-menu-item
              v-else
              :index="item.index"
              :disabled="item.disabled"
            >
              <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
            </el-menu-item>
          </template>
        </el-menu>

        <!-- 没有 menuItems 时使用 slot（逃生舱） -->
        <slot v-else name="sidebar" :collapsed="collapsedModel" />
      </el-aside>

      <!-- Main -->
      <el-main class="electron-layout__main">
        <el-tabs
          v-model="activeTabModel"
          type="border-card"
          class="electron-layout__tabs"
          @tab-remove="handleTabRemove"
        >
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.id"
            :name="tab.id"
            :closable="tab.closable !== false"
          >
            <template #label>
              <span @contextmenu.prevent="handleTabContextMenu(tab, $event)">
                {{ tab.title }}
              </span>
            </template>
            <div class="electron-layout__tab-content">
              <slot name="tab" :tab="tab" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Fold, Expand } from '@element-plus/icons-vue'
import { isMenuGroup, type Tab, type ElectronLayoutProps, type MenuGroup } from '../../types/layout'

const props = withDefaults(defineProps<ElectronLayoutProps>(), {
  headerHeight: '50px',
  sidebarWidth: '180px',
  sidebarCollapsedWidth: '64px',
  showCollapseButton: true,
})

const emit = defineEmits<{
  'tab-close': [tabId: string]
  'tab-contextmenu': [tab: Tab, event: MouseEvent]
  'menu-select': [index: string]
}>()

// v-model:activeTab
const activeTabModel = defineModel<string>('activeTab', { required: true })

// v-model:collapsed
const collapsedModel = defineModel<boolean>('collapsed', { default: false })

// 计算当前侧边栏宽度
const currentSidebarWidth = computed(() =>
  collapsedModel.value ? props.sidebarCollapsedWidth : props.sidebarWidth
)

// 计算默认展开的分组
const computedDefaultOpeneds = computed(() => {
  if (!props.menuItems) return []
  return props.menuItems
    .filter((item): item is MenuGroup => isMenuGroup(item) && item.defaultOpen === true)
    .map(item => item.index)
})

function toggleCollapse() {
  collapsedModel.value = !collapsedModel.value
}

function handleTabRemove(tabId: string | number) {
  emit('tab-close', String(tabId))
}

function handleTabContextMenu(tab: Tab, event: MouseEvent) {
  emit('tab-contextmenu', tab, event)
}

function handleMenuSelect(index: string) {
  emit('menu-select', index)
}
</script>

<style>
.electron-layout {
  height: 100vh;
}

.electron-layout__header {
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #337ecc;
}

.electron-layout__title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.electron-layout__header-right {
  margin-left: auto;
}

.electron-layout__collapse-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
}

.electron-layout__collapse-btn:hover {
  opacity: 0.8;
}

.electron-layout__sidebar {
  border-right: 1px solid #e6e6e6;
  background: #f5f7fa;
  transition: width 0.3s;
}

.electron-layout__sidebar .el-menu {
  border-right: none;
  background: transparent;
}

.electron-layout__main {
  padding: 0;
  background: #fff;
  overflow: hidden;
}

.electron-layout__tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.electron-layout__tabs .el-tabs__content {
  flex: 1;
}

.electron-layout__tabs .el-tab-pane {
  height: 100%;
}

.electron-layout__tab-content {
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}
</style>
