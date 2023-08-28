<script setup>
    import { ref,computed, watch } from 'vue'
    import { ElMessage } from 'element-plus'

    const buttonGroupName = ref('')
    const buttonGroupId = ref(0)
    const title = ref('')

    let props = defineProps({
        isShow : Boolean,
        addOrEdit : String,
        buttonGroup : Object
    })
    const emit = defineEmits(['closeAddButtonGroupView','refreshData'])

    let buttonGroupEditVisible = computed(()=>{
        return props.isShow
    })
    let addOrEdit = computed(()=>{
        return props.addOrEdit
    })
    let buttonGroup = computed(()=>{
        return props.buttonGroup
    })

    watch(addOrEdit,(newValue,oldValue)=>{
        if(newValue == "add"){
            title.value = "新增按钮组"
        }else if(newValue == "edit"){
            title.value = "编辑按钮组"
        }
    })
    watch(buttonGroup,(newValue,oldValue)=>{
        buttonGroupId.value = newValue.id
        buttonGroupName.value = newValue.name
    })

    function close(){
        handleClose()
    }

    function save(){
        if("" === buttonGroupName.value){
            ElMessage({
                message: '输入按钮组名称！',
                type: 'warning',
            })
            return
        }
        if(addOrEdit.value == "add"){
            window.ButtonGroup.insert({"name":buttonGroupName.value})
        }else if(addOrEdit.value == "edit"){
            window.ButtonGroup.update({"id":buttonGroupId.value,"name":buttonGroupName.value})
        }
        emit("refreshData");
        handleClose()
    }

    function handleClose(){
        clearInput()
        emit("closeAddButtonGroupView");
    }

    function clearInput(){
        buttonGroupName.value = ""
    }
</script>

<template>
    <el-dialog v-model="buttonGroupEditVisible" :title="title" width="50%" :before-close="handleClose">
        <div>
            <span style="width: 20%;display: block;float: left;margin-top: 5px;text-align: center;">按钮组名称：</span>
            <el-input style="width: 75%;" v-model="buttonGroupName" placeholder="请输入按钮组名称" />
        </div>
        <div class="dialog-footer">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<style scoped>
    .dialog-footer button:first-child {
        margin-right: 10px;
    }
    .dialog-footer{
        margin-top: 10px;
        text-align: center;
    }
</style>