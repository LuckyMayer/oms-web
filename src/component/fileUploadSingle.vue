<template>
    <button class="btn btn-sm btn-success fileinput-button" :disabled="disabledSelf">
        <i class="fa fa-upload"></i>
        <span v-text="placeholdSelf"></span>
        
        <input :id="id||'fileUpload'" type="file" name="file" :data-url="uploadUrl" :disabled="disabledSelf"/>
    </button>
    
</template>

<script>

export default {
    props: ['id', 'placehold', 'uploadUrl', 'fileType', 'disabled'],
    data () {
        return {
            componentId: '',
            placeholdSelf: this.placehold? this.placehold: "上传文件",
            disabledSelf: (this.disabled!=undefined)? this.disabled: false
        }
    },
    mounted () {
        var _self = this;
        _self.componentId = _self.id || 'fileUpload';

        const proto_placehold = _self.placeholdSelf;

        $("#"+_self.componentId).fileupload({
            dataType: 'json',
            add (e, data) {
                _self.placeholdSelf = "正在上传...";
                _self.disabledSelf = true;

                let fileName = data.files[0].name;
                let uploadFileSuffix = fileName.split('.')[fileName.split('.').length-1];

                let fileTypeList = _self.fileType.split(',');
                for(let i=0;i<fileTypeList.length;i++){
                    if(fileTypeList[i] == uploadFileSuffix){
                        data.submit();
                        return true;
                    }
                }

                _self.placeholdSelf = proto_placehold;
                _self.disabledSelf = false;
                
                layer.msg('文件格式不支持', {
                    time: 1200
                });
            },
            done (e, data) {
                _self.placeholdSelf = proto_placehold;
                _self.disabledSelf = false;

                _self.$emit("upload-done", {
                    componentId: _self.componentId,
                    data: data.result
                });
            }
        });
    }
}
</script>