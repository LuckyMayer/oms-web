<template>
  <div class="content-wrapper">
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>系统</a></li>
        <li>用户档案</li>
        <li class="active">权限分派</li>
      </ol>
    </section>
    <!-- Main content -->
    <section class="content assign content_yjlu">
      <div class="row form-horizontal">
        <div class="col-md-12 bgFFF" style="border-bottom: 3px solid #f2f2f2;">
          <div class="form-group">
            <label class="control-label" style="font-weight: bold;float:left;margin-left:20px">分派权限:
              <font color="red">{{userMessage.userName}}</font>
            </label>
            <a class="col-sm-1 control-label">取消</a>
            <div class="col-sm-1 textAlignRight">
              <button class="btn btn-sm btn-primary" @click="userAssign">确认</button>
            </div>
          </div>
        </div>
        <div class="col-md-12 bgFFF">
          <div class="form-group">
            <label class="control-label col-sm-1" style="margin-right: 20px;">添加业务组</label>
            <div class="col-sm-2">
              <div class="looklook" @click="isOpen = true">点击查看</div>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-1" style="margin-right: 20px;">分派角色</label>
            <div class="col-sm-2">
              <search-role id="role" @selected="searchRole"></search-role>
              <div class="addIcon" @click="addRole">+添加</div>
            </div>
            <div class="col-sm-7 col-md-offset-1">
              <span class="roleName" v-for="(roleItem, i) in userMessage.roleList">
                <label class="control-label">{{roleItem.roleName}}</label>
                <i class="iconfont iconfontDelete" @click="delRole(i)">&#xe63c;</i>
              </span>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-1" style="margin-right: 20px;">分派权限</label>
          </div>
        </div>
        <div v-for="resourceItem in resourceList" class="resourceList">
          <div class="col-md-12">
            <label class="checkbox-inline">
              <input type="checkbox" :value="resourceItem.id" v-model="userMessage.resourceList" />{{resourceItem.name}}
            </label>
          </div>
          <div class="col-md-12 bgFFF">
            <label class="checkbox-inline" v-for="child in resourceItem.children">
              <input type="checkbox" :value="child.id" v-model="userMessage.resourceList" />{{child.name}}
            </label>
          </div>
        </div>
      </div>
    </section>
    <!-- 弹窗 -->
    <div class="popup-wrap-yjlu popup-assign" v-if="isOpen">
      <div class="popup-content row form-inline">
        <p class="popup-title">添加业务组</p>
        <div class="popup-main clearfix">
          <div class="col col-md-12">
            <!-- <div class="form-group">
              <label class="popup-laval">业务组分类</label>
              <label class="checkbox-inline" v-for="parentParty in partyList"><input type="checkbox"/>{{parentParty.groupName}}</label>
            </div> -->
            <div class="form-group" v-for="partyGroup in partyList">
              <label class="popup-laval">{{partyGroup.groupName}}</label>
              <div class="partyGroupVal">
                <label class="checkbox-inline" v-for="partyItem in partyGroup.parties">
                  <input type="checkbox" :value="partyItem.partyId" v-model="userMessage.partyList" />{{partyItem.partyName}}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button class="btn btn-sm btn-primary" @click="isOpen = false;"><i class="fa fa-check"></i>确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../../common/http'
import api from '../../common/api'
import deepClone from '../../common/deepClone'
import initStyle from '../../common/initStyle'

