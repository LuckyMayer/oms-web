<template>
    <div class="content-wrapper">
        <section class="content-header">
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-desktop"></i> 商品管理</a></li>
                <li class="active">配置</li>
                <li class="active">规格配置</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="row">
                <div class="col-md-12">
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li><router-link :to="{ name: 'configTags'}">标签配置</router-link></li>
                            <li class="active"><a href="#configStyle" data-toggle="tab">规格配置</a></li>
                            <li><router-link :to="{ name: 'configCategory'}">分类配置</router-link></li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active clearfix" id="configStyle">
                                <div class="col-md-12">
                                    <label class="addStyleButton" @click="addStyle" >添加规格</label>
                                    <div id="addStyleModal" style="display:none;float:left;margin-top:17px;margin-left:20px">
                                        <input style="height:25px;width:120px;" v-model="styleName" placeholder="   规格名称"/>
                                        <label @click="cancelAddStyle" class="labelButton">取消</label>
                                        <label @click="commitAddStyle" class="labelButton">保存</label>
                                    </div>
                                    <br><br><br>
                                    <div v-if='StyleType.length==0'>
                                        <h4 class='text-center text-gray'>该业务组还没有添加规格...</h4>
                                    </div>
                                    <div v-for='(item, nameIndex) in StyleType' style="border-bottom:1px solid #A8A8A8;padding-top:7px;padding-left: 30px;"> 
                                        <div>
                                            <span @mousemove="showDeleteIcon=item.name" @mouseleave="showDeleteIcon=''" style="margin-left: -30px;">
                                                <strong class="styleName">{{item.name}}</strong> 
                                                <template v-if="showDeleteIcon==item.name"><!-- 是否显示删除规格名图标 -->
                                                    <a href="javascropt:void(0);" data-toggle="tooltip" data-placement="right" class="deleteStyleName text-red" @click="delStyleName(nameIndex,item.id)" style="position:absolute;"><i class="fa fa-trash" style="color:#333333"></i></a>
                                                </template>
                                            </span>
                                            <label style="margin-left:25px" @click="updateStyleName(nameIndex)" class="labelButton updateStyleNameButton">编辑</label>
                                            <label class="updateStyleName" style="display:none">
                                                <input style="height:25px;width:120px;" class="newUpdateStyleName" v-model="item.name"/>
                                                <label style="margin-left:10px" @click="commitUpdateStyleName(nameIndex,item.id)" class="labelButton">保存</label>
                                            </label>
                                            <br>
                                            <template v-for='(one, valueIndex) in item.values'> 
                                                <span @mousemove="showDeleteIcon=one.value" @mouseleave="showDeleteIcon=''" >
                                                    <label v-if="valueIndex!=0" style="margin-left:30px;margin-right:30px">|</label>
                                                    {{one.value}} 
                                                    <a v-show="showDeleteIcon==one.value" href="javascropt:void(0);" data-toggle="tooltip" data-placement="right" class="text-red" @click="delStyleValue(nameIndex,valueIndex,one.id)" style="position:absolute;"><i class="fa fa-trash" style="color:#333333"></i></a>
                                                 </span>
                                            </template>
                                            <label @click="addStyleValue(nameIndex)" style="margin-left:30px;" class="labelButton addStyleValueButton">添加</label>
                                            <label class="inputStyleValue" style="display:none">
                                                <input style="height:22px;width:120px;" class="newStyleValue" placeholder="   规格值"/>
                                                <label @click="cancelAddStyleValue(nameIndex)" class="labelButton">取消</label>
                                                <label @click="commitAddStyleValue(nameIndex,item.id)" class="labelButton">保存</label>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<style type="text/css">
