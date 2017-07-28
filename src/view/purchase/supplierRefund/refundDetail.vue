<template>
<div class="content-wrapper" style="margin:0;padding:0">
<!-- 
<section class="content-header">
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>采购</a></li>
        <li class="active">退货订单</li>
        <li class="active">退货列表</li>
        <li class="active">退货单详情</li>
    </ol>
</section>
 -->
<!-- Main content -->
<section class="content">
<div class="content-overflow">
    <div class="left-div">
        <!--左边调拨信息-->
        <div class="bgFFF" style="margin-bottom:30px;background: #C0C0C0;">
            <!-- <div class="col-md-6" > <strong>订单号:{{gt_detail.orderSn}}({{party.partyName}})</strong> </div> -->
            <div class="col-md-6" > <strong>订单号:{{gt_detail.orderSn}}</strong> &nbsp;({{partyName}})</div>
            <div class="col-md-6" style="text-align:right;" >
                <button class="btn btn-xs btn-primary" v-show="gt_detail.status=='WAIT_CHECK'" @click="updateOrder('checkPassGt')">审核退货单</button>
                <button class="btn btn-xs btn-primary" v-show="gt_detail.status=='GT_DONE' && gt_detail.allowReceipt" @click="showReceipt=true">退货单收款</button>
               <!--  <button class="btn btn-xs btn-primary" v-show="gt_detail.status=='GT_DONE'" @click="showReceipt=true">退货单收款</button> -->
                <button class="btn btn-xs btn-primary" v-show="gt_detail.status=='WAIT_CHECK'" @click="updateOrder('deniedGt')">否决退货单</button>
                <button class="btn btn-xs btn-primary" v-show="gt_detail.status=='CHECK_PASS'||gt_detail.status=='PUSH_FINISH'" @click="updateOrder('rejectGt')">驳回退货单</button>
                <button class="btn btn-xs btn-danger" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='CHECK_PASS'||gt_detail.status=='PUSH_FINISH'" @click="updateOrder('gtCancel')">作废退货单</button>
            </div>
        </div>
        <compenont style="padding-top:10px" v-if="myStateData.length > 0" is="process-state2" class="col-md-12" :statedata="myStateData" :curstate="curState" :style-obj="styleObj"></compenont>

        <div class="col-md-12 bgFFF" style="font-size:12px;padding-bottom:10px">
            <div class="form-group" style="padding-left:9.6%">
                <label class="control-label col-md-1" style="padding-left:0px;padding-right:0px" v-show="!gt_detail.isReserved">无法审核：</label>
                <span v-show="!gt_detail.isReserved" style="margin-left:1px" class="abnormal-tag">缺货</span>
            </div>
            <div v-if="gt_detail.exceptionLable" class="form-group"><!-- v-if="gt_detail.exceptionLable"  -->
                <button class="btn btn-xs btn-info" style="margin-top:-3px;width:8%" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'" @click="updateOrder('clearGtExceptionLable')">清除异常</button>
                <label style="margin-left:1%" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'" >
                    异常标签：<span v-for="(item,index) in gt_detail.exceptionLable" class="added-tag">{{item}}</span> 
                </label>
                <label style="margin-left:9.6%" v-if="gt_detail.status!='WAIT_CHECK' && gt_detail.status!='REJECT'" >
                    异常标签：<span v-for="(item,index) in gt_detail.exceptionLable" class="added-tag">{{item}}</span> 
                </label>
            </div>
            <div v-else class="form-group">
                <label style="margin-left:9.55%;color:green">没有异常标签</label>
            </div>
        </div>
        <div class="col-md-12 form-group formMarginTop">
            <div class="col-sm-4"><small>来源信息</small></div>
        </div>
        <div class="col-md-12 bgFFF transf">
            <div class="col-sm-4">
                <div class="form-group">
                    <label class="control-label">供应商:{{gt_detail.provider?gt_detail.provider.providerName:'？'}}</label>
                </div>
                <div class="form-group"><!-- 发起人可能为空，防止报错 -->
                    <label class="control-label">发起人:{{gt_detail.createUser?gt_detail.createUser.name:'？'}}</label>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group">
                    <label class="control-label">退货类型：{{returnTypeArray[gt_detail.returnType]}}</label>
                </div>
                <div class="form-group">
                    <label class="control-label">库存状态：{{inventroyStatusArray[gt_detail.statusId]}}</label>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group">
                    <label class="control-label">退款方式：{{refundTypeArray[gt_detail.refundType]}}</label>
                </div>
            </div>
        </div>
        <div class="col-md-12 form-group formMarginTop">
            <div class="col-sm-4"><small> 退货仓信息</small></div>
            <div class="col-sm-8 marginTop" style="text-align:right;" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'"> 
                <a v-show="!editWarehouse"@click="editWarehouse=true"><i class="iconfont">&#xe622;</i></a>
                <a v-show="editWarehouse" @click="saveWarehouse"><i class="iconfont confirm-icon">&#xe626;</i></a>
                <a v-show="editWarehouse" @click="editWarehouse=false"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
            </div>
        </div>
        <div class="col-md-12 bgFFF transf">

            <div class="col-sm-6">
                <div class="form-group">
                    <label class="col-sm-3 control-label" style="margin-top:6px;margin-right:-40px">仓库:</label>
                    <div class="col-sm-4">
                        <fuzzy-search v-if="editWarehouse" id='chooseWarehouse' :placeholder="gt_detail.warehouse.warehouseName" :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseWarehouse"> </fuzzy-search>
                        <input v-else type="text" class="input-sm form-control" :readonly="!editWarehouse" :class="{'not-editable': !editWarehouse}" v-model="gt_detail.warehouse.warehouseName">
                    </div>
                </div>
            </div>
            <div class="col-sm-6" style="margin-top:5px">
                <div class="form-group">
                   <label class="control-label">仓库类型：{{gt_detail.warehouse.warehouseTypeValue}}</label>
                </div>
            </div>
        </div>
        <div class="col-md-12 form-group formMarginTop">
            <div class="col-sm-4"><small>备注</small>
                <button class="btn btn-xs btn-info" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'" @click="showMessageAddModal=true">添加备注</button>
            </div>
            <div class="col-sm-8 marginTop" style="text-align:right;" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'"> 
                <!-- <a v-show="!editNote"@click="editNote=true"><i class="iconfont">&#xe622;</i></a>
                <a v-show="editNote" @click="saveNote"><i class="iconfont confirm-icon">&#xe626;</i></a>
                <a v-show="editNote" @click="editNote=false"><i class="iconfont cancel-icon">&#xe7ca;</i></a> -->
                <a v-show="!editNote && gt_detail.status!='CANCELL'"@click="editNote=true"><i class="iconfont">&#xe622;</i></a><!--编辑-->
                <a v-show="editNote" @click="saveNote"><i class="iconfont confirm-icon">&#xe626;</i></a><!--保存-->
                <a v-show="editNote" @click="cancelNote"><i class="iconfont cancel-icon">&#xe7ca;</i></a><!--取消-->
            </div>
        </div>
        <div class="col-md-12 bgFFF" style="padding-top:10px;padding-bottom:10px" >
            <div stype="margin-top:5px">
                <label class="col-md-2 control-label" style="margin-top: 5px;color:red;width:95px;">内部留言：</label>
                <input type="text" class="input-sm form-control" :readonly="!editNote" :class="{'not-editable': !editNote}" v-model="updateNote.intervalNote" style="width:80%;">
            </div>
            <div style="margin-top:2px">
                <label class="col-md-2 control-label" style="margin-top: 5px;color:red;width:95px;">仓库留言：</label>
                <input type="text" class="input-sm form-control" :readonly="!editNote" :class="{'not-editable': !editNote}" v-model="updateNote.warehouseNote" style="width:80%">
            </div>
        </div>
        <div class="col-md-12 formMarginTop"> <small>商品信息</small> </div>
    </div>
    <div class="right-div" style="overflow:auto;height:458px"><!--右边日志-->
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
    <div class="col-md-12 form-group bgFFF" style="padding-top:10px;padding-bottom:10px">
        <div class="col-sm-2">
            币种【{{currencyArray[gt_detail.provider.currency]}}】     
        </div>
        <div class="col-sm-10" style="text-align:right;"> 
            申请退货数量】{{gt_detail.applyNum}} &nbsp;&nbsp;【已退数量】{{gt_detail.inventoryOutNum}}
            
        </div>
    </div>
    <div class="col-md-12 bgFFF" style="padding-left:0px;padding-right:0px"> 
    <table class="table">
        <thead>
            <tr>
                <th>商品名称</th>
                <th>商品条码</th>
                <th>箱规</th>
                <th>箱数</th>
                <th>系统库存</th>
                <th>可审核库存</th>
                <th>实际出库数</th>
                <th>未到票数</th>
                <th>已到票数</th>
                <th>关联发票号</th>
                <th>申请退货数量</th>
                <th>退货单价</th>
                <th>指定批次</th>
                <th>指定生成日期</th>
                <th style="width:110px" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'">操作</th>
            </tr>
        </thead>
        <tbody v-for="(trItem, index) in gtGoodsList"> 
            <tr>
                <td vertical-align="center">{{trItem.sku.skuName}}</td>
                <td>{{trItem.sku.barcode}}</td>
                <td>{{trItem.sku.goods.boxVolume}}</td>
                <td>{{getBoxNum(trItem.sku.goods.boxVolume,trItem.number)}}</td>
                <td>{{trItem.inventoryNum}}</td>
                <td>{{trItem.checkableNum}}</td>
                <td>{{trItem.inventoryOutNum}}</td>
                <td>{{trItem.nonArrivalInvoiceNumber}}</td>
                <td>{{trItem.arrivalInvoiceNumber}}</td>
                <td>
                    <label v-for="item in trItem.orderPurchaseInvoices">item.invoiceNumber</label>
                </td>
                <td><input class="form-control input-sm" type="number" :readonly="!trItem.isEdit" :class="{'not-editable': !trItem.isEdit}" min="1" v-model="trItem.number"/></td>
                <td><input class="form-control input-sm" type="text" :readonly="!trItem.isEdit" :class="{'not-editable': !trItem.isEdit}" v-model="trItem.price"/></td>
                <td><input class="form-control input-sm" type="text" :readonly="!trItem.isEdit" :class="{'not-editable': !trItem.isEdit}" v-model="trItem.batchNo"/></td>
                <td><date-picker class="timeStyle" :id="'productDate_'+index" :disabled="!trItem.isEdit" :class="{'not-editable': !trItem.isEdit}" @choose="setTime" :init-date-time="trItem.productDate" :placeholder="'请选择生产日期'" :format="'YYYY-MM-DD'"></date-picker></td>
                <td vertical-align="center" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'"> 
    <a @click="deleteOne(index)" style="display: inline-block;"><i class="iconfont delete-icon">&#xe613;</i></a>
    <a v-show="!trItem.isEdit" @click="trItem.isEdit=true"><i class="iconfont">&#xe622;</i></a>           
    <a v-show="trItem.isEdit" @click="trItem.isEdit=false"><i class="iconfont confirm-icon">&#xe626;</i></a>  
    <!-- <a v-show="trItem.isEdit" @click="trItem.isEdit=false"><i class="iconfont cancel-icon">&#xe7ca;</i></a>      -->
                </td>
            </tr>
        </tbody>
        <tr height="50px"><td colspan="20" style="text-align:center" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'">
            <button class="btn btn-primary btn-sm" @click="updateGt">更新商品信息</button>
        </td></tr>
    </table>
    <div class="row form-horizontal searchContent" style="margin-bottom:12px" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'">
        <div class="form-group">
            <div class="col-md-3">
                <label class="col-sm-4 control-label">商品名称</label>
                <div class="col-sm-8">
                    <fuzzy-search id='chooseAddGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseAddGoods"> </fuzzy-search>
                </div>
            </div>
            <div class="col-md-3">
                <label class="col-sm-5 control-label">商品条码</label>
                <div class="col-sm-7">
                    <search-sku-name  ref="childSearchSku" @choose="chooseSkuName" @change="clearSkuMessage"></search-sku-name>
                </div>
            </div> 
            <div class="col-md-2">
                <label class="col-sm-4 control-label">退货数量</label>
                <div class="col-sm-8">
                    <input type="number" min="1" v-model="addGoods.number" class="form-control input-sm"/>
                </div>
            </div>
            <div class="col-md-2">
                <label class="col-sm-4 control-label">退货金额</label>
                <div class="col-sm-8">
                    <input type="text" v-model="addGoods.price" class="form-control input-sm"/>
                </div>
            </div>
            <div class="col-md-2">
                <button class="btn btn-primary btn-sm" @click="addSingleGoodsToTable">添加</button>
            </div>
        </div>
        <div class="form-group">
            <div class="col-md-3">
                <label class="col-sm-4 control-label">采购单号</label>
                <div class="col-sm-8">
                  <input type="text" v-model="searchData.orderSn" class="form-control input-sm"/>
                </div>
            </div>
            <div class="col-md-3">
                <label class="col-sm-5 control-label">供应商采购单号</label>
                <div class="col-sm-7">
                    <input type="text" v-model="searchData.providerOrderPurchaseSn" class="form-control input-sm"/>
                </div>
            </div>
            <div class="col-md-2">
                <button class="btn btn-sm btn-primary" :disabled="searchData.orderSn==''&&searchData.providerOrderPurchaseSn==''" @click="getTableList">引用采购单</button>
            </div>
            <div class="col-md-2">
                <button class="btn btn-primary btn-sm" @click="addToTable">添加</button>
            </div>
        </div>
    </div>
    <div class="form-horizontal tableContent" v-show="gt_detail.status=='WAIT_CHECK'||gt_detail.status=='REJECT'||gt_detail.status=='CHECK_DENY'">
        <table class="table table-condensed">
            <thead>
                <tr>
                    <th><input type="checkbox" :id="'selectAll'" @click="selectAll('selectAll','childCheckbox')"></th>
                    <th>商品名称</th>
                    <th>采购入库单价</th>
                    <th>使用票扣</th>
                    <th>采购单价</th>
                    <th>采购到货数量</th>
                    <th>退货数量</th>
                    <th>退货单价</th>
                </tr>
            </thead>
            <tbody v-for="(goods, index) in tableList">
                <tr>
                    <td> <input type="checkbox" class="childCheckbox" :value="index" v-model="indexArray"></td> 
                    <td>{{goods.sku.skuName}}</td> 
                    <td>{{getInStoragePrice(goods)}}</td>
                    <td>{{goods.reducePrice}}</td>
                    <td>{{goods.unitPrice}}</td>
                    <td>{{goods.purchaseNumber}}</td>
                    <td> <input type="number" min="1" class="form-control input-sm" v-model="goods.add_number"/></td>
                    <td> <input type="text" class="form-control input-sm" v-model="goods.add_price"/></td>
                </tr>
            </tbody>
        </table>
        

    </div>
    </section>
    <component is="add-note-modal" v-if="showMessageAddModal" :show-overlay="showOverlay" @cancel="showMessageAddModal=false" @confirm="confirmCommentAction"></component> 
    <component is="add-note-modal2" v-if="showNoteAddModal" :show-overlay="showOverlay" :can-empty="true" @cancel="showNoteAddModal=false" @confirm="confirmAddNote"></component> 

    <!-- 开始弹出框 -->
        <div class="popup-wrap-zn" v-show="showReceipt">
          <div class="popup-content row form-inline">
            <p class="popup-title">财务收款</p>
            <div class="popup-main">
                <div class="myRow row">
                    <label class="control-label col-md-2">&nbsp;&nbsp;&nbsp;订单号：</label>
                    <div class="col-md-4">
                        <label class="control-label">{{gt_detail.orderSn}}</label>
                    </div>
                   <label class="control-label col-md-2">应收金额：</label>
                    <div class="col-md-4">
                        <label class="control-label">{{gt_detail.receivableReceipt}}</label>
                    </div>
                </div>
                <div class="myRow row">
                    <label class="control-label col-md-2">待收金额：</label>
                    <div class="col-md-4">
                        <label class="control-label">{{gt_detail.toBeReceivedReceipt}}</label>
                    </div>
                   <label class="control-label col-md-2">&nbsp;&nbsp;&nbsp;已实收：</label>
                    <div class="col-md-4">
                        <label class="control-label">{{gt_detail.receivedReceipt}}</label>
                    </div>
                </div>
                <div class="myRow row">
                    <label class="control-label col-md-2 required">本次实收：</label>
                    <div class="col-md-4">
                        <input class="form-control input-sm" type="text" @input="checkValue" v-model="newReceipt.receiptFee"/>
                    </div>
                    <label class="control-label col-md-2 required">收款流水：</label>
                    <div class="col-md-4">
                        <input class="form-control input-sm" type="text" v-model="newReceipt.serialNumber"/>
                    </div>
                </div>
                <div class="myRow row">
                    <label class="control-label col-md-2 required">支付方式：</label>
                    <div class="col-md-4">
                        <select class="form-control" style="width:145px" v-model="newReceipt.paymentId">
                            <option v-for="(item,index) in paymentTypeArray" :value="index">{{item}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="popup-footer">
                <button class="btn btn-sm btn-primary" :disabled="newReceipt.receiptFee==''" @click="commitNewReceipt"><i class="fa fa-check"></i>确认</button>
                <button class="btn btn-sm btn-default" @click="showReceipt=false"><i class="fa fa-reply"></i>取消</button>
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
//import processState from '../../../component/processState'
import processState2 from '../../../component/processState2'
import fuzzySearch from '../../../component/fuzzySearch'
import deepClone from '../../../common/deepClone'
import searchSkuName from '../../../component/searchSkuName'
import dateRangePicker from '../../../component/dateRangePicker'
import datePicker from '../../../component/datePicker'

var _self = {};
export default {
  components: {
    datePicker,
  //  processState,
    processState2,
    addNoteModal,
    addNoteModal2,
    fuzzySearch,
    searchSkuName,
    dateRangePicker,
  },
  data () {
    return {
        partyName:'',
        newReceipt:{
            orderGtId:'',       //订单id
            receiptFee:'',      //应收金额
            serialNumber:'',    //流水号
            paymentId:'',       //付款方式（id）
        },
        paymentTypeArray:{  
            1:'支付宝',
            2:'微信支付',
        },
        showReceipt:false,     //是否显示收款弹出框
        gtGoodsList:[],   //用于保存显示退货商品
        editNote:false,               //显示编辑留言输入框
        updateNote:{//更新留言
            orderGtId:'',                        //订单单id
            intervalNote:'',                    //内部留言
            warehouseNote:'',                   //仓库留言
        },
        editWarehouse:false,          //显示编辑仓库输入框
        showNoteAddModal:false, //审批时显示添加留言组件
        gt_detail:{    //dt单详情
            createUser:'',
            provider:{
                providerName:'',
            },
            createUser:{
                name:'',
            },
            warehouse:{},
        },  
        showMessageAddModal: false,   //显示添加备注组件
        showOverlay:true,             //显示添加备注组件
        orderActions:[], //日志信息
        myStateData: [],
        curState: {
            state: 'create',
            icon: '/src/img/u1287.png'
        },
        styleObj: {
            'stateItem': 130,
        },
      
        apiName:'',          //审批，取消等调用不同接口
        warehouseId:'',     //保存修改的仓库id
        searchData:{        //查询采购单
            orderSn:'',
            providerOrderPurchaseSn:'',   //供应商采购单号
            offset: 0,
            length: 50,
        },
        addGoods:{
            skuName:'',
            skuId:'',
            number:'',
            price:'',
        },
        tableList:[],       //采购单查询结果
        indexArray:[],      //被选择的采购单下标数组
        newItem:{
            isEdit:false,
            number:'1',
            price:'',
            batchNo:'',
            productDate:'',
            sku:{
                skuId:'',
                skuName:'',
            }
        },
        returnTypeArray: {        //退货类型
            SUPPLIER_RETURN:'供应商退货',  
            INCORRECT_WAREHOUSE:'仓库错入库',
            TURN_INTO_OTHER_GOODS:'转为其他品',
        }, 
        refundTypeArray: {        //退款方式
            BANK:'银行',
            CASH:'现金',    
        }, 
        inventroyStatusArray:{  //库存状态
            INV_STTS_AVAILABLE:'全新',
            INV_STTS_USED:'二手',
            INV_STTS_DEFECTIVE:'破损',
        },
        currencyArray: {  //币种数组
            RMB: '人民币',
            US: '美元',
        }, 
        party: {},
    }
  },
    mounted () {
        _self = this;
        this.$nextTick(() => {
            initStyle();
        });
        _self.partyName=_self.$route.params.party_name;
        _self.getDetailById();
        // _self.getPartyDetails();
    },
    methods: {
        ////获得页面数据--begin
        getDetailById(){
            http({                  //根据id获取
                instance: _self,
                url: api.getGtDetail,     //
                type: 'post',
                data:{ "data": { "orderGtId":_self.$route.params.gt_id,  }   },
                success (res) {
                    _self.setGtDetail(res);
                }
            });
        },
        setGtDetail(res){
            _self.gt_detail=res.data;
            _self.getLog();       //获得日志信息
            _self.copyNote();
            _self.gtGoodsList=deepClone(_self.gt_detail.orderGtDetails);
            _self.gtGoodsList.forEach(function (item,index) {
                _self.$set(item, 'isEdit', false);
            });
            _self.setStatus(_self.gt_detail);
        },
        getLog(){   //得到日志信息
            http({
                instance: _self,
                url: api.getOrderActionList,
                type: 'post',
                data:{
                    data:{
                        orderId: _self.gt_detail.orderInfo.orderId,
                        type: "ORDER",
                    },
                },
                hasLoading: false,
                success (res) {
                    _self.orderActions = res.data;
                }
            });
        },
        setStatus(detail){      //得到订单状态信息数组
            _self.curState.state=detail.status;
            _self.myStateData=[];
            _self.myStateData.push({
                state: 'create',
                name:'创建',
                time: detail.createTime ? detail.createTime:'',
            });
            _self.myStateData.push({
                state: 'INIT',
                name:'待审核',
                time: '',
            });
            if(detail.status=='CHECK_DENY'){//审核否决
                _self.myStateData.push({
                    state: 'CHECK_DENY',
                    name:'审核否决',
                    time: '',
                });
                return ; 
            }else if(detail.status=='CANCELL'){
                _self.myStateData.push({
                    state: 'CANCELL',
                    name:'作废',
                    time: detail.cancelledTime ? detail.cancelledTime:'',
                });
                return ; 
            }else if(detail.status=='REJECT'){
                _self.myStateData.push({
                    state: 'REJECT',
                    name:'被驳回',
                    time: detail.rejectTime ? detail.rejectTime:'',
                });
                _self.curState.state='INIT';
                return ; 
            } 
            _self.myStateData.push({
                state: 'CHECK_PASS',
                name:'审核通过',
                time: detail.checkTime ? detail.checkTime:'',
            });
            _self.myStateData.push({
                state: 'PUSH_FINISH',
                name:'已推送',
                time: detail.pushTime ? detail.pushTime:'',
            });
            _self.myStateData.push({
                state: 'GT_DONE',
                name:'退货完成',
                time: detail.finishTime ? detail.finishTime:'',
            });
        },
         ////获得页面数据--end
        getPartyDetails() {
            http({
                instance: _self,
                url: api.getPartyDetail,
                type: 'post',
                hasLoading: true,
                success (res) {
                    _self.party = res.data;
                }
            });
        },
        exportExcel(){
          layer.msg("导出功能尚未实现！", {time: 2000});
        },
        commitNewReceipt(){
            _self.newReceipt.orderGtId=_self.gt_detail.orderGtId;
            http({                 
                instance: _self,
                url: api.addGtReceipt,     //
                type: 'post',
                data:{ "data":_self.newReceipt,   },
                success (res) {
                    if(res.success){
                        layer.msg("收款成功！", {time: 2000});
                        _self.showReceipt=false;
                        _self.getDetailById();
                    }
                }
            });
        },
        chooseWarehouse(res){         //编辑调拨信息选择出库仓
            if(res){
              _self.warehouseId=res.warehouseId;
            }else{
              _self.warehouseId='';
            }
        },
        setTime(res){
            var index=res.componentId.split('_')[1];
            _self.$set(_self.gtGoodsList[index], 'productDate', res.data);
        },
        
        updateOrder(apiName){   //审核通过，不通过，作废。。。
            http({
                instance: _self,
                url: api[apiName],     //searchData
                type: 'post',
                data:{"data":{
                    orderGtId:_self.gt_detail.orderGtId, },},//         
                success (res) {
                    _self.setGtDetail(res);
                    if(res.success){
                        layer.msg("操作成功！", {time: 2000});
                    }
                }
            });   
        },
        confirmAddNote(res){
            http({
                instance: _self,
                url: api[_self.apiName],     //searchData
                type: 'post',
                data:{"data":{
                    orderGtId:_self.gt_detail.orderGtId,
                    note:res.note },},//         
                success (res) {
                    _self.setGtDetail(res);
                    if(res.success){
                        layer.msg("操作成功！", {time: 2000});
                    }else{
                        layer.msg("操作失败！", {time: 2000});
                    }
                }
            });   
        },
        ////操作留言--begin
        saveNote(){       //保存留言
            http({
                instance: _self,
                url: api.modifyGt,
                type: 'post',
                data:{
                    data:_self.updateNote,
                },
                hasLoading: false,
                success (res) {
                    _self.setGtDetail(res);
                    if(!res.success){
                        layer.msg("操作失败！", {time: 2000});
                    }
                }
            });
            _self.editNote=false;
        },
        cancelNote(){
            _self.copyNote();
            _self.editNote=false;
        },
        copyNote(){
            _self.updateNote.orderGtId=_self.gt_detail.orderGtId;
            _self.updateNote.intervalNote=_self.gt_detail.intervalNote;
            _self.updateNote.warehouseNote=_self.gt_detail.warehouseNote;
        },
        ////操作留言--end
        saveWarehouse(){
            http({
                instance: _self,
                url: api.modifyGt,
                type: 'post',
                data:{
                    data:{
                        orderGtId: _self.gt_detail.orderGtId,
                        warehouseId: _self.warehouseId,
                    },
                },
                hasLoading: false,
                success (res) {
                    _self.setGtDetail(res);
                    _self.editWarehouse=false;
                }
            });
        },
        deleteOne(index){    //删除
            var layerIndex = layer.confirm('您确定删除吗?', {
                btn: ['是','否'],
                title: false,
                shadeClose: true,
                closeBtn: 0
            }, () => {
                _self.gtGoodsList.splice(index, 1); 
                layer.close(layerIndex);
            });
        },
        confirmCommentAction(res){    //添加备注
            _self.showMessageAddModal=false;
            http({
                instance: _self,
                url: api.addGtNote,
                type: 'post',
                data:{
                    data:{
                        orderGtId:_self.$route.params.gt_id,
                        note: res.note,
                        color: res.color,
                    },
                },
                success (res) {
                    if(res.success){
                        layer.alert('日志添加成功!', {icon: 1});
                    }else{
                        layer.alert('日志添加成功!', {icon: 2});
                    }
                }
            });
        },
        getInStoragePrice(goodsDetail){     //获得采购入库价=  [（单价*下单数）-票扣]/下单数
          var p= (goodsDetail.unitPrice*goodsDetail.purchaseNumber-goodsDetail.reducePrice)/goodsDetail.purchaseNumber;
          return p.toFixed(2);
        },
        checkValue(){   //应收金额只能是正整数，一位小数，两位小数
            var v=_self.newReceipt.receiptFee;
            v = v.replace(/[^\d.]/g,"");                //清除"数字"和"."以外的字符 
            v = v.replace(/^\./g,"");                   //验证第一个字符是数字而不是逗号 
            v = v.replace(".","$#$").replace(/\./g,"").replace("$#$","."); //只能输入一个逗号
            v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数  
            _self.newReceipt.receiptFee=v;
        },
        getBoxNum(boxVolume,goodsNumber){
            if(typeof(boxVolume)=='undefined'||boxVolume==0){
                return '？';
            }else{
                var boxNum=Math.floor(goodsNumber / boxVolume);
                var rest=goodsNumber-boxNum*boxVolume;
                return (rest==0) ? boxNum+"箱": boxNum+"箱又"+rest+"件";
            }
        },
        //采购单查询---begin======================================================================================
        chooseSkuName (result) {    //将用户选择的sku信息加入到addGoods中
            _self.addGoods.skuId=result.data.skuId;
            _self.addGoods.skuName=result.data.skuName;
        },
        clearSkuMessage(){
            _self.addGoods.skuId='';
            _self.addGoods.skuName='';
        },
        chooseAddGoods(res){
            if(res){
                _self.addGoods.skuId=res.skuId;
                _self.addGoods.skuName=res.skuName;
            }else{
                _self.addGoods.skuId='';
                _self.addGoods.skuName='';
            }
        },
        getTableList(){     //查询采购单
            _self.tableList=[];
            _self.indexArray=[];
            http({
                instance: _self,
                url: api.purchaseList,     
                type: 'post',
                data:{"data":_self.searchData,},//         
                success (res) {
                    if(res.data.totalCount>0){
                        _self.tableList=res.data.content[0].orderPurchaseDetails;
                        _self.tableList.forEach(function (item,index) {
                            _self.$set(item, 'add_number', item.purchaseNumber);
                            _self.$set(item, 'add_price', item.unitPrice);
                        });
                    }else{
                        layer.msg("<span style='color:red'>好像没有查到数据 !</span>", {icon: 5});
                    }
                }
            }); 
        },
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
        addToTable(){       //将选中的结果添加到表格中
            if(_self.indexArray.length==0){
                layer.msg("请先在下表中选择商品！", {time: 2000});
            }
            for(var i=0;i<_self.indexArray.length;i++){
                if(_self.isSkuInArray(_self.tableList[_self.indexArray[i]].sku.skuId)){
                    layer.msg("请勿重复添加："+_self.tableList[_self.indexArray[i]].sku.skuName+"！", {time: 2000});
                    return ;
                }
                _self.setNewItem(_self.tableList[_self.indexArray[i]]);
                _self.gtGoodsList.push(deepClone(_self.newItem));
            }
        },
        addSingleGoodsToTable(){
            if(_self.addGoods.skuId==''){
                layer.msg("请先在左边输入框选择商品！", {time: 2000});
                return ;
            }
            if(_self.isSkuInArray(_self.addGoods.skuId)){
                layer.msg("请勿重复添加："+_self.addGoods.skuName+"！", {time: 2000});
                return ;
            }
            _self.setNewItem(_self.addGoods);
            _self.gtGoodsList.push(deepClone(_self.newItem));
        },
        setNewItem(item){
            _self.newItem.sku.skuId=item.sku ? item.sku.skuId : item.skuId;
            _self.newItem.sku.skuName=item.sku ? item.sku.skuName : item.skuName;
            _self.newItem.number=item.add_number ? item.add_number : item.number;
            _self.newItem.price=item.add_price ? item.add_price : item.price;
        },
        isSkuInArray(addedSkuId){
            for(var i=0;i<_self.gtGoodsList.length;i++){
                if(_self.gtGoodsList[i].sku.skuId==addedSkuId){
                    return true;
                }
            }
            return false;
        },
        updateGt(){
            var oldList=new Array();
            var newList=new Array();
            for(var i=0;i<_self.gt_detail.orderGtDetails.length;i++){       //得到旧列表
                oldList.push({
                    orderGtDetailId:_self.gt_detail.orderGtDetails[i].orderGtDetailId,
                    number:_self.gt_detail.orderGtDetails[i].number,
                    price:_self.gt_detail.orderGtDetails[i].price,
                    batchNo:_self.gt_detail.orderGtDetails[i].batchNo,
                    productDate:_self.gt_detail.orderGtDetails[i].productDate,
                    skuId:_self.gt_detail.orderGtDetails[i].sku.skuId,
                });
            }
            for(var i=0;i<_self.gtGoodsList.length;i++){                    //得到新列表
                var newItem=new Object();
                if(_self.gtGoodsList[i].orderGtDetailId){
                    newItem['orderGtDetailId']=_self.gtGoodsList[i].orderGtDetailId;
                }
                newItem['number']=_self.gtGoodsList[i].number;
                newItem['price']=_self.gtGoodsList[i].price;
                newItem['batchNo']=_self.gtGoodsList[i].batchNo;
                newItem['productDate']=_self.gtGoodsList[i].productDate;
                newItem['skuId']=_self.gtGoodsList[i].sku.skuId;
                newList.push(newItem);
            }
            var arrayChanges=_self.getArrayChanges(oldList,newList,'skuId');
            if(arrayChanges.insert.length==0&&arrayChanges.update.length==0&&arrayChanges.delete.length==0){
                layer.msg("你好像并没有修改什么！！！", {time: 2000});
                return ;
            }
            http({
                instance: _self,
                url: api.modifyGt,
                type: 'post',
                data:{
                    data:{
                        orderGtId: _self.gt_detail.orderGtId,
                        addOrderGtDetails: arrayChanges.insert,
                        modifiedOrderGtDetails: arrayChanges.update,
                        deletedOrderGtDetailIds: arrayChanges.delete,
                    },
                },
                hasLoading: false,
                success (res) {
                    _self.setGtDetail(res);
                    if(res.success){
                        layer.msg("操作成功！", {time: 2000});
                    }
                }
            });
        },
        getArrayChanges(oldList,newList,key){
            var arrayChanges={
                insert:[],
                update:[],
                delete:[],
            };
            arrayChanges.insert=newList; 
            for(var i=0;i<oldList.length;i++){
                var index=_self.inArray(newList,key,oldList[i][key]);
                if(index>-1){         
                    if(!_self.isObjectValueEqual(newList[index],oldList[i])){    
                        arrayChanges.update.push(newList[index]);  
                    }
                    var indexa=_self.inArray(arrayChanges.insert,key,oldList[i][key]);  
                    arrayChanges.insert.splice(indexa, 1);        
                }else{        
                    arrayChanges.delete.push(oldList[i]['orderGtDetailId']);
                }
            }
            return arrayChanges;
        },
        isObjectValueEqual(obja, objb ) {
            var aProps = Object.getOwnPropertyNames(obja);
            var bProps = Object.getOwnPropertyNames(objb);
            if (aProps.length != bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                if (obja[propName] != objb[propName]) {
                    return false;
                }
            }
            return true;
        },
        getValueByPath(obj,path){
          var indexArray=path.split('.'); 
          var value=obj;
          for(var k in indexArray){
            value=value[indexArray[k]];
            if(typeof(value)=='undefined'){
              console.log('getValueByPath函数-路径错误：'+[indexArray[k]]+' / '+path);
              return;
            }
            if(k==indexArray.length-1){
              return value;
            }
          }
        },
        inArray(array,index,value){   
            for(let i=0;i<array.length;i++){
                if(array[i][index]==value){
                    return i;
                }
            }
            return -1;
        },
        //采购单查询---end======================================================================================
      }
    }
</script>
<style scoped>
.table>tbody>tr>td {
    vertical-align: middle;   
    text-align: center;     
}
.content-wrapper {
    font-size: 12px;
}
input.not-editable {
    border:0 solid #d2d6de;
    background:#fff;
}
  small {
    display: inline-block;
    position: relative;
    font-size: 14px;
    font-weight: bold;
    margin: 15px 0 5px 0;
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
     margin-top: 5px;
  }
  .formMarginTop{
    margin-top: -7px;   
  }
  .marginTop{
    margin-top: 7px;   
  }
  .transf{
    padding-bottom: 10px;
    padding-top: 10px;    
  }
    .col-sm-4,.col-sm-8{
      padding-left: 1px;
      padding-right: 1px;
    }
  .bgFFF {
    background: #fff;
  }
/*.content {
  overflow: auto;
}*/
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
.pointer{
    cursor: pointer;
}
input[type=checkbox] {   
  cursor: pointer;
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
    top: 12%;
    left: 44%;
    width: 700px;
    margin-left: -230px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
  }
    .myRow{
        padding-left: 2px;
        margin-bottom: 10px;
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
      height: 182px;
  }
  .popup-footer {
      width: 100%;
      text-align: right;
      padding: 10px;
      border-top: 1px solid #d2d6de;
  }
</style>