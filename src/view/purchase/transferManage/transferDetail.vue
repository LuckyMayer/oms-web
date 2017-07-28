<template>
<div class="content-wrapper" style="margin:0;padding:0">
    <!-- <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>采购</a></li>
        <li>调拨单</li>
        <li class="active">调拨单详情</li>
      </ol>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="content-overflow">
        <div class="left-div"><!--左边调拨信息-->
          <div class="bgFFF" style="margin-bottom:22px;background: #C0C0C0;">
            <div class="col-md-4" >
              <strong>订单号:{{dt_detail.orderSn}}</strong> &nbsp;({{partyName}})
            </div>
            <div class="col-md-8" v-show="dt_detail.status!='CANCELLED'&&dt_detail.status!='FINISHED'" style="text-align:right;">  

              <button class="btn btn-xs btn-primary" v-show="dt_detail.status=='INIT'||dt_detail.status=='DENIED'||dt_detail.status=='REJECT'" @click="updateOrder('checkPassDt')">审核通过</button>
              <!-- 
              <button class="btn btn-xs btn-primary" v-show="dt_detail.type=='VIRTUAL_WAREHOUSE_DT'&&dt_detail.status=='PASSED'" @click="updateOrder('virtualInventoryOut')">出库</button>
              <button class="btn btn-xs btn-primary" v-show="dt_detail.type=='VIRTUAL_WAREHOUSE_DT'&&dt_detail.status=='DT_DONE'" @click="updateOrder('virtualInventoryIn')">入库</button>
               -->
              <button class="btn btn-xs btn-primary" v-show="dt_detail.status=='INIT'" @click="updateOrder('checkDeniedDt')">审核否决</button>
               <button class="btn btn-xs btn-primary" v-show="dt_detail.status=='DC_DONE'" @click="updateOrder('finishDt')">完结</button>
              <button class="btn btn-xs btn-primary" v-show="dt_detail.status=='PASSED'" @click="updateOrder('rejectDt')">出库驳回</button>
              <button class="btn btn-xs btn-primary" v-show="dt_detail.status=='DT_DONE'||dt_detail.status=='DC_EXECUTING'" @click="showSelectModel=true">中止入库</button>
              <button class="btn btn-xs btn-danger" v-show="dt_detail.status=='INIT'||dt_detail.status=='PASSED'||dt_detail.status=='DENIED'||dt_detail.status=='REJECT'" @click="updateOrder('cancelDt')">作废订单</button>
            </div>
          </div>
          <div v-if="dt_detail.dcOrder" class="bgFFF" style="margin-bottom:30px;background: #C0C0C0;">
            <div class="col-md-4" >
              <strong>{{dt_detail.dcOrder.orderSn}}</strong>
            </div>
          </div>
          <compenont style="padding-top:10px" v-if="myStateData.length > 0" is="process-state2" class="col-md-12" :statedata="myStateData" :curstate="curState" :style-obj="styleObj"></compenont>
          <div class="col-md-12 bgFFF" style="font-size:12px;padding-bottom:10px">

              <div class="form-group col-md-12">
                <label class="col-sm-3 control-label nopadding" v-show="!dt_detail.isReserved">无法审核：预定失败
                </label>
                <label class="col-sm-3 control-label nopadding">【申请调拨数】{{dt_detail.applyDtNum}}</label>
                <label class="col-sm-2 control-label nopadding">【实际出库数】{{dt_detail.actuallyTransferOutCount}}</label>
                <label class="col-sm-2 control-label nopadding">【实际入库数】{{dt_detail.actuallyTransferInCount}}</label>
                <label class="col-sm-2 control-label nopadding">【在途数量】{{dt_detail.onWayCount}}</label>
              </div>
              <div v-if="dt_detail.exceptionLable" class="form-group">
                <div class="col-sm-2"><button class="btn btn-xs btn-info" @click="clearExceptionLable">清除异常</button></div>
                <div class="col-sm-5">异常标签：
                   <span v-for="(item,index) in dt_detail.exceptionLable" class="added-tag">{{item}}</span>
                </div>
                <label v-show="dt_detail.terminateWarehouse" class="col-sm-5 control-label">中止入库仓：{{dt_detail.terminateWarehouse}}</label>
              </div>
              <div v-else class="form-group">
                  <label style="margin-left:8.3%;color:green">没有异常标签</label>
              </div>
          </div>
           <div class="col-md-12 form-group">
            <div class="col-sm-4"><small>调拨信息</small></div>
            <div class="col-sm-8 marginTop" style="text-align:right;">
              <a v-show="!editTransferMessage&&dt_detail.status!='CANCELLED'" @click="editTransferMessage=true"><i class="iconfont">&#xe622;</i></a>
              <a v-show="editTransferMessage" @click="saveTransferMessage"><i class="iconfont confirm-icon">&#xe626;</i></a>
              <a v-show="editTransferMessage" @click="cancelTransferMessage"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
            </div>
          </div>
          <div class="col-md-12 bgFFF transf-class">
            <div class="col-sm-4">
              <div class="form-group">
                <label class="col-sm-4 control-label">调拨类型:</label>
                <div class="col-sm-8">
                  <select  v-if="editTransferMessage" class="form-control select-sm" v-model="updateTransferMessage.type">
                    <option v-for="(item,index) in transferTypeArray" :value="index">{{item}}</option>
                  </select>
                  <label v-else>{{transferTypeArray[dt_detail.type]}}</label>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">发起人:</label>
                <div class="col-sm-8">
                  <label v-if="dt_detail.createUser">{{dt_detail.createUser.name}}</label>
                  <label v-else>????</label>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">物流方式:</label>
                <div class="col-sm-8">
                  <fuzzy-search  v-if="editTransferMessage" id='chooseShipping' :placeholder="dt_detail.shipping.shippingName"  :searchfiled="'shippingName'" :config="{'apiName':'getShipingList'}" @choose="chooseShipping"> </fuzzy-search>
                  <label v-else>{{dt_detail.shipping.shippingName}}</label>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <label class="col-sm-4 control-label">出货仓:</label>
                <div class="col-sm-8">
                  <fuzzy-search  v-if="editTransferMessage" id='chooseOutWarehouse' :placeholder="dt_detail.sourceWarehouse.warehouseName" :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseOutWarehouse"> </fuzzy-search>
                  <label v-else>{{dt_detail.sourceWarehouse.warehouseName}}</label>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">库存状态:</label>
                <div class="col-sm-8">
                  <select v-if="editTransferMessage" style="margin-top:2px;" class="form-control select-sm" v-model="updateTransferMessage.statusId">
                      <option v-for="(item,index) in inventroyStatusArray" :value="index">{{item}}</option>
                    </select>
                  <label v-else>{{inventroyStatusArray[dt_detail.statusId]}}</label>
                </div>
              </div>
              <div class="form-group">
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group">
                <label class="col-sm-4 control-label">入货仓:</label>
                <div class="col-sm-8">
                  <fuzzy-search v-if="editTransferMessage && isEditable('warehouse',dt_detail.status)" id='chooseInWarehouse' :placeholder="dt_detail.destinationWarehouse.warehouseName" :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseInWarehouse"> </fuzzy-search>
                  <label v-else>{{dt_detail.destinationWarehouse.warehouseName}}</label>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label" >预期调入时间:</label>
                <div class="col-sm-8">
                   <input v-if="editTransferMessage && isEditable('timeAndNote',dt_detail.status)" class="form-control input-sm" style="margin-top:2px;" type="text" v-model="updateTransferMessage.predictInTime"/>
                  <label v-else>{{dt_detail.predictInTime}}</label>
                </div>
              </div>
              <div class="form-group">
              </div>
            </div>
          </div>
          <div class="col-md-12 form-group">
            <div class="col-sm-4"><small>备注</small>
              <button class="btn btn-xs btn-info" v-show="dt_detail.status!='CANCELLED'" @click="showMessageAddModal=true">添加备注</button>
            </div>
            <div class="col-sm-8 marginTop" style="text-align:right;">
              <a v-show="!editNote&&dt_detail.status!='CANCELLED'"@click="editNote=true"><i class="iconfont">&#xe622;</i></a><!--编辑-->
              <a v-show="editNote" @click="saveNote"><i class="iconfont confirm-icon">&#xe626;</i></a><!--保存-->
              <a v-show="editNote" @click="cancelNote"><i class="iconfont cancel-icon">&#xe7ca;</i></a><!--取消-->
            </div>
          </div>
          <div class="col-md-12 bgFFF">
            <div class="myRow row" style="margin-top:10px;margin-left: -75px;">
              <label class="control-label col-md-2">内部留言：</label>
              <div class="col-md-8" style="padding-left:0px">
                <input type="text" class="input-sm form-control" :readonly="!editNote" :class="{'not-editable': !editNote}" v-model="updateNote.internalNote">
              </div>
            </div>
            <div class="myRow row" style="margin-top:10px;margin-left: -75px;">
              <label class="control-label col-md-2">出库留言：</label>
              <div class="col-md-8" style="padding-left:0px">
                <input type="text" class="input-sm form-control" :readonly="!editNote" :class="{'not-editable': !editNote}" v-model="updateNote.sourceWarehouseNote">
              </div>
            </div>
            <div class="myRow row" style="margin-top:10px;margin-left: -75px;">
              <label class="control-label col-md-2">入库留言：</label>
              <div class="col-md-8" style="padding-left:0px">
                <input type="text" class="input-sm form-control" :readonly="!editNote || !isEditable('timeAndNote',dt_detail.status)" :class="{'not-editable': !editNote || !isEditable('timeAndNote',dt_detail.status)}" v-model="updateNote.destinationWarehouseNote">
              </div>
            </div>
          </div>  
          <div class="col-md-12">
            <small>商品信息</small>
          </div>
        </div>
        <div class="right-div" style="overflow:auto;height:468px"><!--右边日志-->
          <table class="order-action-record bgFFF">
            <thead>
              <tr>
                <th width="25%">操作人</th>
                <th width="50%">操作记录</th>
                <th width="25%">时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderActions">
                <td v-if="item.creator">{{item.creator.name}}</td>
                <td v-else></td>
                <td>{{item.displayContent}}</td>
                <td>{{item.createTime}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
      <table v-show="dt_detail.status!='CANCELLED'" width="100%" border="0" style="margin-bottom:10px"><tr>
          <td width="10%" style="text-align:right">商品名称 &nbsp;</td>
          <td><fuzzy-search ref="childAddGoods" id='chooseAddGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseAddGoods" > </fuzzy-search></td>
          <td style="padding-left:2px;text-align: right;">商品条码/商家编码&nbsp;</td>
          <td><search-sku-name ref="childSearchSku" @choose="chooseSkuName" @change="clearAddGoodsMessage"></search-sku-name> </td>
          <td style="text-align: right;">调拨数量&nbsp;</td>
          <td><input class="form-control input-sm" type="number" min="1" style="width:80px" v-model="addGoods.applyCount"></td>
          <td><button class="btn btn-primary btn-sm" @click="addGoodsToTable">添加</button></td></tr></table>
      <div class="col-md-12 bgFFF">
            <table class="table">
              <thead>
                <tr>
                  <th>商品名称</th>
                  <th>商品条码</th>
                  <th>箱规</th>
                  <th>调拨申请数量</th>
                  <th>系统库存</th><!-- orderGoods.inventoryQuantity -->
                  <th>可审核库存</th><!-- avi... -->
                  <th>整箱</th>
                  <th>指定批次</th>
                  <th>指定生成日期</th>
                  <th>实际出库数</th>
                  <th>在途数</th><!-- 实际出库-实际入库 -->
                  <th>实际入库数</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(trItem, index) in dt_detail.goodsContentList">
                  <td>{{trItem.orderGoods.sku.skuName}}</td>
                  <td>{{trItem.orderGoods.sku.barcode}}</td>
                  <td>{{trItem.orderGoods.sku.goods.boxVolume}}</td>
                  <td>
                    <input v-if="isEditArray[index]" style="width:50px" type="number" min="1" v-model="trItem.orderGoods.number"/>
                    <span v-else>{{trItem.orderGoods.number}}</span>
                  </td>
                  <td>{{trItem.orderGoods.inventoryQuantity}}</td>
                  <td>{{trItem.orderGoods.availableQuantity}}</td>
                  <td>{{getNum(trItem.orderGoods.sku.goods.boxVolume,trItem.orderGoods.number)}}</td>
                  <td>
                    <input v-if="isEditArray[index]" style="width:65px" v-model="trItem.orderGoods.batchNo"/>
                    <span v-else>{{trItem.orderGoods.batchNo}}</span>
                  </td>
                  <td>
                    <input v-if="isEditArray[index]" style="width:100px" placeholder="YYYY-MM-DD" v-model="trItem.orderGoods.productDate"/>
                    <span v-else>{{formatTime(trItem.orderGoods.productDate)}}</span>
                  </td>
                  <td>{{trItem.actuallyTransferOutCount}}</td>
                  <td>{{trItem.onWayCount}}</td>
                  <td>{{trItem.actuallyTransferInCount}}</td>
                  <td>
          <a v-show="!isEditArray[index]&&dt_detail.status!='CANCELLED'" @click="editGoodsByIndex(index)"><i class="iconfont">&#xe622;</i></a>
          <a v-show="isEditArray[index]" @click="saveGoodsByIndex(index)"><i class="iconfont confirm-icon">&#xe626;</i></a>
          <a v-show="isEditArray[index]" @click="cancelByIndex(index)"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
          <a v-show="!isEditArray[index]&&dt_detail.status!='CANCELLED'" @click="del(index)"><i class="iconfont delete-icon" >&#xe613;</i></a>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>
    </section>
    <component is="add-note-modal" v-if="showMessageAddModal" :show-overlay="showOverlay" @cancel="showMessageAddModal=false" @confirm="confirmCommentAction"></component>
    <component is="add-note-modal2" v-if="showNoteAddModal" :show-overlay="showOverlay" :can-empty="true" @cancel="showNoteAddModal=false" @confirm="confirmAddNote"></component>

    <!-- 开始弹出框 -->
        <div class="popup-wrap-zn" v-if="showSelectModel">
          <div class="popup-content row form-inline">
            <p class="popup-title">选择中止入库仓库</p>
            <div class="popup-main">
              <div class="myRow row">
                <label class="control-label col-sm-4 required">中止入库仓</label>
                <div class="col-sm-4">
                  <fuzzy-search id='chooseTerminateWarehouse' placeholder='仓库模糊搜索' :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseTerminateWarehouse"> </fuzzy-search>
                </div>
              </div>
            </div>
            <div class="popup-footer">
              <button class="btn btn-sm btn-primary" :disabled="terminateWarehouseId==''" @click="commitTerminate"><i class="fa fa-check"></i>确认</button>
              <button class="btn btn-sm btn-default" @click="showSelectModel=false"><i class="fa fa-reply"></i>取消</button>
            </div>
          </div>
        </div>
        <!-- 结束弹出框 -->
  </div>
</template>

<script>
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'
import addNoteModal from '../../../component/addNoteModal'
import addNoteModal2 from '../../../component/addNoteModal2'
import processState from '../../../component/processState'
import processState2 from '../../../component/processState2'
import fuzzySearch from '../../../component/fuzzySearch'
import deepClone from '../../../common/deepClone'
import searchSkuName from '../../../component/searchSkuName'

var _self = {};
export default {
  components: {
    processState,
    processState2,
    addNoteModal,
    addNoteModal2,
    fuzzySearch,
    searchSkuName,
  },
  data () {
    return {
      partyName:'',
      showSelectModel:false,
      terminateWarehouseId:'',
      myStateData: [],
      curState: {
        state: 'create',
        icon: '/src/img/u1287.png'
      },
      styleObj: {
        'stateItem': 90,
      },
      dt_detail:{    //dt单详情
        createUser:'',
        destinationWarehouse:{
          warehouseName:'',
        },
        sourceWarehouse:{
          warehouseName:'',
        },
        shipping:{
          shippingName:''
        }
      },  
      orderActions:[],
      copyGoodsContentList:[],      //复制dt单商品详情，用于编辑
      isEditArray:[],               //dt单商品是否是编辑状态
      editTransferMessage:false,    //显示编辑调拨信息的输入框
      editNote:false,               //显示编辑留言输入框
      showNoteAddModal:false, //审批时显示添加留言组件
      apiName:'',     //审批，取消等调用不同接口
      showMessageAddModal: false,   //显示添加备注组件
      showOverlay:true,             //显示添加备注组件
      addGoods:{
        orderGoods:{
          sku:{
            skuId:'', 
            skuName:'',     //
            barcode:'',    //商品条码
            goods:{
              boxVolume:'',  //箱规
            }
          },
        },
        batchNo:'',               //批次
        productDate:'',               //日期
        applyCount:'',           //数量
        isNew:true,     //用于在列表中表示新建
      },  
      updateNote:{//更新留言
        id:'',                        //dt单id
        internalNote:'',              //内部留言
        sourceWarehouseNote:'',       //出库留言
        destinationWarehouseNote:'',  //入库留言
      },
      updateTransferMessage:{//更新调拨信息
        id:'',               //dt单id
        type:'',            //调拨类型
        sourceWarehouseId:'',
        destinationWarehouseId:'',
        statusId:'',      //库存状态
        predictInTime:'',  //预期调入时间
        shippingId:'',
      },

      transferTypeArray: {    //调拨类型数组
        SAME_WAREHOUSE_DT: '仓内调拨',
        DIFFERENT_WAREHOUSE_DT: '异仓调拨',
        VIRTUAL_WAREHOUSE_DT: '虚拟调拨',
      }, 
      inventroyStatusArray:{  //库存状态
        INV_STTS_AVAILABLE:'全新',
        INV_STTS_USED:'二手',
        INV_STTS_DEFECTIVE:'破损',
      },
      
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
        initStyle();
    });
     _self.partyName=_self.$route.params.party_name;
    _self.getDetailById();


  },
   methods: {
    ////获得页面要显示的内容--begin
    getDetailById(){
      http({                  //根据id获取套餐详情
        instance: _self,
        url: api.getDtDetail,     //
        type: 'post',
        data: {
          data: {
            id: _self.$route.params.dt_id
          }
        },
        success (res) {
          _self.setDtDetail(res);
        }
      });
    },
    setDtDetail(res){
      _self.dt_detail=res.data;
      _self.getLog();       //获得日志信息
      _self.setStatus(_self.dt_detail);   //获得状态流程信息
      _self.copyTransferMessage();        //获得调拨信息
      _self.copyNote();                   //获得留言信息
      _self.isEditArray=[];
      if(!_self.dt_detail.shipping){
        var shipping=new Object;
        shipping.shippingName='';
        _self.dt_detail.shipping=shipping;
      }
      _self.copyGoodsContentList=deepClone(_self.dt_detail.goodsContentList);    //主要用于编辑，取消
      _self.dt_detail.goodsContentList.forEach(function (item) {
        _self.isEditArray.push(false);
      });
    },
    getLog(){   //得到日志信息
      http({
        instance: _self,
        url: api.getDtOrderActionList,
        type: 'post',
        data:{
          data:{
            dtOrderId: _self.dt_detail.dtOrder.orderId,
            dcOrderId: _self.dt_detail.dcOrder ? _self.dt_detail.dcOrder.orderId : '',
          },
        },
        hasLoading: false,
        success (res) {
          _self.orderActions = res.data;
        }
      });
    },
    setStatus(detail){      //得到订单状态信息数组
      _self.myStateData=[];
      _self.curState.state=detail.status;
      _self.myStateData.push({
        state: 'create',
        name:'创建',
        time: detail.createTime ? detail.createTime : '',
      });
      _self.myStateData.push({
        state: 'INIT',
        name:'待审核',
        time: '',
      });
      if(detail.status=='DENIED'){//审核否决
        _self.myStateData.push({
          state: 'DENIED',
          name:'审核否决',
          time: '',
        });
        return ; 
      }else if(detail.status=='CANCELLED'){
        _self.myStateData.push({
          state: 'CANCELLED',
          name:'作废',
          time: detail.cancelledTime ? detail.cancelledTime : '',
        });
        return ; 
      }else if(detail.status=='REJECT'){
        _self.myStateData.push({
          state: 'REJECT',
          name:'被驳回',
          time: detail.rejectTime ? detail.rejectTime : '',
        });
        return ; 
      } 
      _self.myStateData.push({
          state: 'PASSED',
          name:'审核通过',
          time: detail.checkTime ? detail.checkTime : '',
      });
       _self.myStateData.push({
          state: 'waitOut',
          name:'待出库',
          time: '',
      });
      _self.myStateData.push({
          state: 'DT_DONE',
          name:'出库完成',
          time:  detail.dtDoneTime ? detail.dtDoneTime : '',
      });
      _self.myStateData.push({
          state: 'DC_EXECUTING',
          name:'入库中',
          time: '',
      });
      if(detail.status=='TERMINATED'){
        _self.myStateData.push({
          state: 'TERMINATED',
          name:'终止',
          time: detail.terminateTime ? detail.terminateTime : '',
        });
        return ; 
      }
      _self.myStateData.push({
          state: 'DC_DONE',
          name:'入库完成',
          time: detail.lastDcTime ? detail.lastDcTime : '',
      });
      _self.myStateData.push({
          state: 'FINISHED',
          name:'调拨完结',
          time: detail.finishTime ? detail.finishTime : '',
      });
    },
    ////获得页面要显示的内容--end
    chooseTerminateWarehouse(res){ 
      if(res){
        _self.terminateWarehouseId=res.warehouseId;
      }else{
        _self.terminateWarehouseId='';
      }
    },
    commitTerminate(){
      http({
        instance: _self,
        url: api.terminateDt,     
        type: 'post',
        data: {  "data": {
          id:_self.$route.params.dt_id,
          terminateWarehouseId:_self.terminateWarehouseId,
        }  },     
        success (res) {
          _self.showSelectModel=false;
          if(res.success){
            layer.msg("操作成功！", {time: 2000});
          }
        }
      });  
    },
    chooseOutWarehouse(res){         //编辑调拨信息选择出库仓
        if(res){
          _self.updateTransferMessage.sourceWarehouseId=res.warehouseId;
        }else{
          _self.updateTransferMessage.sourceWarehouseId='';
        }
    },
    chooseInWarehouse(res){         //编辑调拨信息选择入库仓
        if(res){
          _self.updateTransferMessage.destinationWarehouseId=res.warehouseId;
        }else{
          _self.updateTransferMessage.destinationWarehouseId='';
        }
    },
    chooseShipping(res){      //编辑调拨信息选择了快递方式
      if(res){
        _self.updateTransferMessage.shippingId=res.shippingId;
      }else{
        _self.updateTransferMessage.shippingId='';
      }
    }, 
    
    chooseSkuName (result) {    //将用户选择的sku信息加入到addGoods中
      _self.addGoods.orderGoods.sku.goods.boxVolume=result.data.goods.boxVolume;      //得到箱规
      _self.addGoods.orderGoods.sku.barcode=result.data.barcode;               //得到商品条码
      _self.addGoods.orderGoods.sku.skuId=result.data.skuId;
      _self.addGoods.orderGoods.sku.skuName=result.data.skuName;
    },
    chooseAddGoods(res){
      if(res){
        _self.addGoods.orderGoods.sku.skuName=res.skuName;
        _self.addGoods.orderGoods.sku.skuId=res.skuId;
        _self.addGoods.orderGoods.sku.barcode=res.barcode;
        var goodsId=res.goods.id;
        http({
          instance: _self,
          url: api.getGoodsDetail_yjlu,     //得到商品信息
          type: 'post',
          data:{"data":{goodsId:goodsId,},},  //         
          success (res) {
            _self.addGoods.orderGoods.sku.goods.boxVolume=res.data.boxVolume;      //得到箱规
          }
        });   
      }else{
        _self.clearAddGoodsMessage();
      }
    },
    clearAddGoodsMessage(){
      _self.addGoods.orderGoods.sku.skuName='';
      _self.addGoods.orderGoods.sku.skuId='';
      _self.addGoods.orderGoods.sku.barcode='';
      _self.addGoods.orderGoods.sku.goods.boxVolume='';
      _self.addGoods.applyCount='';
    },
    addGoodsToTable(){
      if(_self.addGoods.orderGoods.sku.skuId==''){
        layer.msg("请先选择商品！", {time: 2000});
        return ;
      }
      _self.isEditArray.push(true);       //新添加的要处于被编辑状态
      _self.dt_detail.goodsContentList.push(deepClone(_self.addGoods));     //添加商品信息
      _self.copyGoodsContentList=deepClone(_self.dt_detail.goodsContentList);
      _self.$refs.childAddGoods.userInput='';
      _self.$refs.childSearchSku.goodsCode='';
      _self.clearAddGoodsMessage();
    },
    editGoodsByIndex(index){   //编辑商品
      _self.$set(_self.isEditArray, index, true);
    },
    saveGoodsByIndex(index){   //保存商品    //保存修改，判断是否是新加的
      if(_self.dt_detail.goodsContentList[index].hasOwnProperty("isNew")){//是刚加的
        var newGoods=new Object();
        newGoods.id=_self.dt_detail.id;
        newGoods.insertedOrderGoodsList=[];
        newGoods.insertedOrderGoodsList.push({
          skuId:_self.dt_detail.goodsContentList[index].orderGoods.sku.skuId,
          number:_self.dt_detail.goodsContentList[index].orderGoods.number,
          batchNo:_self.dt_detail.goodsContentList[index].orderGoods.batchNo,
          productDate:_self.dt_detail.goodsContentList[index].orderGoods.productDate
        });
        _self.modifyFunction(newGoods,index);
      }else{
        var updateGoods=new Object();
        updateGoods.id=_self.dt_detail.id;
        updateGoods.updatedOrderGoodsList=[];
        updateGoods.updatedOrderGoodsList.push({
          orderGoodsId:_self.dt_detail.goodsContentList[index].orderGoods.orderGoodsId,
          skuId:_self.dt_detail.goodsContentList[index].orderGoods.sku.skuId,
          number:_self.dt_detail.goodsContentList[index].orderGoods.number,
          batchNo:_self.dt_detail.goodsContentList[index].orderGoods.batchNo,
          productDate:_self.dt_detail.goodsContentList[index].orderGoods.productDate
        });
        _self.modifyFunction(updateGoods,index);
      }
    },
    updateOrder(apiName){   //审核通过，不通过，取消。。。
      _self.showNoteAddModal=true;
      _self.apiName=apiName;
    },
    clearExceptionLable(){  //清除异常
      http({
        instance: _self,
        url: api.clearExceptionLable,     //searchData
        type: 'post',
        data:{"data":{
          id:_self.dt_detail.id,},},//         
        success (res) {
          _self.setDtDetail(res);
          if(res.success){
            layer.msg("操作成功!", {time: 2000});
          }else{
            layer.msg("操作失败！", {time: 2000});
          }
        }
      });   
    },
    modifyFunction(requestData,type){   //请求参数，隐藏哪个编辑框？
      // showMessage("modifyFunction函数"+type);
      // showMessage(requestData);
      // return ;
      http({
        instance: _self,
        url: api.modifyDt,     //searchData
        type: 'post',
        data:{"data":requestData,},//         
        success (res) {
          if(res.success){
            _self.setDtDetail(res);
            if(type=='transferMessage'){
              _self.editTransferMessage=false;
            }else if(type=='note'){
              _self.editNote=false;
            }else{
              _self.$set(_self.isEditArray, type, false);
            }
          }else{
            layer.msg("操作失败！", {time: 2000});
          }
        }
      });   
    },
////留言操作--begin
    confirmAddNote(res){  //添加备注
      http({
        instance: _self,
        url: api[_self.apiName],     //searchData
        type: 'post',
        data:{"data":{
          id:_self.dt_detail.id,
          note:res.note },},//         
        success (res) {
          _self.setDtDetail(res);
          if(res.success){
            layer.msg("操作成功!", {time: 2000});
            _self.showNoteAddModal=false;
          }else{
            layer.msg("操作失败！", {time: 2000});
            _self.showNoteAddModal=false;
          }
        }
      });   
    },
    saveNote(){       //保存留言
      _self.modifyFunction(_self.updateNote,'note');
    },
    cancelNote(){
      _self.copyNote();
      _self.editNote=false;
    },
    copyNote(){
      _self.updateNote.id=_self.dt_detail.id;
      _self.updateNote.internalNote=_self.dt_detail.internalNote;
      _self.updateNote.sourceWarehouseNote=_self.dt_detail.sourceWarehouseNote;
      _self.updateNote.destinationWarehouseNote=_self.dt_detail.destinationWarehouseNote;
    },
////留言操作--end
////调拨信息操作--begin
    saveTransferMessage(){      //保存调拨信息
      _self.modifyFunction(_self.updateTransferMessage,'transferMessage');
    },
    cancelTransferMessage(){
      _self.copyTransferMessage();
      _self.editTransferMessage=false;
    },
    copyTransferMessage(){    //编辑调拨信息
      _self.updateTransferMessage.id=_self.dt_detail.id;
      _self.updateTransferMessage.type=_self.dt_detail.type;//调拨类型
      _self.updateTransferMessage.sourceWarehouseId=_self.dt_detail.sourceWarehouse.warehouseId;//出货仓id
      _self.updateTransferMessage.destinationWarehouseId=_self.dt_detail.sourceWarehouse.warehouseId;//入货仓id
      _self.updateTransferMessage.statusId=_self.dt_detail.statusId; //库存状态
      _self.updateTransferMessage.predictInTime=_self.dt_detail.predictInTime;  //预期调入时间
      _self.updateTransferMessage.shippingId= (_self.dt_detail.shipping) ? _self.dt_detail.shipping.shippingId : ''; 
    },
////调拨信息操作--end
    del(index){    //删除
      var layerIndex = layer.confirm('您确定删除吗?', {
        btn: ['是','否'],
        title: false,
        shadeClose: true,
        closeBtn: 0
      }, () => {
        if(_self.dt_detail.goodsContentList[index].hasOwnProperty("isNew")){//是刚加的
          _self.dt_detail.goodsContentList.splice(index, 1);    //如果调用接口就不用这样了
          _self.copyGoodsContentList=deepClone(_self.dt_detail.goodsContentList);
        }else{
          var delGoods=new Object();
          delGoods.id=_self.dt_detail.id;
          delGoods.deletedOrderGoodsIdList=[];
          delGoods.deletedOrderGoodsIdList.push(_self.dt_detail.goodsContentList[index].orderGoods.orderGoodsId);
          _self.modifyFunction(delGoods,index);
        }
        layer.close(layerIndex);
      });
    },
    cancelByIndex(index){   //取消
      if(_self.dt_detail.goodsContentList[index].hasOwnProperty("isNew")){    //是刚加的,调用保存
        _self.saveGoodsByIndex(index);
        return ;
      }
      _self.dt_detail.goodsContentList[index]=deepClone(_self.copyGoodsContentList[index]); 
      _self.$set(_self.isEditArray, index, false);
    },
    confirmCommentAction(res){    //添加备注
      _self.showMessageAddModal=false;
      http({
        instance: _self,
        url: api.addDtNote,
        type: 'post',
        data:{
          data:{
            orderDtId:_self.$route.params.dt_id,
            note: res.note,
            color: res.color,
          },
        },
        success (res) {
          if(res.success){
            layer.alert('日志添加成功!', {icon: 1});
          }else{
            layer.alert('日志添加失败!', {icon: 2});
          }
        }
      });
    },
    
    getNum(boxVolume,goodsNumber){    //获得整箱数目
      if(typeof(boxVolume)=='undefined'||boxVolume==0){
        return '？';
      }else{
        var boxNum=Math.floor(goodsNumber / boxVolume);
        var rest=goodsNumber-boxNum*boxVolume;
        return (rest==0) ? boxNum+"箱": boxNum+"箱又"+rest+"件";
      }
    },
    formatTime(time){     //获得页面显示时间
      return (typeof(time)==="undefined")?'':time.substr(0,10);
    },
    isEditable(arrName,dt_status){  //是否可以进行某项操作
      var arr={'timeAndNote':['INIT','PASSED','DENIED','REJECT','DT_DONE'],   //预计到货时间和调入仓留言在WMS入库前可以修改
        'warehouse':['INIT','PASSED','DENIED','REJECT']};                     //调入仓在wms出库前可以修改
      return ($.inArray(dt_status,arr[arrName])>-1) ? true : false ;
    },
  }
}
</script>
<style scoped>
  .not-editable {
      border:0 solid #d2d6de;   
      background:#fff;
  }
  .nopadding{
    padding-left: 10px;
    padding-right: 0px;
  }
  .table>tbody>tr>td {
    vertical-align: middle;    /*设置表体垂直居中*/
    text-align: center;     /*设置表体水平居中*/
  } 
  small {
    display: inline-block;
    position: relative;
    font-size: 14px;
    font-weight: bold;
    margin: 9px 0 5px 10px;
  }
  small:before {
    position: absolute;
    top: 3px;
    left: -10px;
    display: inline-block;
    content: '';
    width: 3px;
    height: 14px;  
    background: #0081c2;
  }
  .form-group {
     margin-bottom: 0px; 
    }
  .marginTop{
    margin-top: 3px;   
  }
  .transf-class{
    padding-bottom: 10px;
    padding-top: 10px;    
  }
  .transf-class .control-label{
    text-align: right;
    margin-top: 2px;
    display: inline-block;
  }
  .transf-class .col-sm-4{
    padding-right: 10px;
  }
  .transf-class .col-sm-8{
    margin-top: -1px;
  }
    .col-md-12,.col-sm-4,.col-sm-8{
      padding-left: 1px;
      padding-right: 1px;
    }
  .bgFFF {
    background: #fff;
  }
