<template>
<div class="content-wrapper">
    <section class="content-header clearfix">
        <ol class="breadcrumb col-md-6">
            <li><a href="#"><i class="fa fa-desktop"></i> 销售</a></li>
            <li class="active">原始订单列表</li>
        </ol>
        <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
            <a  href="#/ordersManage/manualOrderGeneration/ordersGeneration/singleOrderGeneration/0" target="_blank" style="color:#fff;height:100%;width:100%;">
                <button class="btn btn-xs btn-primary">订单录入</button>
            </a>
        </div>
    </section>   
<!-- Main content -->
    <section class="content">
        <div style="background:#fff;padding-bottom:10px;">
            <div class="row formContent">
                <div class="col-md-12 no-padding form-horizontal">
                    <div class="form-group">
                        <label class="col-md-1 control-label">订单号</label>
                        <div class="col-md-5">
                            <input type="text" placeholder="原始订单／OMS订单／快递面单号，多个用“逗号”分隔" v-model.trim="userInputOrderIds" class="form-control input-sm"/>
                        </div>
                        <label class="col-md-1 control-label">店铺</label>
                        <div class="col-md-2">
                            <component is="select-shop"  @selected="selectedShop"></component>
                        </div>
                        <label class="col-md-1 control-label">发货超时</label>
                        <div class="col-md-2">
                            <select class="form-control select-sm" v-model="searchData.deliveryTimedOut">
                                <option value="">--所有状态--</option>
                                <option value="24">24小时</option>
                                <option value="48">48小时</option>
                                <option value="72">72小时</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="myLine"/>
            <div  v-if="showMore" class="row formContent">  
                <div class="col-md-12 no-padding form-horizontal">
                    <div class="form-group">
                        <label class="col-md-1 control-label">订单来源</label>
                        <div class="col-md-2">
                            <select class="form-control select-sm" v-model="searchData.orderFrom">
                                <option value="">--所有--</option>
                                <option value="DIRECT">平台下载</option>
                                <option value="MANUAL">手工建单</option>
                            </select>
                        </div>
                        <label class="col-md-1 control-label">发货条件</label>
                        <div class="col-md-2">
                            <select class="form-control select-sm" v-model="searchData.sendConditionType">
                                <option value="">--所有--</option>
                                <option value="PAID">先款后货</option>
                                <option value="SELL_ON_CREDIT">赊销</option>
                                <option value="COD_SHIP">COD</option>
                            </select>
                        </div>
                        <label class="col-md-1 control-label">平台</label>
                        <div class="col-md-2">
                            <select class="form-control select-sm" v-model="searchData.platform">
                                <option value="">--所有平台--</option>
                                <option value="KAOLA">考拉</option>
                                <option value="KOUDAITONG">口袋通</option>
                                <option value="MIYA">蜜芽</option>
                                <option value="PINDUODUO">拼多多</option>
                                <option value="SUNING">苏宁</option>
                                <option value="TAOBAO">淘宝</option>
                                <option value="WEIXIN">微信</option>
                            </select>
                        </div>
                        <label class="col-md-1 control-label">分销商</label>
                        <div class="col-md-2"> <search-distributor @selected="selectedDistributor"></search-distributor> </div>
                    </div>
                </div>
                <div class="col-md-12 no-padding form-horizontal">
                    <div class="form-group">
                        <!-- <label class="col-md-1 control-label">平台状态</label>
                        <div class="col-md-2">
                            <select class="form-control select-sm" v-model="searchData.originOrderStatus">
                                <option value="">--所有状态--</option>
                                <option value="WAIT_BUYER_PAY">未付款</option>
                                <option value="WAIT_SELLER_SEND_GOODS">待发货</option>
                                <option value="TRADE_FINISHED">交易结束</option>
                                <option value="TRADE_CLOSED">平台关闭</option>
                                <option value="WAIT_BUYER_CONFIRM_GOODS">已发货</option>
                            </select>
                        </div> -->
                        <label class="col-md-1 control-label">平台退款状态 </label>
                        <div class="col-md-2">
                            <select class="form-control select-sm" v-model="searchData.refundStatus">
                                <option value="">--所有状态--</option>
                                <option value="NONE">无退款</option>
                                <option value="APPLIED">已申请</option>
                                <option value="PART_RETURNED">部分退款</option>
                                <option value="RETURNED">全部退款</option>
                            </select>
                        </div>
                        <label class="col-md-1 control-label">仓库</label>
                        <div class="col-md-2">
                            <search-warehouse id="searchWarehouse" placeholder="仓库搜索" @selected="chooseWarehouse"></search-warehouse>
                        </div>
                        <label class="col-md-1 control-label">仓库类型</label>
                        <div class="col-md-2">
                            <select class="form-control select-sm" v-model="searchData.warehouseType">
                                <option value="">--所有类型--</option>
                                <option value="WMS">WMS仓</option>
                                <option value="CAINIAO">菜鸟仓</option>
                                <option value="OMS">OMS仓</option>
                                <option value="VIRTUAL">虚拟仓</option>
                            </select>
                        </div>
                        <label class="col-md-1 control-label">快递方式 </label>
                        <div class="col-md-2">
                            <search-shipping id="searchShipping" placeholder="快递方式搜索" @selected="chooseShipping"></search-shipping>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 no-padding form-horizontal">
                    <div class="form-group">
                       <label class="control-label col-md-1" >订单时间</label>
                        <div class="col-md-4 ">
                          <date-range-picker style="margin-left:-7px" id="orderTime" :needhms="true" @get_date="getOrderTime" :miniwidth="true" :start-time="searchData.startOrderTime" :end-time="searchData.endOrderTime"></date-range-picker>
                        </div>

                        <label class="control-label col-md-1" style="margin-left:8.3%">付款时间</label>
                        <div class="col-md-4">
                          <date-range-picker style="margin-left:-7px" id="payTime" :needhms="true" @get_date="getPayTime" :miniwidth="true" :start-time="searchData.startPayTime" :end-time="searchData.endPayTime"></date-range-picker>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 no-padding form-horizontal">
                    <div class="form-group">
                        <label class="col-md-1 control-label">商家编码</label>
                        <div class="col-md-2">
                            <input type="text" v-model.trim="searchData.skuId" class="form-control input-sm"/>
                        </div>
                        <label class="col-md-1 control-label">宝贝名称</label>
                        <div class="col-md-2">
                            <input type="text" v-model.trim="searchData.skuName" class="form-control input-sm"/>
                        </div><label class="col-md-1 control-label">收件人</label>
                        <div class="col-md-2">
                            <input type="text" v-model.trim="searchData.receiverName" class="form-control input-sm"/>
                        </div>
                        <label class="col-md-1 control-label">手机号</label>
                        <div class="col-md-2">
                            <input type="text" v-model.trim="searchData.receiverPhone" class="form-control input-sm"/>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 no-padding form-horizontal">
                    <div class="form-group">
                        <label class="col-md-1 control-label">用户ID</label>
                        <div class="col-md-2">
                            <input type="text" v-model.trim="searchData.buyer" class="form-control input-sm"/>
                        </div>
                        <label class="col-md-1 control-label">有无备注 </label>
                        <div class="col-md-2">
                            <select class="form-control select-sm" v-model="searchData.hasMemo">
                                <option value="">无备注</option>
                                <option value="ALL_MEMO">全部备注</option>
                                <option value="BUYER_MEMO">顾客备注</option>
                                <option value="SELLER_MEMO">小二备注</option>
                            </select>
                        </div>
                        <label class="col-md-1 control-label">备注内容</label>
                        <div class="col-md-5">
                            <input type="text" placeholder="搜索关键词" v-model.trim="searchData.memo" class="form-control input-sm"/>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 no-padding form-horizontal">
                    <div class="form-group">
                        <div class="col-md-3"> </div>
                    </div>
                </div>
            </div>
            <div class="row buttons"> 
                <label v-show="showMore" style="color:#6799FF;cursor: pointer;" class="showAndHide" @click="showMore=!showMore"><i class="fa fa-chevron-up"></i>&nbsp;收起</label>
                <label v-show="!showMore" style="color:#6799FF;cursor: pointer;" class="showAndHide" @click="showMore=!showMore"><i class="fa fa-chevron-down"></i>&nbsp;展开</label>
                <button class="btn btn-sm btn-primary" @click="getTableList(true)"><i class="fa fa-search"></i>查询</button>
                <button class="btn btn-sm btn-default" @click="exportExcel"><i class="fa fa-download"></i>导出</button>
                <div class="clear"></div>
                <div class="row status-list-wrap">
                    <ul class="status-list-top clearfix">
                        <li :class="{'active':currentStatus == 'all'}" @click="searchByStatus('all','all')">全部</li>
                        <!-- <li :class="{'active':currentStatus == 'WAIT_CHECK'}" @click="searchByStatus('omsOrderStatus','WAIT_CHECK')">待审核</li>
                        <li :class="{'active':currentStatus == 'INIT'}" @click="searchByStatus('shippingStatus','INIT')">待推送</li>
                        <li :class="{'active':currentStatus == 'NOT_SEND'}" @click="searchByStatus('sysStatus','NOT_SEND')">待发货</li>
                        <li :class="{'active':currentStatus == 'SEND'}" @click="searchByStatus('sysStatus','SEND')">已发货</li>
                        <li :class="{'active':currentStatus == 'CLOSED'}" @click="searchByStatus('sysStatus','CLOSED')">已关闭</li> -->
                        <li :class="{'active':currentStatus == 'ERROR'}" @click="searchByStatus('transferStatus','ERROR')">转化失败</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="box-body table-responsive">
            <table class="table" style="text-align:center;">
            <thead>
                <tr>
                    <th>原始订单号</th>
                    <th>收件人信息</th>
                    <th>店铺</th>
                    <th>应收金额</th>
                    <th>OMS订单号</th>
                    <th>状态</th>
                    <th>订单时间</th>
                    <th>订单金额</th>
                    <th>仓库</th>
                    <th>快递</th>
                </tr>
            </thead>
            <tbody style="font-size:12px;background:#fff">
            <template v-for="(trItem, index) in tableList">
                <tr>
                    <td :rowspan="spanLength[index]" style="vertical-align: center">
                        <div>{{trItem.originOrder.platformOrderId}}</div>
                        <div class="nowrap"> 
                            <span class="fontStatusa">{{platformOrderStatus[trItem.originOrder.platformOrderStatus]}}</span> 
                            <template v-if="showGoods[index]">
                                <label style="color:#6799FF;cursor: pointer;" @click="toggle(index)"><i class="fa fa-chevron-up"></i>&nbsp;收起</label>
                            </template> 
                            <template v-else>
                                <label style="color:#6799FF;cursor: pointer;" @click="toggle(index)"><i class="fa fa-chevron-down"></i>&nbsp;宝贝</label>
                            </template> 
                        </div>
                    </td>
                    <td :rowspan="spanLength[index]" style="vertical-align: center">
                        <div class="nowrap"><!-- <i class="fa fa-user"></i> -->{{trItem.originOrder.receiverName}}</div>
                        <div class="nowrap"><!-- <i class="fa fa-phone"></i> -->{{trItem.originOrder.receiverMobile}}</div>
                    </td>
                    <td :rowspan="spanLength[index]" style="vertical-align: center">
                        <div>{{trItem.originOrder.shop.shopName}}</div>
                        <div><span class="fontStatusb" v-if="trItem.originOrder.distributor">{{trItem.originOrder.distributor.distributorName}}</span></div>
                    </td>
                    <td :rowspan="spanLength[index]" style="vertical-align: center">
                        <div>{{parseFloat(trItem.originOrder.totalFee).toFixed(2)}}</div>
                        <div><span class="fontStatusa" v-if="trItem.originOrder.refundStatus != 'NONE'">{{refundStatus[trItem.originOrder.refundStatus]}}</span></div>
                    </td>
                    <template v-if="spanLength[index]>0">
                        <td><label><a style="color:#6799ff;cursor:pointer;" :href="'#/ordersManage/omsOrderDetail/orderDetails/'+trItem.orderInfos[0].orderInfo.orderId" target="_blank">{{trItem.orderInfos[0].orderInfo.orderSn}}</a></label></td>
                        <td><label>{{orderStatus[trItem.orderInfos[0].orderInfo.orderStatus]}}</label></td>
                        <td><label>{{trItem.orderInfos[0].orderInfo.createTime}}</label></td>
                        <td><label>{{parseFloat(trItem.orderInfos[0].orderInfo.totalFee).toFixed(2)}}</label></td>
                        <td><label v-if="trItem.orderInfos[0].orderInfo.warehouse">{{trItem.orderInfos[0].orderInfo.warehouse.warehouseName}}</label></td>
                        <td><label v-if="trItem.orderInfos[0].orderInfo.shipping">{{trItem.orderInfos[0].orderInfo.shipping.shippingName}} 
                            <template v-for="(package, packageIndex) in trItem.orderInfos[0].packages"> 
                                <template v-if="packageIndex!=0">,</template>
                                {{package.logisticsNumber}} 
                            </template> 
                            </label>
                        </td>
                    </template> 
                    <template v-else>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </template> 
                </tr>
                <template v-if="spanLength[index]>1"> 
                    <template v-for="(order, orderIndex) in trItem.orderInfos"> 
                        <template v-if="orderIndex!=0">
                            <tr>
                                <td><label><a style="color:#6799ff;cursor:pointer;" :href="'#/ordersManage/omsOrderDetail/orderDetails/'+order.orderInfo.orderId" target="_blank">{{order.orderInfo.orderSn}}</a></label></td>
                                <td><label>{{orderStatus[order.orderInfo.orderStatus]}}</label></td>
                                <td><label>{{order.orderInfo.createTime}}</label></td>
                                <td><label>{{parseFloat(order.orderInfo.totalFee).toFixed(2)}}</label></td>
                                <td><label v-if="order.orderInfo.warehouse">{{order.orderInfo.warehouse.warehouseName}}</label></td>
                                <td><label v-if="order.orderInfo.shipping">{{order.orderInfo.shipping.shippingName}} 
                                    <template v-for="(package, packageIndex) in order.packages"> 
                                        <template v-if="packageIndex!=0">,</template> 
                                        {{package.logisticsNumber}} 
                                    </template> 
                                    </label>
                                </td>
                            </tr>
                        </template> 
                    </template> 
                </template> 
                <template v-if="showGoods[index]">
                    <tr>
                        <td colspan="10" style="background:#EFF8FF">
                            <table class="goodsTable" width="100%" style="text-align:center" border="0">
                                <tr class="childTable">
                                    <th width="20%">商家编码</th>
                                    <th width="10%">数量</th>
                                    <th width="15%">子订单分摊</th>
                                    <th width="55%">宝贝名称</th>
                                </tr>
                                <template v-for="(goods, goodsIndex) in trItem.originOrder.orderGoodses">
                                    <tr>
                                        <td>{{goods.outerCode}}</td>
                                        <td>{{goods.num}}</td>
                                        <td> 
                                            {{parseFloat(goods.totalFee).toFixed(2)}} 
                                            <span class="fontStatusb" v-if="goods.refundStatus != 'NONE'">{{goods.refundStatus | goodRefundStatusFilter}}</span> 
                                        </td>
                                        <td>{{goods.title}}</td>
                                    </tr>
                                </template>
                            </table>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
        </table>
        </div>
        <div class="box-footer clearfix">
            <div class="col-md-2 no-padding"></div>
            <pagination :offset="searchData.offset" :length="searchData.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
        </div>
    </section>
