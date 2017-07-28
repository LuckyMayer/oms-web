<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
        <li><a href="#"><i class="fa fa-desktop"></i>店铺</a></li>
        <li class="active">销售策略</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
        <button class="btn btn-primary btn-sm" @click="newStrategyList"><i class="fa fa-plus"></i>新建策略</button>
      </div>
    </section>

    <!-- Main content -->
    <section class="content content_yjlu">
      <div class="row form-horizontal searchContent bgFFF">
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label col-sm-4">策略编号</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="giftStrategyData.code">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">店铺名称</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="giftStrategyData.code">
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label col-sm-4">策略名称</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="giftStrategyData.name">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">生效时间(包含)</label>
            <div class="col-sm-8">
              <date-picker id="effectiveTime" @choose="chooseOrderStart"></date-picker>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label col-sm-4">策略状态</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="giftStrategyData.status">
                <option value="">--请选择--</option>
                <option value="NOT_START">未开始</option>
                <option value="IN_EFFECT">生效中</option>
                <option value="EXPIRED">已过期</option>
                <option value="UNABLE">停用</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-8 col-sm-offset-4">
              <button class="btn btn-primary btn-sm" @click="getGiftStrategyList"><i class="fa fa-search"></i>查询</button>
              <button class="btn btn-default btn-sm" @click="" style="margin: 0 0 0 20px;"><i class="fa fa-download"></i>导出</button>
            </div>
          </div>
        </div>
      </div>
      <div class="box box-default">
        <div class="box-body">
          <table class="table">
            <thead>
              <tr>
                <th>策略编号</th>
                <th>策略名称</th>
                <th>创建/更新时间</th>
                <th>创建/更新人</th>
                <th>店铺名称</th>
                <th>生效开始<br/>结束时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in giftStrategyList">
                <td>
                  <router-link :to="{name: 'giftStrategyDetail_id_status', params: {id: item.giftStrategyId, status: status(item.status, item.startTime, item.endTime)}}">{{item.giftStrategyCode}}</router-link>
                </td>
                <td>{{item.giftStrategyName}}</td>
                <td>{{item.createTime}}<br/>{{item.lastUpdateTime}}</td>
                <td>{{item.creator.name}}<br/>{{item.updator.name}}</td>
                <td>{{item.shops[0].shopName}}<div v-if="item.shops[1]">...</div></td>
                <td>{{item.startTime}}<br/>{{item.endTime}}</td>
                <td class="status">{{item.status | statusFilter(item.startTime, item.endTime, item.operate)}}</td>
                <td>
                  <router-link :to="{name: 'giftStrategyDetail_id_copy_status', params: {id: item.giftStrategyId, copy: true, status: 'NOT_START'}}">复制</router-link>
                  <a style="color: #d9534f" v-if="status(item.status, item.startTime, item.endTime) != 'UNABLE'" @click="statusModify(item.giftStrategyId, 'UNABLE', '停用')">停用</a>
                  <a style="color: #d9534f" v-if="status(item.status, item.startTime, item.endTime) == 'NOT_START'" @click="statusModify(item.giftStrategyId, 'DELETED', '删除')">删除</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="box-footer clearfix">
            <div class="col-md-2 no-padding"></div>
            <pagination :offset="giftStrategyData.offset" :length="giftStrategyData.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'

import datePicker from '../../component/datePicker'
import pagination from '../../component/pagination'
var _self = '';
export default {
  components: {
    datePicker,
    pagination
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
      initStyle();
      this.getGiftStrategyList();
    });
  },
  data () {
    return {
      giftStrategyData: {
        code: '',
        name: '',
        status: '',
        shopId: '',
        partyId: '',
        time: '',
        offset: '0',
        length: '10'
      },
      pageData: {
        totalCount: ''
      },
      giftStrategyList: [],
      curTime: (new Date()).getTime()
    }
  },
  filters: {
    statusFilter (val, startTime, endTime, operate) {
      startTime = new Date(startTime).getTime();
      endTime = new Date(endTime).getTime();
      if (val == 'NORMAL') {
        if (_self.curTime < startTime) {
          val = 'NOT_START';
        } else if (_self.curTime > endTime) {
          val = 'EXPIRED';
        } else {
          val = 'IN_EFFECT';
        }
      }
      var statusObj = {
        NOT_START: '未开始',
        IN_EFFECT: '生效中',
        EXPIRED: '已过期',
        UNABLE: '已停用'
      }
      for (var i in statusObj) {
        if (i == val) {
          return statusObj[i];
        }
      }
    }
  },
  methods: {
    statusModify (id, status, name) {
      const _self = this;
      layer.confirm('确认要'+name+'吗', function(){
        http({
          instance: _self,
          url: api.giftStrategyStatusModify,
          type: 'post',
          data: {
            data: {
              giftStrategyId: id,
              status: status
            }
          },
          success (res) {
            console.log(res);
            if (res.data) {
              layer.closeAll();
              _self.getGiftStrategyList();
            }
          }
        });
      }, function(){
        
      });
    },
    status (val, startTime, endTime, operate) {
      startTime = new Date(startTime).getTime();
      endTime = new Date(endTime).getTime();
      if (val == 'NORMAL') {
        if (_self.curTime < startTime) {
          val = 'NOT_START';
        } else if (_self.curTime > endTime) {
          val = 'EXPIRED';
        } else {
          val = 'IN_EFFECT';
        }
      }
      return val;
    },
    newStrategyList () {
      this.$router.push({name: 'giftStrategyDetail'});
    },
    getGiftStrategyList () {
      const _self = this;
      http({
        instance: _self,
        url: api.getGiftStrategyList,
        type: 'post',
        data: {
          data: _self.giftStrategyData
        },
        success (res) {
          if (res.data) {
            _self.giftStrategyList = res.data.content;
            _self.pageData.totalCount = res.data.totalCount;
          }
        }
      });
    },
    chooseOrderStart (time) {
      this.giftStrategyData.time = time.data;
    },
    paginate (data) {
      this.giftStrategyList.offset = data.offset;
      this.giftStrategyList.length = data.length;
      this.getGiftStrategyList();
    }
  }
}
</script>