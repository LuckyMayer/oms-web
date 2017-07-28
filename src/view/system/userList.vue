<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
        <li><a href="#"><i class="fa fa-desktop"></i>系统</a></li>
        <li class="active">用户档案</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
        <button class="btn btn-sm btn-primary" @click="addUser">
          <i class="fa fa-plus"></i>新建用户
        </button>
      </div>
    </section>
    </section>
    <!-- Main content -->
    <section class="content content_yjlu">
      <div class="row form-horizontal searchContent bgFFF">
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label col-sm-4">行政部门</label>
            <div class="col-sm-8">
              <select class="form-control input-sm" v-model="searchData.adminDept">
                <option value="">==请选择==</option>
                <option value="OP">运营</option>
                <option value="CS">客服</option>
                <option value="WH">仓库</option>
                <option value="BD">BD</option>
                <option value="HR">人事</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">可授权角色</label>
            <div class="col-sm-8">
              <search-role id="privilegeRole" @selected="searchPrivilegeRole"></search-role>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label col-sm-4">行政组别</label>
            <div class="col-sm-8">
              <select class="form-control input-sm" v-model="searchData.adminGroup">
                <option value="">==请选择==</option>
                <option></option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-8 col-sm-offset-4">
              <button class="btn btn-sm btn-primary" @click="getUserList"><i class="fa fa-search"></i>查询</button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label col-sm-4">功能角色</label>
            <div class="col-sm-8">
              <search-role id="assignRole" @selected="searchAssignRole"></search-role>
            </div>
          </div>
        </div>
      </div>
      <div class="box box-default">
        <div class="box-body">
          <table class="table">
            <thead>
              <tr>
                <th>工号</th>
                <th>用户名</th>
                <th>姓名</th>
                <th>行政部门</th>
                <th>行政组别</th>
                <th>工作邮箱</th>
                <th>工作手机</th>
                <th>创建时间</th>
                <th>最后登录时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if='userList.length==0'>
                <td colspan="100">
                  <h4 class='text-center text-gray'>什么也没有...</h4>
                </td>
              </tr>
              <tr v-for="item in userList">
                <td>{{item.userId}}</td>
                <td>{{item.userAccount}}</td>
                <td>{{item.userName}}</td>
                <td>{{item.adminDept | adminDeptFilter}}</td>
                <td>{{item.adminGroup}}</td>
                <td>{{item.workEmail}}</td>
                <td>{{item.workPhone}}</td>
                <td>{{item.createTime}}</td>
                <td>{{item.lastLoginTime}}</td>
                <td>
                  <a @click="editFun(item)">编辑</a>
                  <router-link :to="{name: 'assign_id', params: {id: item.userId}}">分派</router-link>
                  <router-link :to="{name: 'accredit_id', params: {id: item.userId}}">授权</router-link>
                  <enable-diasble-btn idname="targetUserId" :id="item.userId" :status="item.status" enableapi="userEnable" disableapi="userDisable" margin-left="10px" :refresh="getUserList" ref="child"></enable-diasble-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="box-footer clearfix">
          <div class="col-md-2 no-padding"></div>
          <pagination :offset="searchData.offset" :length="searchData.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
        </div>
      </div>
    </section>
    <!-- 弹窗 -->
    <div class="popup-wrap-yjlu popup-distributorManage" v-if="isOpen">
      <div class="popup-content row form-inline">
        <p class="popup-title" v-if="covertype === 'update'">编辑用户</p>
        <p class="popup-title" v-if="covertype === 'add'">创建用户</p>
        <div class="popup-main clearfix">
          <div class="col col-md-12">
            <div class="form-group">
              <label class="popup-laval required">用户名</label>
              <input class="form-control input-sm" type="text" v-model="addData.userAccount" />
            </div>
            <div class="form-group">
              <label class="popup-laval required">姓名</label>
              <input class="form-control input-sm" type="text" v-model="addData.userName" />
            </div>
            <div class="form-group">
              <label class="popup-laval required">行政部门</label>
              <select class="form-control input-sm" v-model="addData.adminDept">
                <option value="">==请选择==</option>
                <option value="OP">运营</option>
                <option value="CS">客服</option>
                <option value="WH">仓库</option>
                <option value="BD">BD</option>
                <option value="HR">人事</option>
              </select>
            </div>
            <div class="form-group">
              <label class="popup-laval">行政组别</label>
              <select class="form-control input-sm" v-model="addData.adminGroup">
                <option value="">==请选择==</option>
              </select>
            </div>
            <div class="form-group">
              <label class="popup-laval required">工作邮箱</label>
              <input class="form-control input-sm" type="text" v-model="addData.workEmail" />
            </div>
            <div class="form-group">
              <label class="popup-laval">工作手机</label>
              <input class="form-control input-sm" type="text" v-model="addData.workPhone" />
            </div>
            <div class="form-group">
              <label class="popup-laval" :class="{'required':covertype == 'add'}">新密码</label>
              <input class="form-control input-sm" type="text" v-model="addData.password" />
            </div>
            <div class="form-group">
              <label class="popup-laval" :class="{'required':covertype == 'add'}">确认密码</label>
              <input class="form-control input-sm" type="text" v-model="password_again" />
            </div>
            <div class="form-group">
              <label class="popup-laval required">IP访问策略</label>
              <select class="form-control input-sm" v-model="addData.ipAccessPolicy">
                <option value="">==请选择==</option>
                <option value="ANYWHERE">任意IP访问</option>
                <option value="COMPANY">仅公司内访问</option>
                <option value="SELECTED">指定IP访问</option>
              </select>
            </div>
            <div class="form-group">
              <label class="popup-laval">允许IP地址</label>
              <textarea class="form-control input-sm" v-model="addData.accessIpList" placeholder="用英文逗号隔开"></textarea>
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button class="btn btn-sm btn-primary" @click="saveFun">
            <i class="fa fa-check"></i>保存
          </button>
          <button class="btn btn-sm btn-default" @click="isOpen = false;"><i class="fa fa-reply"></i>取消</button>
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