</div>
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import datePicker from '../../component/datePicker'
import dateRangePicker from '../../component/dateRangePicker'
import fuzzySearch from '../../component/fuzzySearch'
import selectShop from '../../component/selectShop'
import pagination from '../../component/pagination'
import searchDistributor from '../../component/searchDistributor'
import {getDateStr} from '../../common/getDateStr'
import searchShipping from '../../component/searchShipping'
import searchWarehouse from '../../component/searchWarehouse'

var _self = {};
export default {
    components: {
        datePicker,
        fuzzySearch,
        selectShop,
        pagination,
        searchDistributor,
        dateRangePicker,
        searchShipping,
        searchWarehouse,
    },
    mounted () {
        _self = this;
        initStyle();
        _self.searchData.startOrderTime=getDateStr(-7,true);
        _self.searchData.endOrderTime=getDateStr(0,true);
    },
    data () {
        return {
            userInputOrderIds:'',
            searchData:{//searchData
                orderIds:[],        //    订单号列表
                originOrderStatus:'',        //   原始单状态-平台状态
                deliveryTimedOut:'',        //    发货超时
                originOrderType:'SALE',        // 原始单类型-
                orderFrom: '',                  //订单来源
                sendConditionType:'',        //   发货条件
                shopId:'',        //  店铺ID
                platform:'',        //    平台
                distributorId:'',        //   分销商ID
                refundStatus:'',        //    平台退款状态
                omsOrderStatus:'',        //   OMS订单状态
                shippingStatus:'',      //待推送
                sysStatus:'',            //待发货，已发货，已关闭
                transferStatus:'',    //转化失败
                skuId:'',        //   商品skuId
                skuName:'',        // 宝贝（sku）名称
                startOrderTime:'',        //   订单创建时间（开始）
                endOrderTime:'',        // 订单创建时间（结束）
                startPayTime:'',        //    订单付款时间（开始）
                endPayTime:'',        //  订单付款时间（结束）
                warehouseId:'',        // 仓库ID
                warehouseType:'',        //   仓库类型
                shippingId:'',        //  快递方式ID
                buyer:'',        //  用户ID
                receiverName:'',        // 收件人
                receiverPhone:'',        //    手机号
                hasMemo:'',        // 有无备注
                memo:'',        //    备注
                partyId:'',        // 业务组ID

                offset: 0,
                length: 10,
            },
            pageData: { 
                totalCount: ''
            },
            statusList: [{
                'status': '',
                'statusName': '全部',
            }, {
                'status': '',
                'statusName': '转化失败'
            }],
            showMore:false,     //显示更多查询条件
            tableList:[],
            currentStatus:'all',    //用于表示当前处于哪个tab页
            spanLength:[],  //需要合并几个tr
            showGoods:[],   //是否显示原始订单的商品信息
            orderStatus: {          //oms订单状态
                WAIT_CHECK: '待审核',
                CHECK_PASS: '审核通过',
                REJECT: '被驳回',
                CLOSE_PLATFORM: '平台关闭',
                CLOSED_MANUAL: '人工关闭',
                INVALID: '无效',
            },  
            refundStatus:{          //退款状态
                NONE: '无退款',
                APPLIED: '已申请',
                RETURNED: '全部退款',
                PART_RETURNED: '部分退款'
            },
            platformOrderStatus:{          //退款状态
                WAIT_BUYER_PAY: '未付款',
                WAIT_SELLER_SEND_GOODS: '待发货',
                TRADE_FINISHED: '交易结束',
                TRADE_CLOSED: '平台关闭',
                WAIT_BUYER_CONFIRM_GOODS: '已发货'
            },
            platformType:{          //平台类型
                DIRECT: '直销',
                DISTRIBUTE: '分销平台',
                MANUAL: '手工创建',
                RELATED: '关联创建'
            }
        }
               
    },
    filters: {
        goodRefundStatusFilter(data) {
            var goodRefundStatusMapping={
                'APPLIED': '退款申请',
                'PART_RETURNED': '已退款',
                'RETURNED': '已退款'
            };
            return goodRefundStatusMapping[data];
        }
    },
    methods: {
        selectedShop(data) {
            if(data && data.data) {
                this.searchData.shopId = data.data.shopId;
            } else {
                this.searchData.shopId = "";
            }
        },
        selectedDistributor (res) {         //选择分销商
            if(res && res.data) {
                this.searchData.distributorId = res.data.distributorId;
            } else {
                this.searchData.distributorId = null;
            }
        },
        chooseWarehouse(res){         //选择仓库
            if(res){
                this.searchData.warehouseId=res.warehouseId;
            }else{
                this.searchData.warehouseId='';
            }
        },
        chooseShipping(res){   //选择了快递方式
            if(res){
                this.searchData.shippingId=res.shippingId;
            }else{
                this.searchData.shippingId='';
            }
        },  
        getOrderTime(date){
             _self.searchData.startOrderTime = date.start_time;
            _self.searchData.endOrderTime = date.end_time;
        },
        getPayTime(date){
            _self.searchData.startPayTime = date.start_time;
            _self.searchData.endPayTime = date.end_time;
        },
        toggle(index){      //是否显示商品详情
            const currentStatus = this.showGoods[index];
            this.$set(this.showGoods, index, !currentStatus);
        },
        paginate (data) {
            this.searchData.offset = data.offset;
            this.searchData.length = data.length;
            this.getTableList();
        },
        searchByStatus(name,value){
            _self.currentStatus=value;
            _self.searchData.omsOrderStatus='';
            _self.searchData.shippingStatus='';
            _self.searchData.sysStatus='';
            _self.searchData.transferStatus='';
            if(name!='all'){
                _self.$set(_self.searchData,name,value);
            }
            _self.getTableList();
        },
        getTableList(type){           //查询订单,type用于区分是点击查询按钮true还是在点击其他按钮false时被调用
            var t=_self.getDateDiff(_self.searchData.startPayTime,_self.searchData.endPayTime);
            if(t>31){
                layer.msg("付款时间间隔不能超过一个月！", {time: 2000});
                return;
            }
            if(type){       //点击了查询按钮
                _self.currentStatus='all';
                _self.searchData.offset=0;
                _self.searchData.omsOrderStatus='';
                _self.searchData.shippingStatus='';
                _self.searchData.sysStatus='';
                _self.searchData.transferStatus='';
            }
            if(_self.userInputOrderIds!=''){
                _self.searchData.orderIds=_self.userInputOrderIds.split(",");
            }else{
                _self.searchData.orderIds=[];
            }
            http({
                instance: _self,
                url: api.getOriginOrderList,
                type: 'post',
                data:{"data":_self.searchData,},//testData  searchData
                hasLoading : true,
                success (res) {
                    _self.tableList=res.data.content;
                    _self.pageData.totalCount=res.data.totalCount;
                    _self.spanLength=[];
                    _self.showGoods=[];
                    if(res.data.totalCount>0){
                        for(let i=0;i<res.data.content.length;i++){
                            _self.spanLength.push(getValueByObjPath(res.data.content[i],'orderInfos.length',0));
                            _self.showGoods.push(false);
                        }
                    }
                }
            });   
        },
        gotoOrdersGeneration(){
            this.$router.push({name: 'ordersGeneration',params: {'tab': 'singleOrderGeneration', 'omsOrderSn': '0'}});
        },
        exportExcel(){      //导出excel
            layer.msg("导出功能尚未实现！", {time: 2000});
        },
        getDateDiff(startDate,endDate)  {  
            var startOrderTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
            var endOrderTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
            var dates = Math.abs((startOrderTime - endOrderTime))/(1000*60*60*24);     
            return  dates;    
        },
    }
}
function getValueByObjPath(obj,path,msg){    //根据对象属性路径得到属性名，mes：自定义出错返回结果
    if(path==''){
        return obj;
    }
    var pathArray=new Array();
    if(path instanceof Array){      //如果是数组
        pathArray=path;
    }else{                          //如果不是
        pathArray = path.split(".");
    }
    if(obj.hasOwnProperty(pathArray[0])){  
        var temp=obj[pathArray[0]];
        pathArray.shift();
        if(pathArray.length>0){
            return getValueByObjPath(temp,pathArray,msg);
        }else{
            return temp;
        }
    }else{
        return msg;
    }
}
</script>

