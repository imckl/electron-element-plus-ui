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
            v-for="tab in tabsList"
            :key="tab.id"
            :name="tab.id"
            :closable="tab.closable !== false"
          >
            <template #label>
              <span @contextmenu.prevent="handleTabContextMenu(tab)">
                {{ tab.title }}
              </span>
            </template>
            <div class="electron-layout__tab-content">
              <!-- 优先使用 componentMap 配置式渲染 -->
              <component
                v-if="componentMap?.[tab.type]"
                :is="componentMap[tab.type]"
                v-bind="tab.data"
                @title-change="(title: string) => onTitleChange?.(tab.id, title)"
              />
              <!-- 没有 componentMap 时使用 slot（逃生舱） -->
              <slot v-else name="tab" :tab="tab" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>

  <!-- 重命名对话框 -->
  <el-dialog
    v-model="renameDialogVisible"
    :title="renameDialogTitle"
    width="400px"
    @opened="renameInputRef?.focus()"
  >
    <el-input
      ref="renameInputRef"
      v-model="renameValue"
      placeholder="请输入标签名称"
      @keyup.enter="handleRenameConfirm"
    />
    <template #footer>
      <el-button @click="renameDialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleRenameConfirm">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, toValue, onMounted, onUnmounted, type Ref } from 'vue'
import { Fold, Expand } from '@element-plus/icons-vue'
import { isMenuGroup, type TabInstance, type ElectronLayoutProps, type MenuGroup, type TabContextMenuResult } from '../../shared/types'

const props = withDefaults(defineProps<ElectronLayoutProps>(), {
  headerHeight: '50px',
  sidebarWidth: '180px',
  sidebarCollapsedWidth: '64px',
  showCollapseButton: true,
  renameDialogTitle: '重命名标签',
})

const emit = defineEmits<{
  'tab-close': [tabId: string]
  'tab-rename': [tabId: string, newTitle: string]
  'menu-select': [index: string]
}>()

// 解包 tabs（支持传入 Ref 或普通数组）
const tabsList = computed(() => toValue(props.tabs))

// v-model:activeTab（支持 string | Ref<string>）
const activeTabRaw = defineModel<string | Ref<string>>('activeTab', { required: true })
const activeTabModel = computed({
  get: () => toValue(activeTabRaw.value),
  set: (value) => { activeTabRaw.value = value },
})

// v-model:collapsed（支持 boolean | Ref<boolean>）
const collapsedRaw = defineModel<boolean | Ref<boolean>>('collapsed', { default: false })
const collapsedModel = computed({
  get: () => toValue(collapsedRaw.value),
  set: (value) => { collapsedRaw.value = value },
})

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

function handleMenuSelect(index: string) {
  emit('menu-select', index)
}

// ============ Tab 右键菜单 ============

function handleTabContextMenu(tab: TabInstance) {
  // 检查 API 是否可用
  if (typeof window !== 'undefined' && window.electronLayoutApi) {
    window.electronLayoutApi.showTabContextMenu({
      tabId: tab.id,
      tabType: tab.type,
    })
  }
}

function handleContextMenuCommand(result: TabContextMenuResult) {
  const tab = tabsList.value.find(t => t.id === result.tabId)
  if (!tab) return

  switch (result.command) {
    case 'rename':
      openRenameDialog(tab)
      break
    case 'close':
      emit('tab-close', tab.id)
      break
  }
}

// ============ 重命名对话框 ============

const renameDialogVisible = ref(false)
const renameTabId = ref('')
const renameValue = ref('')
const renameInputRef = ref<InstanceType<typeof import('element-plus')['ElInput']>>()

function openRenameDialog(tab: TabInstance) {
  renameTabId.value = tab.id
  renameValue.value = tab.title
  renameDialogVisible.value = true
}

function handleRenameConfirm() {
  const trimmedValue = renameValue.value.trim()
  if (trimmedValue && renameTabId.value) {
    emit('tab-rename', renameTabId.value, trimmedValue)
  }
  renameDialogVisible.value = false
}

// ============ 生命周期 ============

onMounted(() => {
  if (typeof window !== 'undefined' && window.electronLayoutApi) {
    window.electronLayoutApi.onTabContextMenuCommand(handleContextMenuCommand)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined' && window.electronLayoutApi) {
    window.electronLayoutApi.removeTabContextMenuListener()
  }
})
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
