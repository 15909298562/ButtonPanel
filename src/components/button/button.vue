<script setup>
    import { ref,computed, watch } from 'vue'
    import ButtonEdit from '../button/buttonEdit.vue'
    import Dialog from '../common/dialog.vue'

    import ButtonAddPng from '../../assets/ButtonAdd.png'
    import EditPng from '../../assets/Edit.png'
    import DeletePng from '../../assets/Delete.png'

    let props = defineProps({
        currentButtonGroupId : Number
    })
    const emit = defineEmits(['closeAddButtonView'])

    let buttonList = ref([])
    let buttonEditVisible = ref(false)
    let showDialog = ref(false)

    let addOrEdit = ref("")
    let button = ref({})
    let deleteButtonId = ref(0)
    let showEditDivIndex = ref(-1)

    let buttonGroupId = computed(()=>{
        return props.currentButtonGroupId
    })

    watch(buttonGroupId,async (newValue,oldValue)=>{
        if(!(0 == newValue)){
            loadData()
        }
    })

    async function loadData(){
        buttonList.value = await window.Button.select(buttonGroupId.value)
    }

    async function deleteConfirm(buttonId){
    await window.Button.delete(buttonId)
    loadData()
    deleteButtonId.value = 0
    showDialog.value = false
  }

  function deleteCancel(){
    deleteButtonId.value = 0
    showDialog.value = false
  }

  //通知预加载方法
  function noticePreload(filePath){
      window.callCmd.callCmd(filePath)
  }

    //关闭添加按钮页面
  function closeAddButtonView(){
    buttonEditVisible.value = false
  }

  //显示添加按钮页面
  function showAddButtonView(){
    buttonEditVisible.value = true
    addOrEdit.value = "add"
  }

  function deleteButton(buttonId){
    deleteButtonId.value = buttonId
    showDialog.value = true
  }

  function editButton(id,name,path){
    buttonEditVisible.value = true
    addOrEdit.value = "edit"
    button.value = {"id":id,"name":name,"url":path}
  }

  function showEditPanel(index){
    showEditDivIndex.value = index
  }

  function hideEditPanel(){
    showEditDivIndex.value = -1
  }

  function buttonClick(url){
    noticePreload(url)
  }
</script>

<template>
    <el-button type="primary" plain style="height: 40px;margin-top: 15px;float: left;padding: 8px 19px" :class="{'button-margin-left': index ==0 ? true : false}" v-for="(item,index) in buttonList" @mouseover="showEditPanel(index)" @mouseout="hideEditPanel" @click="buttonClick(item.url)">
      <span>{{ item.name }}</span>
      <div style="width: 20px;height: 40px;background-color: #FACD91;margin-right:-20px;padding-top: 5px;padding-top:5px;padding-left: 1px;border-top-right-radius: 4px;border-bottom-right-radius: 4px;" :style="{'display' : index == showEditDivIndex ? 'block' : 'none'}">
          <img src="/src/assets/Edit.png" style="width: 10px;height: 10px;display: block;margin-left: 4px;margin-top: 2px;" @click.stop="editButton(item.id,item.name,item.url)"/>
          <img src="/src/assets/Delete.png" style="width: 13px;height: 13px;margin-left: -3px;margin-top: 5px;" @click.stop="deleteButton(item.id)"/>
      </div>
    </el-button>
    <img v-if="0 != buttonGroupId" src="/src/assets/ButtonAdd.png" style="width: 20px;height: 20px;margin-top: 25px;margin-left: 10px;float: left;" @click="showAddButtonView"/>
    <ButtonEdit :isShow="buttonEditVisible" :addOrEdit="addOrEdit" :button="button" :buttonGroupId="buttonGroupId" @closeAddButtonView="closeAddButtonView" @refreshData="loadData"></ButtonEdit>
    <Dialog @confirm="deleteConfirm" @cancel="deleteCancel" :showDialog="showDialog" :id="deleteButtonId"></Dialog>
</template>

<style scoped>
    .button-margin-left{
      margin-left: 12px;
    }
</style>