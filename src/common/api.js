import {host} from '../../config/host'

export default {
    host: host,
    menuList: host + 'resource/menu/list', //列举出自己有权限的目录
    login: host + 'user/login', //  登录认证 
    logout: host + 'user/logout', // 退出
    getSession : host + 'user/getSession',
    
    partyBarList: host + 'party/bar/list',
    regionList: host + 'region/list',  // 省、市、区查询
    getPartyDetail: host + 'party/detail', //获取业务组详细信息
    switchParty : host + 'user/party/switch', //切换业务组

    getCategoryList: host + 'custom/category/children', // 子分类列表查询
    modCategoryName: host + 'custom/category/name/modify', // 分类名称修改
    addCategory: host + 'custom/category/add', // 分类添加
    delCategory: host + 'custom/category/delete', // 分类删除

    getGoodsList:　host + 'goods/list', // 商品列表查询(分页)
    getGoodsNameList: host + 'goods/name/list', // 商品名称模糊查询
    getGoodsTagNameList: host + 'goods/tag/name/list', // 商品标签模糊查询
    getGoodsTagTree : host + 'goods/tag/tree',
    getGoodsBrandList: host + 'goods/brand/list', // 品牌查询
    getGroupGoodsNameList: host + 'goods/group/name/list', //套餐商品查询

    // 商品（商品详情）
    getGoodsDetail: host + 'goods/detail',  // 商品详情页   
    getCustomCategoryList: host + 'custom/category/name/list', // 商品分类
    getGoodsCategoryList: host + 'goods/category/name/list', // 类目查询
    getGoodsDetailSpecList: host + 'goods/style/list',  // 规格全量查询
    goodsDetailEnable: host + 'goods/sku/enable',  // sku启动
    goodsDetailDisable: host + 'goods/sku/disable',  // sku停用
    goodsDisable: host + 'goods/disable',  // 商品停用
    goodsEnable: host + 'goods/enable',  // 商品启用
    goodsModify: host + 'goods/modify',  // 商品修改
    goodsAdd: host + 'goods/add',  // 商品新增

    // 订单（销售档案）
    addDistributor: host + 'distributor/add',  // 分销商添加
    getDistributorData: host + 'distributor/list',  // 分销商查询
    distributorModify: host + 'distributor/modify',  // 分销商修改
    distributorDisable: host + 'distributor/disable',  // 分销商暂停
    distributorEnable: host + 'distributor/enable',  // 分销商启动

    //原始订单列表页使用接口
    getShipingList: host + 'shipping/name/list',//快递方式模糊查询
    getOriginOrderList: host +'order/origin/list',//查询原始订单列表
    getWarehouseNameList: host +'warehouse/name/list',//仓库名称模糊查询
    
    //套餐
    getGoodsGroupList: host + 'goods/group/query',   //查询套餐列表
    exportTC: host + 'goods/group/export',        //导出套餐
    addTC: host + 'goods/group/add',                   //增加套餐
    disableTC: host + 'goods/group/disable',                 //停用套餐
    enableTC: host + 'goods/group/enable',                   //启用套餐
    getTCDetail: host + 'goods/group/detail',                  //获得套餐详情
    modifyTC:host+'goods/group/modify',                      //修改套餐
    getSkuList:host+'goods/sku/code/list',         //查询sku列表

    //标签
    getGoodsTagList: host + 'goods/tag/list',                 //获得标签，值列表
    addTag: host + 'goods/tag/add',                                //增加标签
    modifyTag: host + 'goods/tag/modify',                          //修改标签
    deleteTag: host + 'goods/tag/delete',                          //删除标签
    addTagValue: host + 'goods/tag/value/add',                     //增加标签值
    deleteGoodsTagValue: host + 'goods/tag/value/delete',          //删除标签值-有误

    //规格
    getStyleList: host + 'goods/style/list',                  //获得规格，值列表
    addStyle: host + 'goods/style/add',                              //增加规格
    modifyStyle: host + 'goods/style/name/modify',                          //修改标签--有误（应该是修改，但结果是删除）
    deleteStyle: host + 'goods/style/delete',                        //删除规格
    addStyleValue: host + 'goods/style/value/add',                  //增加规格值
    deleteStyleValue: host + 'goods/style/value/delete',            //删除规格值
   
    //店铺建档
    getShopTableList:　host + 'shop/search',     // 店铺列表查询
    addShop:　host + 'shop/add',                //新建店铺
    modifyShop:　host + 'shop/modify',          //修改店铺

    //特殊供价管理
    addSpecialPriceProvider:　host + 'provider/special/price/add',           //增加
    modifySpecialPriceProvider:　host + 'provider/special/price/modify',    //修改
    getProviderSpecialPriceList:　host + 'provider/special/price/list',     //查询
    checkList:　host + 'provider/special/price/check',                       //批量审核
    getSpecialPriceManageLog:　host + 'provider/special/price/action/list',           //获得日志
    disableSpecialPrice:　host + '/provider/special/price/disable',     //停用
    enableSpecialPrice:　host + '/provider/special/price/enable',     //启用

    //供应商建档
    getProviderTableList:　host + 'provider/list',     // 供应商列表查询
    addProvider:　host + 'provider/add',                //新建供应商
    modifyProvider:　host + 'provider/modify',          //修改供应商

    //调拨单
    createDt: host + 'order/dt/dtcreate',     //新建调拨单
    getDtList: host + 'order/dt/list',     //调拨单查询
    getDtDetail: host +'order/dt/detail',          //调拨单详情
    modifyDt: host +'order/dt/modify',              //调拨单修改
    terminateDt: host +'order/dt/terminate',
    rejectDt: host +'order/dt/reject',
    finishDt: host +'order/dt/finish',          //完结
    checkDeniedDt: host +'order/dt/check/deny',
    checkPassDt: host +'order/dt/check/pass',
    cancelDt: host +'order/dt/cancel',
    clearExceptionLable: host +'order/dt/clear/exceptionlable',
    batchRejectDt: host +'order/dt/batch/reject',    //批量驳回
    batchCheckDt: host +'order/dt/batch/check',      //批量审核
    getDtOrderActionList: host +'order/dt/action/list',    //获得td单日志信息
    addDtNote: host +'order/dt/add/note',      //添加备注
    virtualInventoryOut: host +'order/dt/virtual/inventory/out',      //虚拟出库
    virtualInventoryIn: host +'order/dt/virtual/inventory/in',      //虚拟入库

    //供应商退货
    createGt: host + 'order/gt/add',     //新建供应商退货单
    getGtList: host + 'order/gt/list',     //供应商退货单查询
    getGtDetail: host +'order/gt/detail',          //供应商退货单详情
    modifyGt: host +'/order/gt/modify',              //供应商退货单修改
    rejectGt: host +'/order/gt/reject',             //GT单驳回接口
    batchRejectGt: host +'order/gt/batch/reject',    //批量驳回
    batchCheckGt: host +'order/gt/batch/check',      //批量审核
    gtCancel: host +'order/gt/cancel',           //GT单取消接口
    checkPassGt: host +'order/gt/check/pass',           //GT单取消接口
    deniedGt: host+'order/gt/check/deny',         //GT单审核否决接口
    clearGtExceptionLable: host+'/order/gt/clear/exceptionlable',   //GT单清除异常标签接口
    addGtNote: host +'order/gt/add/note',      //添加备注
    addGtReceipt: host +'order/gt/add/receipt',        //退货单收款

    //发票清单
    invoiceAdd: host + 'order/purchase/invoice/add',       //发票添加
    invoiceBatchCheckDeny: host + 'order/purchase/invoice/batch/check/deny',    //批量否决
    invoiceBatchCheckPass: host + 'order/purchase/invoice/batch/check/pass',    //批量审核
    invoiceCancel: host + 'order/purchase/invoice/cancel',      //取消
    invoiceCheckDeny: host + 'order/purchase/invoice/check/deny',   //否决
    invoiceCheckPass: host + 'order/purchase/invoice/check/pass',   //审核
    invoiceGet: host + 'order/purchase/invoice/get',        //获取详情
    invoiceList: host + 'order/purchase/invoice/list',      //列表查询
    invoiceModify: host + 'order/purchase/invoice/modify',      //信息修改
    invoiceRetractCheckDeny: host + 'order/purchase/invoice/retract/check/deny',    //退票否决
    invoiceRetractCheckPass: host + 'order/purchase/invoice/retract/check/pass',    //退票审核
    invoiceRetract: host + 'order/purchase/invoice/retract',        //退票申请
    invoiceSubmit: host + 'order/purchase/invoice/submit',          //发票提交
    getCGAndGTOorderList: host + '/order/purchase/invoice/source/list',     //发票页面查询采购单和退货单

    //库存
    singleGoodsInventorySearch: host + 'inventory/sku/list',        //单品库存查询

    //系统-权限管理
    resourceList:host+'resource/list',  //权限列表
    roleList:host+'role/list',          //获得角色列表
    roleAdd:host+'role/add',            //新建角色
    roleDelete:host+'role/delete',      //删除角色
    roleDetail:host+'role/get',         //获得角色详情
    rolesmodify:host+'role/modify',     //修改角色

    //录单
    getOriginOrder: host + 'order/origin/by/order/sn/get', //加载订单信息
    getShopList:　host + 'shop/list', // 店铺下拉列表
    getDistributorList: host + 'distributor/list', //分销商模糊搜索
    getPaymentList: host + 'payment/list', // 支付方式下拉列表
    getWarehouseList: host + 'warehouse/listByShop', // 仓库下拉列表
    getShipmentList: host + 'shipping/listByWarehouse', //指定仓库下的快递列表
    getRegionList: host + 'region/list', //省市区下拉框
    getGoodsNameListForOrder: host + 'goods/name/list/for/origin/order', //商品名称模糊搜索 获取商品规格
    getGoodsSkuCodeListForOrder: host + 'goods/sku/by/sku/code/get', //商家编码搜索
    getGoodsDetailForOrder: host + 'goods/detail/for/origin/order', //获取商品详细信息
    getGoodsSku: host + 'goods/sku/get', //获取商品具体的SkuCode
    addOrder: host + 'order/origin/manually/add', //生成订单
    getGroupGoodsDetailForOrder: host + 'goods/group/detail', //获取套餐商品详细信息
    getGroupGoodsSkuCodeListForOrder: host + 'goods/group/by/goodsgroup/code/get', //根据套餐编码查商品
    addSupplyOrder: host + 'order/supply/add', //添加补寄订单



    searchSkuNameList: host + 'goods/sku/name/valid/list', // sku模糊查询(可用的SKU)

    //订单详情页
    getOrderDetail: host + 'order/detail', //oms订单的详情查询
    getWmsPackageByOrderId: host + 'wms/package/list', //根据oms订单号查询订单具体包裹信息
    addOrderAction: host + 'order/action/add', //添加oms订单的相应的留言信息
    getOrderActionList: host + 'order/action/list', //oms订单的留言/备注列表查询
    modifyOrderFacilityShipping: host + 'order/warehouse/shipping/modify', //oms订单的仓库快递修改
    modifyOrderReceiverInfo: host + 'order/receiver/info/modify', //oms订单的收货信息修改
    getInventorySummary: host + 'inventory/summary/get', //库存查询
    modifyPostAndDiscountFee: host + 'order/post/and/discount/fee/modify', //订单优惠和邮费 修改
    modifyOrderGoods: host + 'order/goods/modify', //订单商品修改
    addOrderGoods: host + 'order/goods/add', //订单单品添加
    addOrderGroupGoods: host + 'order/goods/group/add', //订单套餐添加
    deleteOrderGoods: host + 'order/goods/delete', //订单商品删除
    getAllWarehouseList: host + 'warehouse/list', //仓库列表查询
    splitOrder: host + 'order/split', //拆分订单
    getOrderWarehouseInventorySummary: host + 'inventory/summary/order/warehouse', //订单可用仓库库存查询
    modifyOrderBook: host + 'order/modify/book', //修改预定单
    clearExceptionTag: host + 'order/clear/exception/tag', //清除异常标签
    

    getSaleOrderList: host + 'order/list', // 查询销售订单列表
    checkOrders: host + 'order/list/check', // 订单批量审核
    cancelOrders: host + 'order/list/cancel', // 订单批量作废
    rejectOrders: host + 'order/list/reject', //出库驳回
    forceCheckOrders: host + 'order/list/force/check', // 订单批量强制审核
    mergeOrders: host + 'order/merge', //合并订单
    changeOrdersType: host + 'order/list/change/subOrderType', // 订单批量修改订单子类型接口
    searchGoodsOrGroup: host + 'goods/name/list/for/choose/goods', // 商品或套餐模糊查询接口
    getGoodsWarehouseStrategyList: host + 'warehouse/shipping/choose/goods/list', // 商品选仓策略列表查询接口
    addStrategy: host + 'warehouse/shipping/choose/goods/add', // 商品选仓策略创建接口
    editStrategy: host + 'warehouse/shipping/choose/goods/update', // 商品选仓策略更新接口
    disableStrategy: host + 'warehouse/shipping/choose/goods/disable', // 商品选仓策略停用接口
    getShopWarehouseStrategyList: host + 'transform/shop/group/list', // 店铺区域仓配策略列表查询接口
    editShopWarehouseStrategy: host + 'transform/shop/group/modify', // 店铺区域仓配策略列表创建和修改接口
    getShippingListByWarehouseId: host + 'shipping/warehouse/id/list', // 一个仓库下快递查询接口
    getWarehouseListByShopId: host + 'warehouse/listByShop', // 根据店铺查找仓库
    getShippingListBySWId: host + 'shipping/list/by/shop/warehouse', // 根据店铺和仓库查询相应的可用快递

    //仓库建档
    getWarehouseRecordList: host + 'warehouse/option/list', // 查询仓库档案列表
    disableWarehouse: host + 'warehouse/disable', // 停用
    enableWarehouse: host + 'warehouse/enable', // 启用
    addWarehouse: host + 'warehouse/add', // 新建
    updateWarehouse: host + 'warehouse/update', // 更新
    getWarehouseDetail: host + 'warehouse/detail', // 仓库档案详情
    getPhysicalWarehouseList: host + 'warehouse/physical/list', // 查询物理仓列表

    //调整单
    getVList: host + 'order/v/list', // 查询调整单列表
    editNote: host + 'order/v/remark', // 修改备注
    deleteV: host + 'order/v/delete', // 作废
    reserveV: host + 'order/v/reserve', // 重新预定
    reserveList: host + 'order/v/reserve/list', // 重新预定
    applyV: host + 'order/v/apply', // 批量审核
    addSingleV: host + 'order/v/get', // 盘点单添加查询接口
    createV: host + 'order/v/add', // 盘点单创建接口
    searchWarehouseByType: host +'warehouse/list',//仓库名称(BY TYPE)模糊查询

    //售后列表
    getWarehouseListByParty: host + 'warehouse/party/list',//查询一个业务组下的所有可用仓库
    getAfterSaleReasonList: host + 'order/after/sale/reason/type', //退换原因查询
    getAfterSaleOrderList: host + 'order/after/sale/list', //退换列表查询
    addAfterSaleOrder: host + 'order/after/sale/add', //退换售后单创建
    saveAfterSaleOrder: host + 'order/after/sale/save', //退换售后单创建
    updateAfterSaleOrder: host + 'order/after/sale/update', //退换售后单更新
    settleAfterSaleOrder: host + 'order/after/sale/settle', //售后单结算
    checkAfterSaleOrder: host + 'order/after/sale/check', //售后单审核
    cancelAfterSaleOrder: host + 'order/after/sale/cancel',//售后单作废
    rejectAfterSaleOrderCheck: host + 'order/after/sale/check/reject', //售后单否决
    rejectAfterSaleOrderSettle: host + 'order/after/sale/settle/reject', //结算驳回
    getBankOnlinePaymentList: host + 'payment/online/bank/list', //网银类型
    loadAfterSaleOrder: host + 'order/after/sale/order/load', //订单加载
    getAfterSaleOrderDetail: host + 'order/after/sale/detail', //售后单详情
    getAfterSaleOrderByOrder: host + 'order/after/sale/detail/by/order', //根据OMS订单号查找相关售后单
    


    // 采购单
    getBalance: host + 'provider/party/mapping/get',  // 供应商在某业务组下的返利余额和票扣余额
    purchaseAdd: host + 'order/purchase/add',  // 新建采购单
    purchaseList: host + 'order/purchase/list',  // 采购单列表
    purchaseCheck: host + 'order/purchase/check',  // 采购单(批量)审核
    purchaseDeny: host + 'order/purchase/deny',  // 采购单(批量)否决
    purchaseRemarkList: host + 'order/purchase/remark/list',  // 采购单订单备注接口
    getPurchaseDetail: host + 'order/purchase/get',  // 采购单详情
    purchaseExceptionLabelClear: host + 'order/purchase/exception/label/clear',  // 清除异常标签
    purchaseInReject: host + 'order/purchase/in/reject',  // 采购单(批量)入库驳回
    purchaseTerminate : host + 'order/purchase/in/terminate', //采购单(批量)中止入库
    purchaseCancel: host + 'order/purchase/cancel',  // 采购单(批量)作废
    purchaseModify: host + 'order/purchase/modify',  // 修改采购单接口
    purchaseDetailDelete: host + 'order/purchase/detail/delete',  // 删除采购单详情接口
    purchaseDetailModify: host + 'order/purchase/detail/modify',  // 修改采购单详情接口
    purchaseDetailAdd: host + 'order/purchase/detail/add',  // 添加采购单详情接口
    purchaseRemarkAdd: host + 'order/purchase/remark/add',  // 增加订单备注接口

    //赠品
    giftStrategyAdd: host + 'gift/strategy/add',  // 新建赠品策略
    getGiftStrategyList: host + 'gift/strategy/list',  // 查询赠品
    getGiftStrategyDetail: host + 'gift/strategy/detail',  // 赠品详情
    giftStrategyStatusModify: host + 'gift/strategy/status/modify',  // 修改赠品策略状态
    giftStrategyModify: host + 'gift/strategy/modify',  // 修改赠品策略状态
    giftStrategyLevelDetailAdd: host + 'gift/strategy/level/detail/add',  // 添加组内分级详情
    giftStrategyLevelDetailModify: host + 'gift/strategy/level/detail/modify',  // 修改组内分级详情
    giftStrategyLevelDetailDelete: host + 'gift/strategy/level/detail/delete',  // 删除组内分级详情

    // 业务组管理
    getPartyList: host + 'party/manage/list',  // 全业务组查询接口
    addParty: host + 'party/manage/add',  // 新建业务组接口
    updateParty: host + 'party/manage/update',  // 修改业务组接口

    // 用户管理
    getUserList: host + 'user/list',  // 用户查询接口
    addUser: host + 'user/add',  // 用户新建接口
    updateUser: host + 'user/modify',  // 用户注册接口
    userEnable: host + 'user/enable',  // 用户启用接口
    userDisable: host + 'user/disable',  // 用户停用接口
    getRoleList: host + 'role/list',  // 角色(模糊)查询接口
    searchUserNameList: host + 'user/name/list',  // 用户名称(模糊)查询接口
    getUserDetail: host + 'user/get',  // 单个用户详情获取接口
    userAssign: host + 'user/resource/assign',  // 确认分派业务组、角色和权限给指定用户
    userAccredit: host + 'user/resource/privilege',  // 确认可以给其他用户授予业务组、角色和权限的接口

    //销售财审
    getFinanceSaleCheckList: host + 'finance/sale/check/list', //需要财审的销售订单列表
    checkFinanceCheck: host + 'finance/sale/check', //需要财审的销售订单列表
    receiptFinanceSale: host + 'finance/sale/receipt', //财审收款

    //-GT财审
    getGtFinanceCheckList: host + 'order/gt/finance/check/list', //需要财审的gt单据列表
    gtFinanceCheck: host + 'order/gt/finance/check', //审核
    gtFinanceReject: host + 'order/gt/finance/reject', //驳回
    
    // 销售发票
    getSaleInvoiceList: host + 'order/sale/invoice/list', //查询销售发票接口
    addSaleInvoice: host + 'order/sale/invoice/add', //申请销售发票接口(创建销售发票)
    getOrderDetailOrderSn: host + 'order/detail/get/by/orderSn',  //OMS订单加载接口
    saleInvoiceModigyInit: host + 'order/sale/invoice/modify/init',  //待开票编辑接口
    saleInvoiceCancel: host + 'order/sale/invoice/cancel',  //待开票作废接口
    saleInvoiceModigyInvoiced: host + 'order/sale/invoice/modify/invoiced',  //已开票编辑接口
    saleInvoiceBilling: host + 'order/sale/invoice/billing',  //开票接口
    getSaleInvoiceByOrderId: host + 'order/sale/invoice/list/by/orderId', //查询单个订单开票信息接口

    //推送策略
    pushStrategyListByShop: host + 'wms/push/strategy/listByShop', //推送策略列表查询
    pushStrategyModify: host + 'wms/push/strategy/modify', //修改推送策略
    pushStrategyDetailList: host + 'wms/push/strategy/detail/list', //推送策略详情列表查询
    pushStrategyDetailModify: host + 'wms/push/strategy/detail/modify', //修改推送策略详情
    pushStrategyDetailStatusModify: host + 'wms/push/strategy/details/status/modify', //批量修改推送策略

    //os订单
    getOldShippedOrderList: host + 'order/old/shipped/list', //查询老的销售订单
    loadOldShippedOrder: host + 'order/old/shipped/load', //老erp订单加载接口
    addOldShippedOrder: host + 'order/old/shipped/add', //OS订单创建接口
}

