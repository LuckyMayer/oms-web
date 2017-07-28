<template>
  <div class="content-wrapper">
    <!-- <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>系统</a></li>
        <li class="active">权限管理</li>
      </ol>
    </section> -->
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
          <li><a href="#"><i class="fa fa-desktop"></i> 系统</a></li>
          <li class="active">权限管理</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">    
          <button class="btn btn-sm btn-primary" style="margin-bottom:5px" @click="addNewRole"><i class="fa fa-plus"></i>新建角色</button>
      </div>
    </section>

    <section class="content suppManage content_yjlu">
      <div class="form-horizontal tableContent bgFFF" style="padding:0px">
        <table class="table myTable">
          <thead>
            <tr>
              <th style="width:20%">角色名称</th>
              <th>描述</th>
              <th style="width:10%">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trItem, index) in tableList">
              <td>{{trItem.roleName}}</td>
              <td>{{trItem.roleNote}}</td>
              <td>
                <a @click="editOne(trItem.roleId)"><i class="iconfont">&#xe622;</i></a>&nbsp;
                <a @click="copyOne(trItem.roleId)"><i class="iconfont" >&#xe668;</i></a>&nbsp;
                <a @click="deleteOne(trItem.roleId,index)"><i class="iconfont delete-icon" >&#xe613;</i></a>  
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'

var _self = {};
export default {
  data () {
    return {
      tableList:[],       
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
      initStyle();
    });
    _self.getTableList();
  },
  methods: {
    addNewRole(){
      _self.$router.push({name: 'addNewRole', params: { type:'new'}});
    },
    editOne(roleId){
       _self.$router.push({name: 'addNewRole', params: { type:'edit', id: roleId}});
    },
    copyOne(roleId){
      _self.$router.push({name: 'addNewRole', params: { type:'copy', id: roleId}});
    },
    deleteOne(roleId,index){
      var layerIndex = layer.confirm('您确定删除吗?', {
        btn: ['是','否'],
        title: false,
        shadeClose: true,
        closeBtn: 0
      }, () => {
        http({
          instance: _self,
          url: api.roleDelete,     
          type: 'post',
          data:{"data":{id:roleId},},
          success (res) {
            if(res.success){
              _self.tableList.splice(index,1);
            }else{
              layer.msg("删除失败", {time: 2000});
            }
          }
        }); 
        layer.close(layerIndex);  
      });
    },
    getTableList(){
      http({
        instance: _self,
        url: api.roleList,     
        type: 'post',
        success (res) {
          _self.tableList=res.data;
        }
      });   
    },  
  }
}
</script>
<style scoped>
  .myTable>thead>tr>th {
      vertical-align: middle;    
      text-align: center;    
  }
  .myTable>tbody>tr>td {
      vertical-align: middle;    
      text-align: center;    
  }
</style>