.content {
  overflow: auto;
}
.content-overflow {
  width: 100%;
  overflow: auto;
  padding: 20px auto;
}
.left-div {
  width: 70%;
  float: left;
}
.right-div {
  width: 29%;
  float: right;
  padding-left: 2px;
  padding-right: 2px;
}
.iconfont{
  cursor: pointer;
  font-size: 20px;
}
.confirm-icon {
  color: #78BF2A;
}
.cancel-icon, .delete-icon {
  color: #F86767;
}
.order-action-record{
  width: 100%;
  margin:4px auto;
  border:0px solid transparent;
}
.order-action-record thead {
  border-bottom: 2px solid #C48900;
}

.order-action-record th {
  color:#C48900;
  text-align: center;
  height: 35px;
}

.order-action-record td {
  position: relative;
  text-align: center;
  border-right: solid 1px #d2d6de;
  border-bottom: solid 1px #d2d6de;
  padding-top: 4px;
  padding-bottom: 4px;
}
.order-action-record td:last-child {
  border-right: solid 1px #fff;
}


.popup-wrap-zn {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    z-index: 999;
  }
  .popup-content {
    position: absolute;
    top: 30%;
    left: 52%;
    width: 420px;
    /*min-height: 366px;*/
    margin-left: -230px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
  }
  .myRow{
      margin-bottom: 10px;
    }
  .myRow .control-label{
    margin-top: 5px;
    text-align: right;
  }
  .popup-title {
      text-align: left;
      border-bottom: 1px solid #d2d6de;
      padding:10px;
      font-size: 16px;
      margin-bottom: 0;
  }
  .popup-main {
      padding-left: 20px;
      padding-top: 15px;
      height: 65px;
  }
  .popup-footer {
      width: 100%;
      text-align: right;
      padding: 10px;
      border-top: 1px solid #d2d6de;
  }
</style>