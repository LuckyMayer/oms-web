<template>
  <div class="content-wrapper">
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>系统</a></li>
        <li class="active">权限管理</li>
        <li class="active">新建角色</li>
      </ol>
    </section>

    <section class="content suppManage content_yjlu">

      <div style="padding-bottom:5px">
        <strong v-if="type=='edit'">修改功能角色</strong>
        <strong v-else>新建功能角色</strong>
        <button class="btn btn-sm btn-default" @click="cancel"><i class="fa fa-reply"></i>返回</button>
        <button class="btn btn-sm btn-primary" @click="submit"><i class="fa fa-check"></i>保存</button>
      </div>
      <div class="row form-horizontal searchContent">
        <div class="col-md-4" style="margin-left: -5px">
          <div class="form-group">
            <label class="col-sm-4 control-label">角色名称</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="resourcDetail.roleName"/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">角色描述</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="resourcDetail.roleNote"/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">选择权限</label>
          </div>
        </div>
      </div>
      <div class="form-horizontal tableContent bgFFF" style="padding:0px;margin-top: -12px;">
       <!--  选择权限 -->
        <div v-for="(item, index) in resourceList">
          <div class="rootResourceName">
            <input type="checkbox" :id="'childSpan_'+item.id" :value="item.id" v-model="selectedResourceIds" @click="selectAll('childSpan_'+item.id,'children_'+item.id)">
            <label class="pointer" :for="'childSpan_'+item.id">{{item.name}}</label>
          </div>
          <div class="rootResourceChild">
            <span class="childSpan" v-for="(childItem, childIndex) in item.children">
              <input type="checkbox" :class="'children_'+item.id" :id="'childSpan_'+childItem.id" :value="childItem.id" v-model="selectedResourceIds">
              <label class="pointer" :for="'childSpan_'+childItem.id">{{childItem.name}}</label>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
  
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import deepClone from '../../common/deepClone'

var _self = {};
export default {
  data () {
    return {
      type:'',
      resourceList:[],
      selectedResourceIds:[],
      oldList:[],
      resourcDetail:{},
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
      initStyle();
    });
    _self.type=_self.$route.params.type; 
    http({      //得到所有权限列表
      instance: _self,
      url: api.resourceList,     
      type: 'post',
      data:{"data":{tree:true},},
      success (res) {
        _self.resourceList=res.data;

      }
    });   
    if(_self.type!='new'){
      http({              //得到角色详情与权限列表
        instance: _self,
        url: api.roleDetail,     
        type: 'post',
        data:{"data":{id:_self.$route.params.id},},
        success (res) {
          _self.resourcDetail=res.data;
          _self.resourcDetail.resources.forEach(function (item, index) {  
            _self.selectedResourceIds.push(item.id);
            _self.oldList.push(item.id);
          });
          if(_self.type=='copy'){
            _self.resourcDetail.roleNote='';
            _self.resourcDetail.roleName='';
          }
        }
      });   
    }
  },
  methods: {
    selectAll(myid,className,type){    //多选框全选或全不选
      if(myid!='null'&&!$("#"+myid)[0].checked){  //没被选中
        type='none';
      }
      var doms=$('.'+className); 
      for(var i=0;i<doms.length;i++){
        if(!doms[i].checked&&type!='none'){        //全选,如果没有选中
          doms[i].click();
        }else if(doms[i].checked&&type=='none'){   //全不选,如果选中了
          doms[i].click();
        }
      }
    },
    cancel(){
      this.$router.push({name: 'roleManage'});
    },
    submit(){
      if(typeof(_self.resourcDetail.roleName)=='undefined'||_self.resourcDetail.roleName==''){
        layer.msg("请输入角色名称！", {time: 2000});
        return ;
      }
      if(_self.type=='edit'){
        _self.updateRole();
      }else{
        _self.addNewRole();
      }
    },
    addNewRole(){
      http({
        instance: _self,
        url: api.roleAdd,     //searchData
        type: 'post',
        data:{"data":{
          roleName:_self.resourcDetail.roleName,
          roleNote:_self.resourcDetail.roleNote,
          resourceIds:_self.selectedResourceIds,
        },},
        success (res) {
          if(res.success){
            layer.msg("创建成功！", {time: 2000});
          }else{
            layer.msg("创建失败！", {time: 2000});
          }
        }
      });   
    },  
    updateRole(){
      var changes=_self.getSimpleArrayChanges(deepClone(_self.oldList),deepClone(_self.selectedResourceIds));
      http({
        instance: _self,
        url: api.rolesmodify,     //searchData
        type: 'post',
        data:{"data":{
          roleId:_self.resourcDetail.roleId,
          roleName:_self.resourcDetail.roleName,
          roleNote:_self.resourcDetail.roleNote,
          addResourceIds:changes.insert,
          deletedResourceIds:changes.delete,
        },},
        success (res) {
          if(res.success){
            layer.msg("更新成功！", {time: 2000});
          }else{
            layer.msg("更新失败！", {time: 2000});
          }
        }
      });   
    }, 
    getSimpleArrayChanges(oldList, newList){
      var arrayChanges = {
        insert: [],
        delete: [],
      };
      arrayChanges.insert = newList;
      for (var i = 0; i < oldList.length; i++) {
        var index=$.inArray(oldList[i], newList); 
        if(index>-1){ //如果oldList[i]在新数组中,说明没被删除
          arrayChanges.insert.splice(index, 1); //最终剩下的没被删除的就是插入的
        }else{
          arrayChanges.delete.push(oldList[i]);
        }
      } 
      return arrayChanges;
    },
  }
}

</script>
<style scoped>
  .pointer{cursor: pointer;} 
  input[type=checkbox] {   
    cursor: pointer;
  } 
  .rootResourceName{
    padding: 5px 0px 5px 80px;
    background: #F2F2F2;
  }
  .rootResourceChild{
    padding: 5px 0px 5px 100px;
  }
  .childSpan{
    padding: 5px;
  }
</style>