<script setup>
  import { onBeforeMount, ref, watch } from 'vue'
  import ButtonGroupEdit from './buttonGroupEdit.vue'
  import Dialog from '../common/dialog.vue'

  import ButtonGroupAddPng from '../../assets/ButtonGroupAdd.png'
  import EditPng from '../../assets/Edit.png'
  import DeletePng from '../../assets/Delete.png'
  import GroupPng from '../../assets/Group.png'

  let buttonGroupEditVisible = ref(false)
  let buttonGroupList = ref([])
  let currentButtonGroupItemId = ref(0)

  let showDialog = ref(false)
  let deleteButtonGroupId = ref(0)

  let addOrEdit = ref("")
  let buttonGroup = ref({})
  let showEditDivIndex = ref(-1)

  const emit = defineEmits(['setButtonGroupId'])

  onBeforeMount(async ()=>{
    loadData()
  })

  watch(currentButtonGroupItemId,()=>{
    emit("setButtonGroupId",currentButtonGroupItemId.value)
  })

  async function loadData(){
    buttonGroupList.value = await window.ButtonGroup.select()
    if(buttonGroupList.value.length > 0){
      let buttonGroup = buttonGroupList.value[0]
      currentButtonGroupItemId.value = buttonGroup.id
    }
  }

  async function deleteButtonGroup(buttonGroupId){
    deleteButtonGroupId.value = buttonGroupId
    showDialog.value = true
  }

  async function deleteConfirm(buttonGroupId){
    await window.ButtonGroup.delete(buttonGroupId)
    loadData()
    deleteButtonGroupId.value = 0
    showDialog.value = false
  }

  function deleteCancel(){
    deleteButtonGroupId.value = 0
    showDialog.value = false
  }

  //显示添加按钮组页面
  function showAddButtonGroupView(){
    buttonGroupEditVisible.value = true
    addOrEdit.value = "add"
  }

  function showEditButtonGroupView(buttonGroupId,buttonGroupName){
    buttonGroupEditVisible.value = true
    addOrEdit.value = "edit"
    buttonGroup.value = {"id":buttonGroupId,"name":buttonGroupName}
  }

  //关闭添加按钮组页面
  function closeAddButtonGroupView(){
    buttonGroupEditVisible.value = false
  }

  function cliekItem(buttonGroupId){
    currentButtonGroupItemId.value = buttonGroupId
  }

  function showEditPanel(index){
    showEditDivIndex.value = index
  }

  function hideEditPanel(){
    showEditDivIndex.value = -1
  }

</script>

<template>
    <div style="height: 40px; border-bottom: solid 1px;" :class="{'editPanel':index === showEditDivIndex,'currentButtonGroupItem':item.id === currentButtonGroupItemId,'firstGroup': index == 0}" v-for="(item,index) in buttonGroupList" @click="cliekItem(item.id)" @mouseover="showEditPanel(index)" @mouseout="hideEditPanel">
      <div style="width: 26px;float: left;padding-top: 10px;margin-left: 10px;">
        <img :src="GroupPng" style="width: 20px;">
      </div>
      <span style="display: block;float: left;margin-top: 7px;">
        {{ item.name }}
      </span>
      <div style="width: 50px;height: 38px;padding-top: 10px;padding-left: 5px;float: right;" :style="{'display': index === showEditDivIndex ? 'block' : 'none'}">
        <img :src="EditPng" style="width: 15px;height: 15px;" @click.stop="showEditButtonGroupView(item.id,item.name)"/>
        <img :src="DeletePng" style="width: 15px;height: 15px;margin-left: 5px;" @click.stop="deleteButtonGroup(item.id)"/>
      </div>
    </div>
    <div style="width: 200px;height: 40">
      <img :src="ButtonGroupAddPng" style="width:20px;height:20px;margin-top:5px;margin-left:130px;" @click="showAddButtonGroupView"/>
    </div>
    <ButtonGroupEdit :is-show="buttonGroupEditVisible" :addOrEdit="addOrEdit" :buttonGroup="buttonGroup" @closeAddButtonGroupView="closeAddButtonGroupView" @refreshData="loadData"></ButtonGroupEdit>
    <Dialog @confirm="deleteConfirm" @cancel="deleteCancel" :showDialog="showDialog" :id="deleteButtonGroupId"></Dialog>
</template>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.button-group-add,.button-add{
  widows: 20px;
  height: 20px;
}
.button-add{
  margin-left: 10px;
  margin-top: 5px;
  position: absolute;
}
.button-group-add-div{
  position: absolute;
  margin-left: 470px;
  margin-top: -77px;
}
.currentButtonGroupItem{
  background-color: #81D3F8;
}
.editPanel{
  background-color: #dddcda;
}
.firstGroup{
  border-top: 1px solid;
}
</style>