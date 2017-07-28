<template>
    <div class="content-wrapper">
        <div class="content-header">
            <ol class="breadcrumb">
                <li><a><i class="fa fa-desktop"></i>销售</a></li>
                <li class="active">OMS订单</li>
            </ol>
        </div>
        <div class="content">
            <div class="box">
                <div class="box-body" style="padding-top:20px;padding-bottom:10px;">
                    <div class="sale-orders-search-form row form-inline">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>订单号</label>
                                <input type="text" v-model.trim="formData.data.orderSns" class="form-control input-sm" placeholder="原始订单/OMS订单/快递面单号，多个用逗号分割">
                            </div>
                            <div class="form-group">
                                <label for="">店铺</label>
                                <component is="select-shop"  @selected="selectedShop"></component>
                            </div>
                            <div class="form-group">
                                <label for="">分销商</label>
                                <search-distributor id="searchDistributor" placeholder="分销商搜索" @selected="selectedDistributor"></search-distributor>
                                <input type="hidden" id="hidden-distributorId" v-model="formData.data.distributorId">
                            </div>
                            <div class="form-group">
                                <label for="">发货超时</label>
                                <select name="" id="" class="form-control input-sm" v-model="formData.data.deliveryTimedOut">
                                    <option value="">-- 全部 --</option>
                                    <option value="24">24小时到48小时</option>
                                    <option value="48">48小时到72小时</option>
                                    <option value="72">72小时以上</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="">订单类型</label>
                                <select name="" id="" class="form-control input-sm" v-model="formData.data.orderType">
                                    <option value="">-- 全部销售订单 --</option>
                                    <option value="SALE">销售</option>
                                    <option value="EXCHANGE">换货</option>
                                    <option value="SUPPLY">补寄</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">发货条件</label>
                                <select name="" id="" class="form-control input-sm" v-model="formData.data.sendConditionType">
                                    <option value="">-- 全部 --</option>
                                    <option value="PAID">先款后货</option>
                                    <option value="COD_SHIP">COD</option>
                                    <option value="SELL_ON_CREDIT">赊销</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">付款状态</label>
                                <select name="" id="" class="form-control input-sm" v-model="formData.data.payStatus">
                                    <option value="">-- 全部 --</option>
                                    <option value="UNPAID">未付款</option>
                                    <option value="PAID">已付款</option>
                                    <option value="PART_PAID">部分付款</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">用户ID</label>
                                <input type="text" class="form-control input-sm" v-model.trim="formData.data.buyer">
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="">收件人</label>
                                <input type="text" class="form-control input-sm" v-model.trim="formData.data.receiverName">
                            </div>
                            <div class="form-group">
                                <label for="">手机号</label>
                                <input type="text" class="form-control input-sm" v-model.trim="formData.data.receiverPhone">
                            </div>
                            <div class="form-group">
                                <label for="">省</label>
                                <select-region placeholder="-- 省 --" region-type="1" :init="true" parent-id="" v-model="formData.data.receiver_province" @selected="selectedProvince" required></select-region>
                            </div>
                            <div class="form-group">
                                <label for="">市</label>
                                <select-region placeholder="-- 市 --" region-type="2" :init="false" :parent-id="formData.data.receiver_province" v-model="formData.receiver_city" @selected="selectedCity" required></select-region>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <label style="position:relative;top:5px;float:left" for="">订单时间</label>
                                <div class="col-md-8 no-padding" style="width:498px;margin-left:4px;">
                                <date-range-picker id="order-time" :needhms="true" @get_date="get_order_time" :start-time="formData.data.startOrderTime" :end-time="formData.data.endOrderTime"></date-range-picker>
                                </div>
                            </div>
                            <div class="form-group">
                                <label style="position:relative;top:5px;left:0;float:left" for="">付款时间</label>
                                <div class="col-md-8 no-padding" style="width:498px;margin-left:4px;">
                                <date-range-picker id="pay-time" :needhms="true" @get_date="get_pay_time" :start-time="formData.data.startPayTime" :end-time="formData.data.endPayTime"></date-range-picker>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="">有无备注</label>
                                <select name="" id="" class="form-control input-sm" v-model="formData.data.hasMemo">
                                    <option value="">-- 全部 --</option>
                                    <option value="Y">有备注</option>
                                    <option value="N">无备注</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">备注内容</label>
                                <input type="text" class="form-control input-sm" v-model.trim="formData.data.memo">
                            </div>
                            <div class="form-group">
                                <label for="">仓库</label>
                                <search-warehouse id="searchWarehouse" placeholder="仓库搜索" @selected="selectedWarehouse"></search-warehouse>
                                <input type="hidden" id="hidden-warehouseId" v-model="formData.data.warehouseId">
                            </div>
                            <div class="form-group">
                                <label for="">仓库类型</label>
                                <select name="" id="" class="form-control input-sm" v-model="formData.data.warehouseType">
                                    <option value="">-- 全部 --</option>
                                    <option value="CAINIAO">菜鸟</option>
                                    <option value="WMS">WMS</option>
                                    <option value="OMS">OMS仓库自己出库</option>
                                    <option value="VIRTUAL">虚拟仓</option>
                                    <option value="ON_WAY">调拨用到的在途仓</option>
                                    <option value="DIFF">调拨用到的差异仓</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="">快递方式</label>
                                <search-shipping id="searchShipping" placeholder="快递方式搜索" @selected="selectedShipping"></search-shipping>
                                <input type="hidden" id="hidden-shippingId" v-model="formData.data.shippingId">
                            </div>
                            <div class="form-group">
                                <label for="">商家编码</label>
                                <input type="text" class="form-control input-sm" v-model.trim="formData.data.outerCode" placeholder="原始订单商家编码">
                            </div>
                            <div class="form-group">
                                <label for="">商品名称</label>
                                <search-sku id="searchSku" placeholder="转化后商品名称搜索" @selected="selectedSku"></search-sku>
                                <input type="hidden" id="hidden-skuid" v-model="formData.data.skuId">
                            </div>
                            <div class="form-group">
                                <label for="">商品类型</label>
                                <label class="radio-wrap"><input type="radio" value="" v-model="formData.data.isGift">全部</label>
                                <label class="radio-wrap"><input type="radio" value="0" v-model="formData.data.isGift"><span>商品</span></label>
                                <label class="radio-wrap"><input type="radio" value="1" v-model="formData.data.isGift"><span>赠品</span></label>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-sm btn-primary" @click="searchSaleOrderList">
                                    <i class="fa fa-search"></i>查询
                                </button>
                                <button class="btn btn-sm btn-default">
                                    <i class="fa fa-download"></i>导出
                                </button>
                            </div>
                        </div>

                        

                        <div class="col-md-12">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row status-list-wrap">
                <input type="hidden" v-model="formData.data.statusType">
                <ul class="status-list-top clearfix">
                    <li v-for="(status, index) in statusListTop" :class="index==0 ? 'active':''" @click="setSearchStatus(status.status,$event)">
                        <span>{{status.statusName}}</span>
                    </li>
                </ul>
                <ul class="status-list-bottom clearfix">
                    <li v-for="(status, index) in statusListBottom" @click="setSearchStatus(status.status,$event)">
                        <span>{{status.statusName}}</span>
                    </li>
                </ul>
            </div>
            
            <ul class="action-list clearfix" v-show="saleOrderList.length">
                <li>
                    <button class="primaryBtn" @click="mergeOrders">同名合并</button>
                </li>
                <li>
                    <button class="primaryBtn" @click="checkOrders">审核</button>
                </li>
                <li>
                    <button class="primaryBtn" @click="forceCheckOrders">强制审核</button>
                </li>
                <li>
                    <button class="primaryBtn" @click="rejectOrders">出库驳回</button>
                </li>
                <li>
                    <button class="primaryBtn" @click="cancelOrders">作废</button>
                </li>
                <li>
                    <button class="primaryBtn" @click="changeOrdersType('BOOK')">预转订单</button>
                </li>
                <li>
                    <button class="primaryBtn" @click="changeOrdersType('NORMAL')">转正常单</button>
                </li>
            </ul>

            <div class="box box-primary no-border-top" v-show="saleOrderList.length">
                <div class="box-body">
                    <table class="table table-bordered table-hover table-sale-orders">
                        <thead>
                            <th style="text-align:center;width:50px;"><input type="checkbox" @click="checkAll($event)"></th>
                            <th style="width:200px;">OMS订单号</th>
                            <th style="width:150px;">收件人信息</th>
                            <th style="width:200px;">店铺</th>
                            <th style="width:150px;">应收金额</th>
                            <th style="width:250px;">订单时间</th>
                            <th style="width:100px;">订单状态</th>
                            <th style="width:200px;">无法审核/异常</th>
                            <th style="width:200px;">仓库</th>
                            <th style="width:200px;">快递名称/快递单号</th>
                        </thead>
                        <tbody>
                            <tr v-for="order in saleOrderList" :class="{closed: order.orderStatus == 'CLOSED_MANUAL' || order.orderStatus == 'CLOSE_PLATFORM'}">
                                <td style="text-align:center;"><input type="checkbox" :value="order.orderId" v-model="selectedOrderList"></td>
                                <td>
                                    <a style="color:#6799ff;cursor:pointer;" :href="'#/ordersManage/omsOrderDetail/orderDetails/'+order.orderId" target="_blank">{{order.orderSn}}</a>
                                    <!-- <p style="color:#6799ff;cursor:pointer;" @click="gotoOrderDetail(order.orderId)"></p> -->
                                    <p v-if="order.platformOrderIds">{{order.platformOrderIds.join(',')}}</p>
                                </td>
                                <td>
                                    <p><i class="fa fa-user user-icon"></i>{{order.receiverName}}</p>
                                    <p><i class="fa fa-phone phone-icon"></i>{{order.receiverMobile}}</p>
                                </td>
                                <td>
                                    <p v-if="order.shop">{{order.shop.shopName}}</p>
                                    <span class="box-icon gray" v-if="order.orderTypeValue && order.orderType != 'SALE'">{{order.orderTypeValue}}</span>
                                </td>
                                <td>
                                    <p>{{order.totalFee}}</p>
                                    <span class="box-icon orange" v-if="order.sendConditionType && order.sendConditionType != 'PAID'">{{order.sendConditionType | sendConditionTypeFilter}}</span>
                                </td>
                                <td style="font-size:12px;">
                                    <p><span class="circle-icon gray">付</span>{{order.paytime}}</p>
                                    <p v-if="order.orderStatus == 'CHECK_PASS' && order.orderProcess"><span class="circle-icon green">审</span>{{order.orderProcess.checkTime}}</p>
                                    <p v-if="order.shippingTime"><span class="circle-icon green">发</span>{{order.shippingTime}}</p>
                                </td>
                                <td>
                                    <p v-if="order.orderStatus == 'WAIT_CHECK'">待审核</p>
                                    <p v-if="order.orderStatus == 'CHECK_PASS' && order.shippingStatus == 'INIT'">待推送</p>
                                    <p v-if="order.orderStatus == 'CHECK_PASS' && order.shippingStatus == 'PUSH'">已推送</p>
                                    <p v-if="order.orderStatus == 'CHECK_PASS' && order.shippingStatus == 'OPERATED'">已发货</p>
                                    <p v-if="order.orderStatus == 'CLOSED_MANUAL'">已作废</p>
                                </td>
                                <td>
                                    <ul style="width:100%;overflow:hidden;" v-if="order.orderProcess != undefined">
                                    <li class="box-icon red" v-if="order.orderProcess.shortageStatus != ''">缺货</li>
                                    <li class="box-icon red" v-if="order.orderProcess.subOrderType == 'BOOK'">预定单</li>
                                    <li class="box-icon red" v-if="order.orderProcess.financeCheckStatus == 'WAIT_CHECK'">待财审</li>
                                    </ul>
                                    <ul style="width:100%;overflow:hidden;margin-top:10px;" v-if="order.orderProcess != undefined">
                                        <li class="box-icon gray" v-for="item in order.orderProcess.exceptionTagList">{{item}}</li>
                                    </ul>
                                </td>
                                <td>
                                    <p v-if="order.warehouse">{{order.warehouse.warehouseName}}</p>
                                </td>
                                <td>
                                    <p v-if="order.shipping">{{order.shipping.shippingName}}</p>
                                    <span v-for="(item,index) in order.packages">{{item.logisticsNumber}} &nbsp; </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="box-footer clearfix">
                    <div class="col-md-2 no-padding"></div>
                    <pagination :offset="formData.data.offset" :length="formData.data.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
                </div>
            </div>
       </div>
    </div>
