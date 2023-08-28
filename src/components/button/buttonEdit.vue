<script setup>
    import { ref,computed, watch } from 'vue'
    import {ElMessage} from 'element-plus'
    import UploadUserFile from 'element-plus'

    let buttonName = ref('')
    let buttonPath = ref('')
    let buttonId = ref(0)
    let title = ref("")
    const uploadRef = ref<UploadUserFile>({})

    let props = defineProps({
        "isShow" : Boolean,
        "addOrEdit" : String,
        "buttonGroupId" : Number,
        "button" : Object
    })
    const emit = defineEmits(['closeAddButtonView','refreshData'])

    let buttonEditVisible = computed(()=>{
        return props.isShow
    })
    let addOrEdit = computed(()=>{
        return props.addOrEdit
    })
    let buttonGroupId = computed(()=>{
        return props.buttonGroupId
    })
    let button = computed(()=>{
        return props.button
    })
    watch(addOrEdit,(newValue,oldValue)=>{
        if(newValue == "add"){
            title.value = "新增按钮"
        }else if(newValue == "edit"){
            title.value = "编辑按钮"
        }
    })
    watch(button,(newValue,oldValue)=>{
        buttonId.value = newValue.id
        buttonName.value = newValue.name
        buttonPath.value = newValue.url
    })

    function close(){
        buttonPath.value = ""
        buttonName.value = ""
        handleClose()
    }

    function save(){
        if("" === buttonName.value){
            ElMessage({
                message: '请输入按钮名称！',
                type: 'warning',
            })
            return
        }
        if("" === buttonPath.value){
            ElMessage({
                message: '请选择要保存的文件！',
                type: 'warning',
            })
            return
        }
        if(addOrEdit.value == "add"){
            window.Button.insert({"name":buttonName.value,"url":buttonPath.value,"buttonGroupId":buttonGroupId.value})
        }else if(addOrEdit.value == "edit"){
            window.Button.update({"id":buttonId.value,"name":buttonName.value,"url":buttonPath.value,"buttonGroupId":buttonGroupId.value})
        }
        emit("refreshData");
        buttonPath.value = ""
        buttonName.value = ""
        handleClose()
    }

    function handleClose(){
        buttonPath.value = ""
        buttonName.value = ""
        emit("closeAddButtonView");
    }

    function chooseFile(uploadFile, uploadFiles){
        let path = uploadFile.raw.path
        let name = uploadFile.name
        buttonPath.value = path
        if(buttonName.value == ""){
            let lastIndex = name.lastIndexOf(".")
            name = name.substring(0,lastIndex)
            buttonName.value = name
        }
    }
</script>

<template>
    <el-dialog v-model="buttonEditVisible" :title="title" :before-close="handleClose">
        <div>
            <div>
                <span style="width: 20%;display: block;float: left;margin-top: 5px;text-align: center;">按钮目录：</span>
                <div>
                    <el-input style="width: 75%;" v-model="buttonPath" placeholder="请选择文件"/>
                </div>
                <div style="width: 60px;float: right;position: relative;margin-right: 5%;margin-top: -32px;z-index: 100;">
                    <el-upload ref="uploadRef" class="upload-demo" :show-file-list="false" :auto-upload="false" :on-change="chooseFile">
                        <el-button class="button-path-choose">选择</el-button>
                    </el-upload>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <span style="width: 20%;display: block;float: left;margin-top: 5px;text-align: center;">按钮名称：</span>
                <div>
                    <el-input style="width: 75%;" v-model="buttonName" placeholder="请输入按钮名称" />
                </div>
            </div>
        </div>
        <div class="dialog-footer">
            <span>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="close">取消</el-button>
            </span>
        </div>
    </el-dialog>
</template>

<style scoped>
    .dialog-footer,button:first-child {
        margin-right: 10px;
    }
    .dialog-footer{
        margin-top: 10px;
        text-align: center;
    }
</style>