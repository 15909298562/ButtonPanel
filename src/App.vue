<script setup>
  import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
  import ButtonGroup from './components/buttonGroup/buttonGroup.vue'
  import Button from './components/button/button.vue'

  let currentButtonGroupItemId = ref(0)
  let scrollbarHeight = ref(getScrollbarHeight())
  let leftScrollbar = ref(null)
  let rightScrollbar = ref(null)

  function setCurrentButtonGroupId(buttonGroupId){
    currentButtonGroupItemId.value = buttonGroupId
  }

  onMounted(()=>{
    window.addEventListener('resize', windowResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', windowResize)
  })

  function windowResize(){
    scrollbarHeight.value = getScrollbarHeight();
  }

  function getScrollbarHeight(){
    var docHeight = document.documentElement.clientHeight;
    return docHeight - 35;
  }
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="300px" style="padding-top: 15px;" :style="{'height':scrollbarHeight + 'px'}">
        <el-scrollbar ref="leftScrollbar" class="layout-left" style="border-right: solid 1px;">
          <ButtonGroup @setButtonGroupId="setCurrentButtonGroupId"></ButtonGroup>
        </el-scrollbar>
      </el-aside>
      <el-main style="padding: 0px 0px 0px 0px;" :style="{'height':scrollbarHeight + 'px'}">
        <el-scrollbar ref="rightScrollbar" class="layout-right" style="height: 100%;">
          <Button :currentButtonGroupId="currentButtonGroupItemId"></Button>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
  .layout-left {
    width: 300px;
    float: left;
  }
  .layout-right{
    float: left;
  }
</style>