import searchRole from '../../component/searchRole'
var _self = {};
export default {
  components: {
    searchRole
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
      initStyle();
      this.getUserDetail();
    });
  },
  data () {
    return {
      isOpen: false,
      assignData: {
        assignUserId: this.$route.params.id,
        addPartyIdList: [],  //添加的业务组Id列表
        deletePartyIdList: [],
        addRoleIdList: [],  //添加的角色Id列表
        deleteRoleIdList: [],
        addResourceIdList: [],  //添加的权限Id列表
        deleteResourceIdList: []
      },
      //added by zhangning 2017-06-06
      userMessage:{   //保存用户信息,用于数据绑定
        userName:'',  //给谁分配权限
        roleList:[],  //角色列表
        resourceList:[],  //权限列表
        partyList:[], //业务组列表
      },
      userMessageCopy:{},   //用于比较
      roleList:[],  //角色列表
      resourceList:[],  //权限列表
      partyList:[], //业务组列表

      selectedRole:{},
    }
  },
  methods: {
    getUserDetail () {
      http({
        instance: _self,
        url: api.getUserDetail,
        type: 'post',
        hasLoading: true,
        data: {
          data: {
            getUserId: _self.$route.params.id
          }
        },
        success (res) {
          if (res.success) {
            _self.userMessage.userName=res.data.userName;
            _self.userMessage.roleList = res.data.roles;
            res.data.resources.forEach(function (item){
              _self.userMessage.resourceList.push(item.id);
            });
            var getAll=false;   //是否需要获得所有业务组id
            if (res.data.partyIdList!='all') {  //不是所有业务组权限
              _self.userMessage.partyList = res.data.partyIdList.split(',');
              _self.userMessageCopy= deepClone(_self.userMessage);
            } else {            //如果该用户拥有所有业务组权限
              getAll=true;
            }
            _self.getPartyList(getAll);
            _self.getResourceList();
          }
        }
      });
    },
    getPartyList (getAll) {
      http({
        instance: _self,
        url: api.partyBarList,//api.getPartyList,
        type: 'post',
        hasLoading: false,
        data: {
          data: {}
        },
        success (res) {
          if (res.success) {
            _self.partyList = res.data;
            _self.partyList[0]['groupName']='其他';
            if(getAll){
              _self.partyList.forEach(function (partygroup){
                partygroup.parties.forEach(function (party){
                  _self.userMessage.partyList.push(party.partyId);
                });
              });
              _self.userMessageCopy= deepClone(_self.userMessage);
            }
          }
        }
      });
    },
    getResourceList () {
      http({
        instance: _self,
        url: api.resourceList,
        type: 'post',
        hasLoading: false,
        data: {
          data: {
            tree: true
          }
        },
        success (res) {
          if (res.success) {
            _self.resourceList = res.data;
          }
        }
      });
    },
////角色处理--begin
    addRole () {
      if(_self.selectedRole){
        _self.pushUniqueObjTOArray(deepClone(_self.selectedRole),_self.userMessage.roleList,'roleId');
        _self.selectedRole=null;
      }else{
        layer.msg('请先选择角色', {time: 2000});
      }
    },
    pushUniqueObjTOArray(obj,objArray,index){
      for(var i=0;i<objArray.length;i++){
        if(objArray[i][index]==obj[index]){
          layer.msg('请勿重复添加！', {time: 2000});
          return ;
        }
      }
      objArray.push(obj);
    },
    searchRole (data) {
      if (data) {
        _self.selectedRole = data;
      }
    },
    delRole (i) {
      _self.userMessage.roleList.splice(i, 1);
    },
////角色处理--end
  userAssign () {
      // 业务组对比
      var party_change=_self.getSimpleArrayChanges(_self.userMessageCopy.partyList,deepClone(_self.userMessage.partyList));
      // 角色对比
        var newRoleIds=new Array();
        _self.userMessage.roleList.forEach(function (item){
          newRoleIds.push(item.roleId);
        });
        var oldRoleIds=new Array();
        _self.userMessageCopy.roleList.forEach(function (item){
          oldRoleIds.push(item.roleId);
        });
      var role_change=_self.getSimpleArrayChanges(oldRoleIds,newRoleIds);
      var resource_change=_self.getSimpleArrayChanges(_self.userMessageCopy.resourceList,deepClone(_self.userMessage.resourceList));
      _self.assignData.addPartyIdList=party_change.insert;
      _self.assignData.deletePartyIdList=party_change.delete;
      _self.assignData.addRoleIdList=role_change.insert;
      _self.assignData.deleteRoleIdList=role_change.delete;
      _self.assignData.addResourceIdList=resource_change.insert;
      _self.assignData.deleteResourceIdList=resource_change.delete;
      http({
        instance: _self,
        url: api.userAssign,
        type: 'post',
        hasLoading: true,
        data: {
          data: _self.assignData
        },
        success (res) {
          if (res.success) {
            layer.msg('分派权限成功', {time: 2000});
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
.looklook {
  border: 1px solid #3697DE;
  border-radius: 6px;
  color: #3697DE;
  text-align: center;
  padding-top: 3px;
  padding-bottom: 3px;
  cursor: pointer;
}
.addIcon {
  display: inline-block;
  position: absolute;
  top: 4px;
  right: -40px;
  color: #0066FF;
  cursor: pointer;
}
.popup-content {
  width: 800px;
  margin-left: -400px;
}
.popup-laval {
  width: 8em;
  margin-right: 15px;
  font-weight: bold;
  text-align: right;
}
.checkbox-inline {
  margin: 0 10px 0 0;
}
.checkbox-inline input[type="checkbox"] {
  margin-left: -15px;
}
.partyGroupVal {
  display: inline-block;
  width: 610px;
  vertical-align: top;
}
.resourceList .bgFFF {
  padding: 0 0 0 15px;
}
.resourceList label {
  font-weight: bold;
}
.resourceList .bgFFF label {
  font-weight: 100;
}
.resourceList .bgFFF .checkbox-inline {
  padding-bottom: 7px;
}
.roleName {
  margin-right: 10px;
}
</style>