<style scoped>
td{padding:4px }
.childTable>th{
    text-align: center;
}
.form-group {
    margin-bottom: 11px;
}
.table>tbody>tr>td, .table>tbody>tr>th, .table>thead>tr>td, .table>thead>tr>th {
    vertical-align: middle;
     border: 1px solid #CCCCCC;  
}
.fontStatusa {
    font-size:12px;
    background: #FFFFCC;
    color:#E09D00;
    border: 1px solid #E09D00;
    border-radius: 2px;
    padding-right: 1px;
    padding-left: 1px;
}
.fontStatusb {
    font-size:12px;
    color:#999999;
    border: 1px solid #999999;
    border-radius: 2px;
    padding-right: 1px;
    padding-left: 1px;
} 
.showAndHide{
    margin-left: 3%; 
}
.breadcrumb{
    margin: 0 0 0 0;
}
.formContent{
    padding: 6px 45px 0 25px;
    /*background:#fff;*/
    .form-group{
        margin-bottom: 5px;
    }
}
.buttons{
    padding: 6px 18px 0px 13px;
}
.tableContent{
    background:#fff;
    .form-group{
        margin-bottom: 5px;
    }
}
.status-list-wrap {
    margin-top: 15px;
    margin-left: 3px;
    margin-right: -3px;
    border-top: 10px solid #F0F3F4;     
}
.myLine{
    height:1px;
    border:none;
    border-top:1px dashed #999999; 
    margin: 0 0 10px 0;
}
.col-md-1,.col-md-2,.col-md-5{ 
    padding-right: 0px; 
    padding-left: 8px;
}

.status-list-top li {
    position: relative;
    float: left;
    color: #333;
    margin: 10px 0;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    border-right: 1px solid #333;
}
.status-list-top li:last-child {
    border-right: none;
}
.status-list-top li.active {
    color: #3c8dbc;
    font-weight:900;
}
</style>