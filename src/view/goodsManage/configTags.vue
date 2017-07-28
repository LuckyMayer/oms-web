<template>
<div class="content-wrapper">
    <section class="content-header">
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-desktop"></i> 商品管理</a></li>
            <li class="active">配置</li>
            <li class="active">标签配置</li>
        </ol>
    </section>
    
    <!-- Main content -->
    <section class="content">
        <div class="row">
            <div class="col-md-12">
                <div class="nav-tabs-custom">
                    <ul class="nav nav-tabs">
                        <li class="active"><a href="#configTags" data-toggle="tab">标签配置</a></li>
                        <li><router-link :to="{ name: 'configStyle'}">规格配置</router-link></li>
                        <li><router-link :to="{ name: 'configCategory'}">分类配置</router-link></li>
                    </ul>
                    <div class="tab-content">
                        <div style="background-color:#EEEEEE;padding:0px 10px" class="tab-pane active clearfix" id="configTags">
                            <div style="background-color:#FFFFFF; border-radius:5px; margin:10px 0px; padding:10px 0px;">
                                <div class="col-md-4" style="float:none">
                                    <button class="btn btn-sm btn-primary" @click="addTag" >添加标签</button>
                                    <span id="addTagModal" style="display:none;">
                                        <input class="form-control input-sm" v-model="tagName" style="width:45%; display: inline;" placeholder="标签名称"/>
                                        <button @click="commitAddTag" class="btn btn-xs btn-primary">保存</button>
                                        <button @click="cancelAddTag" class="btn btn-xs btn-danger">取消</button>
                                    </span>
                                </div>
                            </div>
                            <div v-if='GoodsTag.length==0'>
                                <h4 class='text-center text-gray'>该业务组还没有添加标签...</h4>
                            </div>
                            <div>
                                <div v-for='(item, nameIndex) in GoodsTag' style="background-color:#FFFFFF;padding:10px;border-radius:5px;margin:10px 0px"> 
                                    <div>
                                        <span @mousemove="showDeleteIcon=item.name" @mouseleave="showDeleteIcon=''">
                                            <label class="tagName" style="color:#888888">{{item.name}}</label> 
                                            <a v-if="showDeleteIcon==item.name" href="javascropt:void(0);" data-toggle="tooltip" data-placement="right" class="deleteTagName" @click="delTagName(nameIndex,item.id)" style="position:absolute;"><i class="fa fa-times" style="color:#DDDDDD"></i></a>
                                        </span>
                                        <div class="col-md-4 updateTagName" style="display:none">
                                            <input style="width:45%;display:inline" class="form-control input-sm newUpdateTagName" v-model="item.name"/>
                                            <button @click="commitUpdateTagName(nameIndex,item.id)" class="btn btn-xs btn-primary">保存</button>
                                        </div>
                                        <div class="col-md-4 inputTagValue" style="visibility:hidden;float:none;display:inline-block">
                                            <input style="width:45%;display:inline" class="form-control input-sm tagValueAddInput" placeholder="标签值"/>
                                            <span>
                                                <button @click="commitAddTagValue(nameIndex,item.id)" class="btn btn-xs btn-primary">保存</button>
                                                <button @click="cancelAddTagValue(nameIndex)" class="btn btn-xs btn-danger">取消</button>
                                            </span>
                                        </div>
                                        <div style="display:inline-block; float:right">
                                            <button @click="updateTagName(nameIndex)" class="btn btn-xs btn-info">修改名称</button>
                                            <button @click="addTagValue(nameIndex)" class="btn btn-xs btn-primary">添加值</button>
                                        </div>
                                        <div style="clear:both"></div>
                                    </div>
                                    <div style="margin-top:10px; float:none; font-size:12px" class="col-md-12">
                                        <template v-for='(one, valueIndex) in item.values'> 
                                            <span @mousemove="showDeleteIcon=one.value" @mouseleave="showDeleteIcon=''" class="mySpan">
                                                {{one.value}}
                                                <a v-if="showDeleteIcon == one.value" style="position:absolute;right:5px;top:5px;cursor: pointer;" data-toggle="tooltip" data-placement="right" class="text-red" @click="delTagValue(one.id,nameIndex,valueIndex)"><i class="fa fa-times" style="font-weight:normal;color:#DDDDDD"></i></a>
                                            </span>
                                        </template>
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
.labelButton{color:#309BC2;cursor: pointer;font-weight:normal} 
.mySpan{position:relative;margin:2px 5px;padding:5px 20px;border:1px solid #DDDDDD;display:inline-block}
label{font-weight:normal}
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
        //获得当前所在业务组？？？

         this.getTags();     //
    },
    data () {
        return {
            tagName:'',     //保存要增加的一级标签名称
            GoodsTag:[],
            showDeleteIcon:''
        }
    },
    methods: {
        getTags(){               //获得该业务组下所有标签
            const _self = this;
            http({
                instance: _self,
                url: api.getGoodsTagList,
                type: 'post',
                hasLoading: true,
                success (res) {
                     _self.GoodsTag=res.data.content;
                }
            });
        },
        addTag(){                       //点击增加标签按钮，显示输入框
            $("#addTagModal").show();
        },
        cancelAddTag(){                 //取消增加标签
            this.tagName='';
            $("#addTagModal").hide();
        },
        commitAddTag(){                 //增加标签
            const _self = this;
            if(this.tagName==''){
                alert("请输入标签名！");
                return;
            } 
            var mydata= {
                "data": {
                    "name":_self.tagName,
                    "status":"NORMAL"
                }
            };
            this.cancelAddTag();
            http({
                instance: _self,
                url: api.addTag,
                type: 'post',
                data:mydata,
                success (res) {
                    console.log(res);
                    if(res.msg=='success'){
                        _self.GoodsTag.unshift(res.data); 
                    }else{
                        alert("添加失败!");
                    }
                }
            });
        },
        updateTagName(nameIndex){       //点击编辑标签按钮
            $('.updateTagNameButton').eq(nameIndex).hide();  //隐藏添加标签的按钮
            $('.tagName').eq(nameIndex).hide();              //隐藏标签名称
            $('.deleteTagName').eq(nameIndex).hide();              //隐藏标签名称
            $('.updateTagName').eq(nameIndex).css('display', 'inline-block');        //显示更新标签的输入框等
        },
        commitUpdateTagName(nameIndex,tagId){
            const _self = this;
            var newTagValue=$('.newUpdateTagName').eq(nameIndex).val();
            if(newTagValue==''){
                alert("请输入标签值！");
                return;
            }
            http({
                instance: _self,
                url: api.modifyTag,
                type: 'post',
                data:{
                    "data": {
                        "id":tagId,
                        "name":newTagValue
                    }
                },
                success (res) {
                    console.log(res);
                    if(res.msg!='success'){
                        alert("删除失败!");
                    }
                }
            });
            $('.updateTagNameButton').eq(nameIndex).show();  //显示更新标签的按钮
            $('.tagName').eq(nameIndex).show();             //显示标签名称
            $('.deleteTagName').eq(nameIndex).show();              //隐藏标签名称
            $('.updateTagName').eq(nameIndex).hide();        //隐藏更新标签的输入框等
        },
        delTagName(nameIndex,tagId){     //删除标签
            const _self = this;
            var layerIndex = layer.confirm('您确定删除吗?', {
                btn: ['是','否'],
                title: false,
                shadeClose: true,
                closeBtn: 0
            }, () => {
                this.cancelAddTag();
                http({
                    instance: _self,
                    url: api.deleteTag,
                    type: 'post',
                    data:{
                        "data": {
                            "id":tagId
                        }
                    },
                    success (res) {
                        console.log(res);
                        if(res.msg=='success'){
                            _self.GoodsTag.splice(nameIndex, 1);  
                        }else{
                            alert("删除失败!");
                        }
                    }
                });
                layer.close(layerIndex);
            });
        },
        addTagValue(nameIndex){           //点击添加标签值按钮
             $('.addTagValueButton').eq(nameIndex).hide();  //隐藏添加标签的按钮
             $('.inputTagValue').eq(nameIndex).css('visibility', 'visible');      //显示添加标签的输入框等
        },
        cancelAddTagValue(nameIndex){
            $('.addTagValueButton').eq(nameIndex).show();   //显示添加标签的按钮
            $('.newTagValue').eq(nameIndex).val('');        //清空标签值
            $('.inputTagValue').eq(nameIndex).css("visibility", "hidden");       //隐藏添加标签的输入框等
        },
        commitAddTagValue(nameIndex,tagId){                 //添加标签值
            const _self = this;
            var newTagValue=$('.tagValueAddInput').eq(nameIndex).val();
            if(!newTagValue){
                alert("请输入标签值！");
                return;
            }
            http({
                instance: _self,
                url: api.addTagValue,
                type: 'post',
                data:{
                    "data": {
                        "goodsTagId":tagId,
                        "goodsTagV":newTagValue
                    }
                },
                success (res) {
                    if(res.msg=='success'){
                        _self.getTags();    //重新获取标签列表
                    }else{
                        alert("添加失败!");
                    }
                }
            });
            this.cancelAddTagValue(nameIndex);  
        },
        delTagValue(tagValueId,nameIndex,valueIndex){  //删除标签值
            var layerIndex = layer.confirm('您确定删除吗?', {
                btn: ['是','否'],
                title: false,
                shadeClose: true,
                closeBtn: 0
            }, () => {
                const _self = this;
                http({
                    instance: _self,
                    url: api.deleteGoodsTagValue,
                    type: 'post',
                    data: {
                        "data": {
                            "id":tagValueId
                        }
                    },
                    success (res) {
                        if(res.msg=='success') {
                            _self.GoodsTag[nameIndex].values.splice(valueIndex, 1);
                        }
                        layer.close(layerIndex);
                    }
                });
            });
        },
    },
}
</script>