</template>

<script>

import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import {getDateStr} from '../../common/getDateStr'
import deepClone from '../../common/deepClone'

import searchSku from '../../component/searchSku'
import searchDistributor from '../../component/searchDistributor'
import searchWarehouse from '../../component/searchWarehouse'
import searchShipping from '../../component/searchShipping'
import dateRangePicker from '../../component/dateRangePicker'
import selectRegion from '../../component/selectRegion'
import pagination from '../../component/pagination'
import selectShop from '../../component/selectShop'

var VM = {};

export default {
    mounted () {
    	VM = this;
    	initStyle();

    	VM.formData.data.startOrderTime = getDateStr(-7,true);
        VM.formData.data.endOrderTime = getDateStr(0,true);

        VM.formData.data.startPayTime = ""; //默认是没有值的
        VM.formData.data.endPayTime = ""; //默认是没有值的

    },
    data () {
    	return {
            pageData: {
                totalCount: ''
            },
    		formData : {
                data : {
                    offset: 0,
                    length: 10,
                    orderSns : '',
                    shopId : '',
                    deliveryTimedOut : '',
                    orderType : '',
                    sendConditionType : '',
                    distributorId : '',
                    payStatus : '',
                    buyer : '',
                    receiverName : '',
                    receiverPhone : '',
                    receiver_province : '',
                    receiver_city : '',
                    outerCode : '',
                    skuId : '',
                    isGift : '',
                    startOrderTime : '',
                    endOrderTime : '',
                    startPayTime : '',
                    endPayTime : '',
                    warehouseId : '',
                    warehouseType : '',
                    shippingId : '',
                    hasMemo : '',
                    memo : '',
                    statusType : ''
                }
    		},
            saleOrderList : [],
            selectedOrderList : [],
            statusListTop : [
                {
                    statusName : '全部',
                    status : ''
                },{
                    statusName : '待审核',
                    status : 'waitCheck'
                },{
                    statusName : '待推送',
                    status : 'waitPush'
                },
                {
                    statusName : '已推送',
                    status : 'pushed'
                },
                {
                    statusName : '已发货',
                    status : 'opreated'
                },
                {
                    statusName : '已作废',
                    status : 'canceled'
                },
                {
                    statusName : '可审核',
                    status : 'canCheck'
                }
            ],
            statusListBottom : [
                {
                    statusName : '缺货',
                    status : 'shortage'
                },{
                    statusName : '待财审',
                    status : 'waitFinanceCheck'
                },{
                    statusName : '预订单',
                    status : 'book'
                },
                {
                    statusName : '申请退款',
                    status : 'applyReturn'
                },
                {
                    statusName : '同名未合并',
                    status : 'isMergePossible'
                },
                {
                    statusName : '被驳回',
                    status : 'reject'
                },
                {
                    statusName : '推送失败',
                    status : 'pushFail'
                }
            ]
    	}
    },
    components : {
        searchSku,
        searchDistributor,
        searchWarehouse,
        searchShipping,
    	dateRangePicker,
        selectRegion,
        pagination,
        selectShop
    },
    filters: {
        orderStatusFilter: function(val) {
            var orderStatusMapping = {
                'WAIT_CHECK': '待审核',
                'CHECK_PASS': '已审核',
                'REJECT': '已驳回',
                'CLOSE_PLATFORM': '已作废',
                'CLOSED_MANUAL': '已作废',
                'INVALID': '无效',
            };

            
            for(let key in orderStatusMapping ){
                if(key == val){
                    return orderStatusMapping[key];
                }
            }               
            
        },
        sendConditionTypeFilter: function(val) {
            var sendConditionTypeMapping = {
                'PAID': '',
                'COD_SHIP': 'COD',
                'SELL_ON_CREDIT': '赊销',
               
            };
            return sendConditionTypeMapping[val];
        },
        shippingStatusFilter: function(val) {
            var shippingStatusMapping = {
                'INIT': '待处理',
                'PUSH': '已推送',
                'OPERATED': '已发货',
                'RECEIVED': '用户签收',
            };
            return shippingStatusMapping[val];
        }
    },
    methods : {
        gotoOrderDetail (orderId) {
            VM.$router.push({name: 'orderDetails', params: {
                orderId: orderId
            }});
        },
        selectedShop(data) {
            if(data && data.data) {
                this.formData.data.shopId = data.data.shopId;
            } else {
                this.formData.data.shopId = "";
            }
        },
        paginate (data) {
            VM.formData.data.offset = data.offset;
            VM.formData.data.length = data.length;
            VM.searchSaleOrders();
        },
    	get_order_time (date) {
            VM.formData.data.startOrderTime = date.start_time;
            VM.formData.data.endOrderTime = date.end_time;
        },
        get_pay_time (date) {
            VM.formData.data.startPayTime = date.start_time;
            VM.formData.data.endPayTime = date.end_time;
        },
        selectedProvince (data) {
        	VM.formData.data.receiver_city = "";
        	VM.formData.data.receiver_province = data.data.regionId;
        	
        },
        selectedCity (data) {
			VM.formData.data.receiver_city = data.data.regionId;
        },
        selectedDistributor (data) {
            if (data.data && data.data.distributorId) {
                VM.$set(VM.formData.data,'distributorId', data.data.distributorId);
            } else {
                VM.$set(VM.formData.data,'distributorId', "");
            }
        },
    	selectedSku (data) {
            if (data.skuId) {
                VM.$set(VM.formData.data,'skuId', data.skuId);
            } else {
                VM.$set(VM.formData.data,'skuId', "");
            }
        },
        selectedWarehouse (data) {
            if (data.warehouseId) {
                VM.$set(VM.formData.data,'warehouseId', data.warehouseId);
            } else {
                VM.$set(VM.formData.data,'warehouseId', "");
            }
        },
        selectedShipping (data) {
            if (data.shippingId) {
                VM.$set(VM.formData.data,'shippingId', data.shippingId);
            } else {
                VM.$set(VM.formData.data,'shippingId', "");
            }
        },
        checkFuzzySearch () {
            if (VM.formData.data.distributorId == '') {
                $('#searchDistributor').val('');
            }
            if (VM.formData.data.skuId == '') {
                $('#searchSku').val('');
            }
            if (VM.formData.data.warehouseId == '') {
                $('#searchWarehouse').val('');
            }
            if (VM.formData.data.shippingId == '') {
                $('#searchShipping').val('');
            }
        },
        setSearchStatus (status,e) {
            VM.$set(VM.formData.data,'statusType',status);
            VM.searchSaleOrders();
            $(e.target).eq(0).parents('.status-list-wrap').find('li').removeClass('active');
            $(e.target).eq(0).parent().addClass('active');
        },
        searchSaleOrderList() {
            this.formData.data.offset = 0;
            this.searchSaleOrders();
        },
        searchSaleOrders () {
            VM.checkFuzzySearch();
            let data = deepClone(VM.formData);
            if (data.data.orderSns) {
                data.data.orderSns = data.data.orderSns.split(',');
            } else {
                data.data.orderSns = [];
            }
            http({
                instance: VM,
                url: api.getSaleOrderList,
                type: 'post',
                data: data,
                hasLoading: true,
                success (res) {
                    VM.saleOrderList = res.data.content;
                    VM.pageData.totalCount = res.data.totalCount;
                    VM.selectedOrderList = [];
                }
            });
        },
        checkAll (e) {
            let checkAll = $(e.target).eq(0).prop('checked');
            if (checkAll) {
                VM.selectedOrderList = [];
                for (let order in VM.saleOrderList) {
                    VM.selectedOrderList.push(VM.saleOrderList[order].orderId);
                }
            } else {
                VM.selectedOrderList = [];
            }
        },
        checkOrders () {
            http({
                instance: VM,
                url: api.checkOrders,
                type: 'post',
                hasLoading: true,
                data: {
                    data : {
                        orderIds : VM.selectedOrderList
                    }
                },
                success (res) {
                    layer.msg('操作成功', {
                        time: 1000
                    });
                    VM.searchSaleOrders();
                },
                fail(res) {
                    layer.alert(res.subMsg, {icon: 5});
                }
            });
        },
        cancelOrders () {
            http({
                instance: VM,
                url: api.cancelOrders,
                type: 'post',
                hasLoading: true,
                data: {
                    data : {
                        orderIds : VM.selectedOrderList
                    }
                },
                success (res) {
                    layer.msg('操作成功', {
                        time: 1000
                    });
                    VM.searchSaleOrders();
                },
                fail(res) {
                    layer.alert(res.subMsg, {icon: 5});
                }
            });
        },
        forceCheckOrders () {
            http({
                instance: VM,
                url: api.forceCheckOrders,
                type: 'post',
                hasLoading: true,
                data: {
                    data : {
                        orderIds : VM.selectedOrderList
                    }
                },
                success (res) {
                    layer.msg('操作成功', {
                        time: 1000
                    });
                    VM.searchSaleOrders();
                },
                fail(res) {
                    layer.alert(res.subMsg, {icon: 5});
                }
            });
        },
        rejectOrders() {
            http({
                instance: VM,
                url: api.rejectOrders,
                type: 'post',
                hasLoading: true,
                data: {
                    data : {
                        orderIds : VM.selectedOrderList
                    }
                },
                success (res) {
                    layer.msg('操作成功', {
                        time: 1000
                    });
                    VM.searchSaleOrders();
                },
                fail(res) {
                    layer.alert(res.subMsg, {icon: 5});
                }
            });
        },
        mergeOrders() {
            http({
                instance: VM,
                url: api.mergeOrders,
                type: 'post',
                hasLoading: true,
                data: {
                    data : {
                        orderIds : VM.selectedOrderList
                    }
                },
                success (res) {
                    layer.alert('操作成功', {
                        time: 1000
                    });
                    layer.alert('操作成功,合成oms订单号为<a target="_blank" style="color:#6799ff;cursor:pointer;" href="#/ordersManage/omsOrderDetail/orderDetails/' + res.data.order.orderId + '">' + res.data.order.orderSn + '</a>', {icon: 6});
                    VM.searchSaleOrders();
                },
                fail(res) {
                    layer.alert(res.subMsg, {icon: 5});
                }
            });
        },
        changeOrdersType (subOrderType) {
            http({
                instance: VM,
                url: api.changeOrdersType,
                type: 'post',
                hasLoading: true,
                data: {
                    data : {
                        subOrderType : subOrderType,
                        orderIds : VM.selectedOrderList
                    }
                },
                success (res) {
                    VM.searchSaleOrders();
                    layer.msg('操作成功', {
                        time: 1000
                    });
                },
                fail(res) {
                    layer.alert(res.subMsg, {icon: 5});
                }
            });
        }
    }
}
</script>