.addStyleButton{border:2px dashed #C0C0C0;padding-left:40px;padding-right:40px;padding-top:10px;padding-bottom:10px;margin-top:8px;color:#00CCFF;cursor: pointer;float: left;} 
.labelButton{color:#00CCFF;cursor: pointer;} 
</style>
<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'

export default {
    mounted () {
        this.$nextTick(() => {
            initStyle();
        });
        this.getStyles();
    },
    data () {
        return {
            styleName:'',     //保存要增加的一级规格名称
            StyleType:[],
            showDeleteIcon:''
        }
    },
    methods: {
        getStyles(){               //获得该业务组下所有规格
            const _self = this;
            http({
                instance: _self,
                url: api.getStyleList,
                type: 'post',
                hasLoading: true,
                success (res) {
                    _self.StyleType=res.data.content;
                }
            });
        },
        addStyle(){                       //点击增加规格按钮，显示输入框
            $("#addStyleModal").show();
        },
        cancelAddStyle(){                 //取消增加规格
            this.styleName='';
            $("#addStyleModal").hide();
        },
        commitAddStyle(){                 //添加规格
            const _self = this;
            if(this.styleName==''){
                alert("请输入规格名！");
                return;
            } 
            var mydata= {
                "data": {
                    "status":"NORMAL",
                    "styleTypeName":_self.styleName
                }
            };
            this.cancelAddStyle();
            http({
                instance: _self,
                url: api.addStyle,
                type: 'post',
                data:mydata,
                success (res) {
                    console.log(res);
                    if(res.msg=='success'){
                        var newStyle=res.data;    
                        newStyle.values=[];       
                        _self.StyleType.unshift(newStyle);      //将新规格添加到列表中
                    }else{
                        alert("添加失败!");
                    }
                }
            });
        },
        updateStyleName(nameIndex){       //点击编辑规格按钮
            $('.updateStyleNameButton').eq(nameIndex).hide();  //隐藏添加规格的按钮
            $('.styleName').eq(nameIndex).hide();              //隐藏规格名称
            $('.deleteStyleName').eq(nameIndex).hide();              //隐藏规格名称
            $('.updateStyleName').eq(nameIndex).show();        //显示更新规格的输入框等
        },
        commitUpdateStyleName(nameIndex,styleId){
            const _self = this;
            var newStyleValue=$('.newUpdateStyleName').eq(nameIndex).val();
            if(newStyleValue==''){
                alert("请输入规格值！");
                return;
            }
            http({
                instance: _self,
                url: api.modifyStyle,
                type: 'post',
                data:{
                    "data": {
                        "id":styleId,
                        "name":newStyleValue
                    }
                },
                success (res) {
                    if(res.msg!='success'){
                        alert("修改失败!");
                    }
                }
            });
            $('.updateStyleNameButton').eq(nameIndex).show();  //显示更新规格的按钮
            $('.styleName').eq(nameIndex).show();             //显示规格名称
            $('.deleteStyleName').eq(nameIndex).show();              //隐藏规格名称
            $('.updateStyleName').eq(nameIndex).hide();        //隐藏更新规格的输入框等
        },
        delStyleName(nameIndex,styleId){     //删除规格
            const _self = this;
            var layerIndex = layer.confirm('您确定删除吗?', {
                btn: ['是','否'],
                title: false,
                shadeClose: true,
                closeBtn: 0
            }, () => {
                http({
                instance: _self,
                url: api.deleteStyle,
                type: 'post',
                data:{
                    "data": {
                        "styleId":styleId
                    }
                },
                success (res) {
                    if(res.msg=='success'){
                        _self.StyleType.splice(nameIndex, 1);  
                    }else{
                        alert("添加失败!");
                    }
                }
            });
                layer.close(layerIndex);
            });
        },
        addStyleValue(nameIndex){           //点击添加规格值按钮
             $('.addStyleValueButton').eq(nameIndex).hide();  //隐藏添加规格的按钮
             $('.inputStyleValue').eq(nameIndex).show();      //显示添加规格的输入框等
           
        },
        cancelAddStyleValue(nameIndex){
            $('.addStyleValueButton').eq(nameIndex).show();   //显示添加规格的按钮
            $('.newStyleValue').eq(nameIndex).val('');        //清空规格值
            $('.inputStyleValue').eq(nameIndex).hide();       //隐藏添加规格的输入框等
        },
        commitAddStyleValue(nameIndex,styleId){
            const _self = this;
            var newStyleValue=$('.newStyleValue').eq(nameIndex).val();
            console.log(newStyleValue);
            if(newStyleValue==''){
                alert("请输入规格值！");
                return;
            }
             http({
                instance: _self,
                url: api.addStyleValue,
                type: 'post',
                data:{
                    "data": {
                        "styleId":styleId,
                        "value":newStyleValue
                    }
                },
                success (res) {
                    if(res.msg=='success'){
                        _self.getStyles();
                    }else{
                        alert("添加失败!");
                    }
                }
            });
            this.cancelAddStyleValue(nameIndex);  
        },
        delStyleValue(nameIndex,valueIndex,styleValueId){       //删除规格值
            const _self = this;
            var layerIndex = layer.confirm('您确定删除吗?', {
                btn: ['是','否'],
                title: false,
                shadeClose: true,
                closeBtn: 0
            }, () => {
                http({
                    instance: _self,
                    url: api.deleteStyleValue,
                    type: 'post',
                    data: {
                        "data": {
                            "id":styleValueId
                        }
                    },
                    success (res) {
                        _self.StyleType[nameIndex].values.splice(valueIndex, 1);
                    }
                });
                layer.close(layerIndex);
            });
        },
    },
}
</script>