import pagination from '../../component/pagination'
import enableDiasbleBtn from '../../component/enableOrDisableBtn'
import searchRole from '../../component/searchRole'
export default {
  components: {
    pagination,
    enableDiasbleBtn,
    searchRole
  },
  mounted () {
    this.$nextTick(() => {
      initStyle();
      this.getUserList();
    });
  },
  data () {
    return {
      isOpen: false,
      covertype: 'add',
      pageData: {
        totalCount: ''
      },
      searchData: {
        adminDept: '',
        adminGroup: '',
        assignRoleId: -1,
        privilegeRoleId: -1,
        offset: 0,
        length: 10,
      },
      userList: [],
      addData: {
        userAccount: '',
        userName: '',
        adminDept: '',
        adminGroup: '',
        workEmail: '',
        workPhone: '',
        password: '',
        ipAccessPolicy: '',
        accessIpList: '',
      },
      password_again: ''
    }
  },
  filters: {
    adminDeptFilter (val) {
      var obj = {
        OP: '运营',
        CS: '客服',
        WH: '仓库',
        BD: 'BD',
        HR: '人事'
      }
      for (var i in obj) {
        if (i == val) {
          return obj[i];
          return false;
        }
      }
    }
  },
  methods: {
    clearData () {
      for (var i in this.addData) {
        this.addData[i] = '';
      }
      this.password_again='';
    },
    editFun (item) {
      this.isOpen = true;
      this.covertype = 'update';
      this.clearData();
      for (var i in item) {
        for (var j in this.addData) {
          if (i == j) {
            this.addData[j] = item[i];
          }
        }
      }
      this.addData.modifyUserId = item.userId;
    },

    check () {
      var isRequired = true;
      var required = [{
        key: 'userAccount',
        name: '用户名'
      }, {
        key: 'userName',
        name: '姓名'
      }, {
        key: 'adminDept',
        name: '行政部门'
      }, {
        key: 'workEmail',
        name: '工作邮箱'
     // }, {
      //  key: 'password',
      //  name: '新密码'
      // }, {
      //   key: 'password_again',
      //   name: '确认密码'
      }, {
        key: 'ipAccessPolicy',
        name: 'IP访问策略'
      }];
      if(this.covertype == 'add'){
        required.push({
          key: 'password',
          name: '新密码'
        });
      }
      showMessage(required);
      for (var i = 0; i < required.length; i++) {
        if (!this.addData[required[i].key]) {
          layer.msg('请填写'+required[i].name, {time: 2000});
          isRequired = false;
          return false;
        }
      }
      var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!regEmail.test(this.addData.workEmail)) {
        layer.msg('请填写有效邮箱', {time: 2000});
        isRequired = false;
        return false;
      }
      // var regPhone=/^((13[0-9]{1})|159|153)+\d{8}$/;   不对手机号进行校验
      // if (!regPhone.test(this.addData.workPhone)) {
      //   layer.msg('请填写有效手机号码', {time: 2000});
      //   isRequired = false;
      //   return false;
      // }
      // 有效密码判断
      if(this.covertype == 'add'){    //只有新建的时候才进行密码验证
        var str = this.addData.password;
        var regUpper = /[A-Z]+/;
        var regLower = /[a-z]+/;
        var regStr = /[0-9]+/;
        var complex = 0;
        if (regLower.test(str)) {
          ++complex;
        }
        if (regUpper.test(str)) {
          ++complex;
        }
        if (regStr.test(str)) {
          ++complex;
        }
        if (complex < 3 || str.length < 8) {
          layer.msg('包含大小写字母，数字,特殊字符,长度至少8位', {time: 2000});
          isRequired = false;
          return false;
        }
        if (this.addData.password !== this.password_again) {
          layer.msg('密码不一致', {time: 2000});
          isRequired = false;
          return false;
        }
      }
      return isRequired;
    },
    saveFun () {
      const _self = this;
      if (_self.check()) {
        if (_self.covertype == 'add') {
          delete this.addData.modifyUserId;
          http({
            instance: _self,
            url: api.addUser,
            type: 'post',
            data: {
              data: _self.addData
            },
            success (res) {
              if (res.success) {
                layer.msg('添加成功', {time: 2000});
                _self.getUserList();
                _self.isOpen = false;
              }
            }
          });
        } else {
          http({
            instance: _self,
            url: api.updateUser,
            type: 'post',
            data: {
              data: _self.addData
            },
            success (res) {
              if (res.success) {
                layer.msg('修改成功', {time: 2000});
                _self.getUserList();
                _self.isOpen = false;
              }
            }
          });
        }
      }
    },
    addUser () {
      this.isOpen = true;
      this.covertype = 'add';
      this.clearData();
    },
    getUserList () {
      const _self = this;
      http({
        instance: _self,
        url: api.getUserList,
        type: 'post',
        hasLoading: true,
        data: {
          data: _self.searchData
        },
        success (res) {
          if (res.success) {
            _self.userList = res.data.content;
            _self.pageData.totalCount = res.data.totalCount;
          }
        }
      });
    },
    searchPrivilegeRole (data) {
      if (data) {
        this.searchData.privilegeRoleId = data.roleId;
      } else {
        this.searchData.privilegeRoleId = '';
      }
    },
    searchAssignRole (data) {
      if (data) {
        this.searchData.assignRoleId = data.roleId;
      } else {
        this.searchData.assignRoleId = '';
      }
    },
    paginate (data) {
      this.searchData.offset = data.offset;
      this.searchData.length = data.length;
      this.getUserList();
    }
  }
}
</script>

<style scoped>
td a {
  margin-right: 10px;
}
</style>