<style scoped>
.form-group .date-input {
    width: 300px !important;
}
.table-bordered,th,td{
    border: 1px solid #ddd !important;
    text-align: left;
}
.sale-orders-search-form .form-group {
	margin-right: 20px;
	margin-bottom: 10px;
}
.sale-orders-search-form label:not(.radio-wrap) {
	margin-right: 5px;
	width: 4.5em;
	text-align: right;
}
.radio-wrap, input[type='checkbox'] {
    cursor: pointer;
}
.sale-orders-search-form .form-control {
	width: 200px;
}
#btn-search {
	margin-left: 10.5em;
}
/*.btn {
	padding-left: 23px;
	padding-right: 23px;
}*/
.btn i.fa {
	margin-right: .5em;
}
.status-list-wrap {
    margin:10px 0;
}
.status-list-top {
    width: 100%; 
    border-bottom: 2px solid #eea236;
}
.status-list-top li {
    position: relative;
    float: left;
    color: #333;
    margin: 10px 0;
    /*width: 180px;*/
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
}
.status-list-top li.active:before {
    display: block;
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100%;
    border-bottom: 2px solid #3c8dbc;
}
.status-list-bottom {
    width: 100%; 
    border-bottom: 2px solid #d8d8d8;
}
.status-list-bottom li {
    position: relative;
    float: left;
    color: #eea236;
    margin: 10px 0;
    /*width: 180px;*/
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    border-right: 1px solid #eea236;
}
.status-list-bottom li:last-child {
    border-right: none;
}
.status-list-bottom li.active {
    color: #3c8dbc;
}
.status-list-bottom li.active:before {
    display: block;
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100%;
    border-bottom: 2px solid #3c8dbc;
}
.action-list {
    background-color: #fff;
    padding: 10px 0 0 10px;
}
.action-list li {
    float: left;
    margin-right: 10px;
    margin-bottom: 10px;
}
.user-icon, .phone-icon {
    margin-right: .5em;
    color: #666;
}
.box-icon {
    display: inline-block;
    float: left;
    font-size: 10px;
    border-radius: 3px;
    padding: 1px 5px;
    margin-right: 5px;
    margin-bottom: 5px;
}
.box-icon.gray {
    color: #666;
    border:1px solid #666;
}
.box-icon.orange {
    color: #eea236;
    border:1px solid #eea236;
}
.box-icon.red {
    color: #d9534f;
    border:1px solid #d9534f;
}
.circle-icon {
    position: relative;
    top: -2px;
    display: inline-block;
    font-size: 10px;
    border-radius: 100%;
    padding: 1px 3px;
    margin-right: 5px;
}
.circle-icon.gray {
    color: #666;
    border:1px solid #666;
}
.circle-icon.green {
    color: #4cae4c;
    border:1px solid #4cae4c;
}
.closed {
    color: #A6A6A6;
}
</style>