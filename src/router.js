import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [{
            path: '/index',
            name: 'index',
            component: require('./view/index'),
            children: [{
                    path: 'home',
                    name: 'home',
                    component: require('./view/home')
                },
                // goodsManage 
                {
                    path: 'goodsManage/configTags',
                    name: 'configTags',
                    component: require('./view/goodsManage/configTags') // 配置页（默认“标签配置”）
                }, {
                    path: 'goodsManage/configStyle',
                    name: 'configStyle',
                    component: require('./view/goodsManage/configStyle') // 配置页（默认“规格配置”）
                }, {
                    path: 'goodsManage/configCategory',
                    name: 'configCategory',
                    component: require('./view/goodsManage/configCategory') // 配置页（默认“分类配置”）
                }, {
                    path: 'goodsManage/goodsList',
                    name: 'goodsList',
                    component: require('./view/goodsManage/goodsList') // 商品列表页
                }, {
                    path: 'goodsManage/goodsDetail',
                    name: 'goodsDetail',
                    component: require('./view/goodsManage/goodsDetail') // 商品详情页
                }, {
                    path: 'goodsManage/goodsDetail/:id',
                    name: 'goodsDetail_id',
                    component: require('./view/goodsManage/goodsDetail') // 商品详情页
                }, {
                    path: 'goodsManage/goodsGroupList',
                    name: 'goodsGroupList',
                    component: require('./view/goodsManage/goodsGroupList') // 套餐列表页
                }, {
                    path: 'goodsManage/goodsGroupDetail/:tc_id',
                    name: 'goodsGroupDetail',
                    component: require('./view/goodsManage/goodsGroupDetail') // 套餐详情页
                }, {
                    path: 'goodsManage/addGoodsGroup',
                    name: 'addGoodsGroup',
                    component: require('./view/goodsManage/addGoodsGroup') // 新建套餐页
                }, 

                //ordersManage
                {
                    path: 'ordersManage/saleOrdersManage',
                    name: 'saleOrdersManage',
                    component: require('./view/ordersManage/saleOrdersManage') // 销售订单管理
                }, {
                    path: 'ordersManage/originalOrderList',
                    name: 'originalOrderList',
                    component: require('./view/ordersManage/originalOrderList') // 原始订单列表
                }, {
                    path: 'ordersManage/afterSaleManage/afterSaleList',
                    name: 'afterSaleList',
                    component: require('./view/ordersManage/afterSaleManage/afterSaleList') // 退换管理列表
                },  {
                    path: 'ordersManage/outboundStrategyManage/pushStrategy',
                    name: 'pushStrategy',
                    component: require('./view/ordersManage/outboundStrategyManage/pushStrategy') // 推送策略
                },  {
                    path: 'ordersManage/osOrdersManage/osOrdersList',
                    name: 'osOrdersList',
                    component: require('./view/ordersManage/osOrdersManage/osOrdersList') // os订单
                },
                // saleFile
                {
                    path: 'ordersManage/saleFile/distributorManage',
                    name: 'distributorManage',
                    component: require('./view/ordersManage/saleFile/distributorManage') // 分销商管理
                }, {
                    path: 'ordersManage/saleFile/shopFile',
                    name: 'shopFile',
                    component: require('./view/ordersManage/saleFile/shopFile') // 店铺建档
                },

                // purchase
                {
                    path: 'purchase/supplierManage',
                    name: 'supplierManage',
                    component: require('./view/purchase/supplierManage') // 供应商管理（全局）
                }, {
                    path: 'purchase/purchaseManage/addPurchase',
                    name: 'addPurchase',
                    component: require('./view/purchase/purchaseManage/addPurchase') // 新建采购单
                }, {
                    path: 'purchase/purchaseManage/purchaseList',
                    name: 'purchaseList',
                    component: require('./view/purchase/purchaseManage/purchaseList') // 采购单查询
                }, {
                    path: 'purchase/specialSupplyManage', 
                    name: 'specialSupplyManage',
                    component: require('./view/purchase/specialSupplyManage') // 特殊供价管理（业务组）
                }, {
                    path: 'purchase/transferManage/addTransfer',
                    name: 'addTransfer',
                    component: require('./view/purchase/transferManage/addTransfer') // 新建调拨单
                },{
                    path: 'purchase/transferManage/searchTransfer',
                    name: 'searchTransfer',
                    component: require('./view/purchase/transferManage/searchTransfer') // 调拨查询页
                },{
                    path: 'purchase/supplierRefund/addRefund',
                    name: 'addRefund',
                    component: require('./view/purchase/supplierRefund/addRefund') // 新建供应商退货
                },{
                    path: 'purchase/supplierRefund/searchRefund',
                    name: 'searchRefund',
                    component: require('./view/purchase/supplierRefund/searchRefund') // 供应商退货查询页
                }, {
                    path: 'purchase/invoiceManage/addInvoice',
                    name: 'addInvoice',
                    component: require('./view/purchase/invoiceManage/addInvoice') // 新建发票
                },{
                    path: 'purchase/invoiceManage/searchInvoice',
                    name: 'searchInvoice',
                    component: require('./view/purchase/invoiceManage/searchInvoice') // 发票查询页
                }, {
                    path: 'purchase/invoiceManage/invoiceDetail/:orderId',
                    name: 'invoiceDetail',
                    component: require('./view/purchase/invoiceManage/invoiceDetail') // 发票详情页
                },

                //库存
                 {
                    path: 'inventoryManage/goodsInventorySearch/singleGoodsSearch',
                    name: 'singleGoodsSearch',
                    component: require('./view/inventoryManage/goodsInventorySearch/singleGoodsSearch') // 单品库存查询
                },
                //adjustmentSheet
                {
                    path: 'purchase/adjustmentSheet',
                    name: 'adjustmentSheet',
                    component: require('./view/purchase/adjustmentSheet') // 调整单列表
                },

                //addAdjustmentSheet
                {
                    path: 'purchase/addAdjustmentSheet',
                    name: 'addAdjustmentSheet',
                    component: require('./view/purchase/addAdjustmentSheet') // 添加调整单
                },

                //goodsWarehouseStrategy
                {
                    path: 'saleStrategyManage/goodsWarehouseStrategy',
                    name: 'goodsWarehouseStrategy',
                    component: require('./view/saleStrategyManage/goodsWarehouseStrategy') // 商品转仓策略管理
                },

                //shopWarehouseStrategy
                {
                    path: 'saleStrategyManage/shopWarehouseStrategy',
                    name: 'shopWarehouseStrategy',
                    component: require('./view/saleStrategyManage/shopWarehouseStrategy') // 店铺转仓策略管理
                },

                //warehouseRecord
                {
                    path: 'saleStrategyManage/warehouseRecord',
                    name: 'warehouseRecord',
                    component: require('./view/saleStrategyManage/warehouseRecord') // 仓库建档
                },

                // giftStrategy
                {
                    path: 'saleStrategyManage/giftStrategyList',
                    name: 'giftStrategyList',
                    component: require('./view/saleStrategyManage/giftStrategyList')  // 赠品列表页
                }, {
                    path: 'saleStrategyManage/giftStrategyDetail',
                    name: 'giftStrategyDetail',
                    component: require('./view/saleStrategyManage/giftStrategyDetail')  // 赠品详情页
                }, {
                    path: 'saleStrategyManage/giftStrategyDetail/:id/:status',
                    name: 'giftStrategyDetail_id_status',
                    component: require('./view/saleStrategyManage/giftStrategyDetail')  // 赠品详情页
                }, {
                    path: 'saleStrategyManage/giftStrategyDetail/:id/:copy/:status',
                    name: 'giftStrategyDetail_id_copy_status',
                    component: require('./view/saleStrategyManage/giftStrategyDetail')  // 赠品详情页_复制
                },
                //财务
                {
                    path: 'finance/saleOrdersFinanceCheck',
                    name: 'saleOrdersFinanceCheck',
                    component: require('./view/finance/saleOrdersFinanceCheck')  // 销售财审
                }, {
                    path: 'finance/saleInvoice',
                    name: 'saleInvoice',
                    component: require('./view/finance/saleInvoice')  // 销售发票
                }, {
                    path: 'finance/gtFinanceCheck',
                    name: 'gtFinanceCheck',
                    component: require('./view/finance/gtFinanceCheck')  // -GT财审
                }, {
                    path: 'finance/financeReceipt',
                    name: 'financeReceipt',
                    component: require('./view/finance/financeReceipt')  // -GT财审
                },
                
                // 系统设置
                {
                    path: 'system/partyManage/partyList',
                    name: 'partyList',
                    component: require('./view/system/partyList'),  // 业务组管理
                    // children: [{
                    //     path: 'partyList',
                    //     name: 'partyList',
                    //     component: require('./view/system/partyList')  // 业务组管理 
                    // }, {
                    //     path: 'partySort',
                    //     name: 'partySort',
                    //     component: require('./view/system/partySort')  // 业务组管理 
                    // }]
                }, {
                    path: 'system/userList',
                    name: 'userList',
                    component: require('./view/system/userList'),  // 用户管理
                }, {
                    path: 'system/assign/:id',
                    name: 'assign_id',
                    component: require('./view/system/assign'),  // 权限分派 
                },{
                     path: 'system/accredit/:id',
                    name: 'accredit_id',
                    component: require('./view/system/accredit'),  // 权限授权 
                },{
                    path: 'system/roleManage',
                    name: 'roleManage',
                    component: require('./view/system/roleManage')  // 权限管理  
                },{
                    path: 'system/addNewRole',
                    name: 'addNewRole',
                    component: require('./view/system/addNewRole')  // 新建角色  
                }
            ]
        }, {
            path: '/login',
            name: 'login',
            component: require('./view/login')
        },
        {
            path: '/ordersManage/omsOrderDetail/orderDetails/:orderId',
            name: 'orderDetails',
            component: require('./view/ordersManage/omsOrderDetail/orderDetails') // OMS订单详情页
        },
        {
            path: '/ordersManage/manualOrderGeneration/ordersGeneration/:tab/:omsOrderSn',
            name: 'ordersGeneration',
            component: require('./view/ordersManage/manualOrderGeneration/ordersGeneration') // 录单页面
        }, 
        {
            path: '/ordersManage/afterSaleManage/afterSaleOrderDetail/:actionType/:orderId',
            name: 'afterSaleOrderDetail',
            component: require('./view/ordersManage/afterSaleManage/afterSaleOrderDetail') // 退换订单详情页
        },{
            path: '/purchase/purchaseManage/purchaseDetail/:id',
            name: 'purchaseDetail',
            component: require('./view/purchase/purchaseManage/purchaseDetail') // 采购详情页
        }, 
        {
            path: '/purchase/supplierRefund/refundDetail/:gt_id/:party_name',
            name: 'refundDetail',
            component: require('./view/purchase/supplierRefund/refundDetail') // 供应商退货详情页
        },
         {
            path: '/purchase/transferManage/transferDetail/:dt_id/:party_name',
            name: 'transferDetail',
            component: require('./view/purchase/transferManage/transferDetail') // 调拨详情页
        },{
            path: '/index',
            redirect: '/index/home'
        }, {
            path: '*',
            redirect: '/index/home'
        }
    ],
    // mode: 'history' 
})