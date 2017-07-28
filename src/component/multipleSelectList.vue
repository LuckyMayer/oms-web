<template>
    <div :id="id" @mouseleave="returnSelectedIds" @mousemove="setPositionAndShow(id)">
        <input :id="id+'_input'" type="text" :placeholder="placeholder||'请选择...'" class="form-control input-sm" v-model="selectedNames" style="padding-left:5px;position:relative;z-index:998">
        <div :id="id+'_div'" v-show="showDivList" style="background-color:white;white-space:nowrap;
            border:1px solid #9DC1FA;position:absolute;z-index:999;max-height:400px;overflow-y:auto;">
            <li v-for='(item, index) in listarray' style="margin-bottom:-5px;list-style-type:none;padding-left:5px;padding-right:5px;text-align:left">
                <input :id="id+index" :value="index" type="checkbox" class="checkProvince" style="vertical-align: -2px;_vertical-align: -1px;cursor: pointer;" v-model="selectedIds">
                <label style="font-weight:400;cursor: pointer;" :for="id+index">{{item}}</label>
            </li>
        </div>
    </div> 
</template> 
<script>
export default {
    props: [ "id","placeholder","listarray"], 
    data () {
        return {
            selectedIds: [],         //搜索列表"config","parame
            showDivList:false,      //是否显示下拉列表
            selectedNames: '',
            myPlaceholder:'',     
        }
    },
    methods: { 
        setPositionAndShow(id){
            var input = document.getElementById(id+"_input");  
            $("#"+id+"_div").css({"left":input.offsetLeft,'min-width':input.offsetWidth+'px' });
            this.showDivList=true;
            this.selectedNames='';
            for(var i=0;i<this.selectedIds.length;i++){
                this.selectedNames+=','+this.listarray[this.selectedIds[i]];
            }
            this.selectedNames=this.selectedNames.substring(1,this.selectedNames.length);
        },
        returnSelectedIds(){
            this.$emit('choose', {      
                data: {
                    selectedIds:this.selectedIds,
                    selectedNames:this.selectedNames,
                }
            }); 
            this.showDivList=false;
        }
    },
}
</script>
