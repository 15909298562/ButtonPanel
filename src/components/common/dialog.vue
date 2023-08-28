<template>
    <el-dialog
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定要删除该条记录吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref,computed } from 'vue'

  const emit = defineEmits(['confirm','cancel'])
  let props = defineProps({
    id : Number,
    showDialog : Boolean
  })
  
  const dialogVisible = computed(()=>{
    return props.showDialog
  })

  let id = computed(()=>{
    return props.id
  })

  function closeDialog(){
    emit("cancel")
  }

  function submit(){
    emit("confirm",id.value)
  }

  function handleClose(){
    emit("cancel")
  }
  </script>
  <style scoped>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  </style>