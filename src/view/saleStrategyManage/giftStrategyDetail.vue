<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1>新建赠品策略</h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>销售策略</a></li>
        <li class="active">新建赠品策略</li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content giftStrategyDetail content_yjlu">
      <div class="row form-horizontal">
        <div class="col-md-8 noPadding">
          <div class="col-md-12 bgFFF">
            <div class="form-group">
              <div class="col-sm-12">
                <label class="control-label col-sm-2">策略名称</label>
                <div class="col-sm-10">
                  <input class="form-control input-sm" type="text" v-model="giftStrategyAddVO.giftStrategyName">
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">生效时间类型</label>
                <div class="col-sm-8">
                  <select class="form-control select-sm" v-model="giftStrategyAddVO.timeType">
                    <option value="PAY_TIME">付款时间</option>
                    <option value="CREATE_TIME">拍下时间</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-6">
                <label class="control-label col-sm-4">延时转化</label>
                <div class="col-sm-8">
                  <select class="form-control select-sm" v-model="giftStrategyAddVO.delay">
                    <option value="0">不延时</option>
                    <option value="2">延时转化2小时</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">开始生效时间</label>
                <div class="col-sm-8">
                  <date-picker id="effectiveTimeStart" :value="giftStrategyAddVO.startTime" @choose="chooseEffectiveTimeStart" :disabled="$route.params.status == 'NOT_START'"></date-picker>
                </div>
              </div>
              <div class="col-sm-6">
                <label class="control-label col-sm-4">结束生效时间</label>
                <div class="col-sm-8">
                  <date-picker id="effectiveTimeEnd" :value="giftStrategyAddVO.endTime" @choose="chooseEffectiveTimeEnd" :disabled="$route.params.status == 'EXPIRED'"></date-picker>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">条件级数</label>
                <div class="col-sm-8">
                  <select class="form-control select-sm" v-model="browserData.level" :disabled="$route.params.id">
                    <option value="1">1级</option>
                    <option value="2">2级</option>
                    <option value="3">3级</option>
                    <option value="4">4级</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-6">
                <label class="control-label col-sm-8 giftTip">(级别数值越大，优先级越高)</label>
              </div>
            </div>
          </div>
          <div class="col-md-12"></div>
          <div class="col-md-12 bgFFF">
            <div class="form-group">
              <small class="control-label col-sm-2">目标订单条件</small>
              <div class="col-sm-8">
                <select class="form-control select-sm" v-model="browserData.targetOrderType">
                  <option value="tradeFrom">终端类型</option>
                  <option value="platformStyleKey">平台规格关键词</option>
                  <option value="platformSkuKey">平台宝贝关键词</option>
                  <option value="sellerMemoKey">客服备注关键词</option>
                  <option value="buyerMemoKey">买家备注关键词</option>
                  <option value="regionIds">收件区域</option>
                  <option value="warehouseIds">仓库</option>
                  <option value="distributorIds">分销商</option>
                  <option value="buyers">用户ID</option>
                  <option value="onceGoodsIds">订单只要包含</option>
                  <option value="allGoodsIds">订单全部包含于</option>
                </select>
              </div>
              <div class="col-sm-2">
                <button class="btn btn-primary btn-sm" @click="addTargetOrderType">添加</button>
              </div>
            </div>
            <gift-item-add label-name="店铺" is-required="true" type="select" api="getShopList" :selecteds="giftStrategyAddVO.shops" @callback="getShopSelecteds"></gift-item-add>
            <!-- 点添加后显示 -->
            <div class="form-group" v-if="browserData.targetOrderTypeShow.tradeFrom == 'tradeFrom' || browserData.targetOrderTypeShow.platformStyleKey == 'platformStyleKey'">
              <div class="col-sm-6" v-if="browserData.targetOrderTypeShow.tradeFrom == 'tradeFrom'">
                <label class="control-label col-sm-4">终端类型</label>
                <div class="col-sm-7">
                  <select class="form-control select-sm" v-model="giftStrategyAddVO.tradeFrom">
                    <option value="PC">PC</option>
                    <option value="MB">手机</option>
                    <option value="JHS">聚划算</option>
                  </select>
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'targetOrderTypeShow', 'tradeFrom')">&#xe61e;</i>
              </div>
              <div class="col-sm-6" v-if="browserData.targetOrderTypeShow.platformStyleKey == 'platformStyleKey'">
                <label class="control-label col-sm-4">平台规格关键词</label>
                <div class="col-sm-7">
                  <input class="form-control input-sm" type="text" v-model="giftStrategyAddVO.platformStyleKey" maxlength="20" @keyup="getStrLength(giftStrategyAddVO.platformStyleKey)">
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'targetOrderTypeShow', 'platformStyleKey')">&#xe61e;</i>
              </div>
            </div>
            <div class="form-group" v-if="browserData.targetOrderTypeShow.platformSkuKey == 'platformSkuKey' || browserData.targetOrderTypeShow.sellerMemoKey == 'sellerMemoKey'">
              <div class="col-sm-6" v-if="browserData.targetOrderTypeShow.platformSkuKey == 'platformSkuKey'">
                <label class="control-label col-sm-4">平台宝贝关键词</label>
                <div class="col-sm-7">
                  <input class="form-control input-sm" type="text" v-model="giftStrategyAddVO.platformSkuKey" maxlength="20" @keyup="getStrLength(giftStrategyAddVO.platformSkuKey)">
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'targetOrderTypeShow', 'platformSkuKey')">&#xe61e;</i>
              </div>
              <div class="col-sm-6" v-if="browserData.targetOrderTypeShow.sellerMemoKey == 'sellerMemoKey'">
                <label class="control-label col-sm-4">客服备注关键词</label>
                <div class="col-sm-7">
                  <input class="form-control input-sm" type="text" v-model="giftStrategyAddVO.sellerMemoKey" maxlength="20" @keyup="getStrLength(giftStrategyAddVO.sellerMemoKey)">
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'targetOrderTypeShow', 'sellerMemoKey')">&#xe61e;</i>
              </div>
            </div>
            <div class="form-group" v-if="browserData.targetOrderTypeShow.buyerMemoKey == 'buyerMemoKey'">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">买家备注关键词</label>
                <div class="col-sm-7">
                  <input class="form-control input-sm" type="text" v-model="giftStrategyAddVO.buyerMemoKey" maxlength="20" @keyup="getStrLength(giftStrategyAddVO.buyerMemoKey)">
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'targetOrderTypeShow', 'buyerMemoKey')">&#xe61e;</i>
              </div>
            </div>
            <div class="form-group" v-if="browserData.targetOrderTypeShow.regionIds == 'regionIds'">
              <label class="control-label col-sm-2">收件区域</label>
              <div class="col-sm-10">
                <address-folder show-arr-len="3" is-choose-all="true" @choose-region="chooseRegion" ref="region"></address-folder>
                <i class="iconfont control-label deleteIcon" @click="deleteIconFun('', 'targetOrderTypeShow', 'regionIds')">&#xe61e;</i>
                <button class="btn btn-primary btn-sm" style="margin-left: 10px;" @click="regionAddFun">添加</button>
              </div>
              <div class="col-sm-10 col-sm-offset-2">
                <span class="addShopItem" v-for="(item, i) in regionData.selecteds">
                  <span>{{item.province.regionName}}<span v-if="item.province.regionId != -1">省</span></span>
                  <span v-if="item.city.regionName">{{item.city.regionName}}市</span>
                  <span>{{item.region.regionName}}</span>
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, regionData)">&#xe61e;</i>
                </span>
              </div>
            </div>
            <div class="form-group" v-if="browserData.targetOrderTypeShow.warehouseIds == 'warehouseIds'">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">仓库</label>
                <div class="col-sm-7">
                  <search-warehouse id="searchWarehouse" placeholder="仓库搜索" @selected="selectedWarehouse"></search-warehouse>
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'targetOrderTypeShow', 'warehouseIds')">&#xe61e;</i>
              </div>
              <div class="col-sm-1">
                <button class="btn btn-primary btn-sm" @click="getSelecteds('warehouseData')">添加</button>
              </div>
              <div class="col-sm-5">
                <span class="addShopItem" v-for="(item, i) in warehouseData.selecteds">
                  {{item.warehouseName}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, warehouseData)">&#xe61e;</i>
                </span>
              </div>
            </div>
            <div class="form-group" v-if="browserData.targetOrderTypeShow.distributorIds == 'distributorIds'">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">分销商</label>
                <div class="col-sm-7">
                  <search-distributor id="searchDistributor" placeholder="分销商搜索" @selected="selectedDistributor"></search-distributor>
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'targetOrderTypeShow', 'distributorIds')">&#xe61e;</i>
              </div>
              <div class="col-sm-1">
                <button class="btn btn-primary btn-sm" @click="getSelecteds('distributorData')">添加</button>
              </div>
              <div class="col-sm-5">
                <span class="addShopItem" v-for="(item, i) in distributorData.selecteds">
                  {{item.name}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, distributorData)">&#xe61e;</i>
                </span>
              </div>
            </div>
            <div class="form-group" v-if="browserData.targetOrderTypeShow.buyers == 'buyers'">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">用户ID</label>
                <div class="col-sm-7">
                  <input class="form-control input-sm" type="text" placeholder="可添加多个ID" v-model="browserData.buyers" />
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'targetOrderTypeShow', 'buyers')">&#xe61e;</i>
              </div>
              <div class="col-sm-1">
                <button class="btn btn-primary btn-sm" @click="getBuyers">添加</button>
              </div>
              <div class="col-sm-5">
                <span class="addShopItem" v-for="(item, i) in giftStrategyAddVO.buyers">
                  {{item}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, 'browserData')">&#xe61e;</i>
                </span>
              </div>
              <!-- <div class="col-sm-4 uploadFile">
                <input class="form-control input-sm" type="file">
              </div>
              <a class="control-label col-sm-2" href="">批量导入模板</a> -->
              <!-- <i class="iconfont control-label col-sm-1 deleteIcon">&#xe61e;</i> -->
            </div>
            <div class="form-group" v-if="browserData.targetOrderTypeShow.onceGoodsIds == 'onceGoodsIds'">
              <label class="control-label col-sm-2">订单只要包含</label>
              <div class="col-sm-8">
                <search-goods-or-group id="goodsOrGroup" placeholder="商品名称和商家编码模糊搜索" @selected="selectedGoodsOrGroup"></search-goods-or-group>
              </div>
              <div class="col-sm-2">
                <i class="iconfont control-label deleteIcon" style="margin-right: 10px;" @click="deleteIconFun('', 'targetOrderTypeShow', 'onceGoodsIds')">&#xe61e;</i>
                <button class="btn btn-primary btn-sm" @click="goodsOrGroupAddFun">添加</button>
              </div>
              <div class="col-sm-10 col-sm-offset-2">
                <span class="addShopItem" v-for="(item, i) in goodsOrGroupData.selecteds">
                  {{item.goodsName}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, goodsOrGroupData)">&#xe61e;</i>
                </span>
              </div>
            </div>
            <div class="form-group" v-if="browserData.targetOrderTypeShow.allGoodsIds == 'allGoodsIds'">
              <label class="control-label col-sm-2">订单全部包含于</label>
              <div class="col-sm-8">
                <search-goods-or-group id="goodsOrGroupAll" placeholder="商品名称和商家编码模糊搜索" @selected="selectedGoodsOrGroupAll"></search-goods-or-group>
              </div>
              <div class="col-sm-2">
                <i class="iconfont control-label deleteIcon" style="margin-right: 10px;" @click="deleteIconFun('', 'targetOrderTypeShow', 'allGoodsIds')">&#xe61e;</i>
                <button class="btn btn-primary btn-sm" @click="goodsOrGroupAddFun('all')">添加</button>
              </div>
              <div class="col-sm-10 col-sm-offset-2">
                <span class="addShopItem" v-for="(item, i) in goodsOrGroupAllData.selecteds">
                  {{item.goodsName}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, goodsOrGroupAllData)">&#xe61e;</i>
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-12"></div>
          <div class="col-md-12 bgFFF">
            <div class="form-group">
              <small class="control-label col-sm-2">参与商品选择</small>
              <div class="col-sm-7">
                <select class="form-control select-sm" v-model="browserData.rangeType">
                  <option value="goodsIncludedIds">参与商品范围</option>
                  <option value="goodsExcludedIds">排除商品范围</option>
                  <option value="brandIncludedIds">参与商品品牌</option>
                  <option value="brandExcludedIds">排除商品品牌</option>
                  <option value="customCatIncludedIds">参与商品分类</option>
                  <option value="customCatExcludedIds">排除商品分类</option>
                </select>
              </div>
              <div class="col-sm-2">
                <button class="btn btn-primary btn-sm" :disabled="browserData.range" @click="addRangeType">添加</button>
              </div>
              <label class="checkbox-inline control-label col-sm-1" style="margin-left: -30px;">
                <input type="checkbox" v-model="browserData.range">全订单
              </label>
            </div>
            <!-- 点添加后显示 -->
            <div class="form-group" v-if="browserData.rangeTypeShow.goodsIncludedIds == 'goodsIncludedIds'">
              <label class="control-label col-sm-2">参与商品范围</label>
              <div class="col-sm-8">
                <search-goods-or-group id="goodsIncluded" placeholder="商品名称和商家编码模糊搜索" @selected="selectedGoodsIncluded"></search-goods-or-group>
              </div>
              <div class="col-sm-2">
                <i class="iconfont control-label deleteIcon" style="margin-right: 10px;" @click="deleteIconFun('', 'rangeTypeShow', 'goodsIncludedIds')">&#xe61e;</i>
                <button class="btn btn-primary btn-sm" @click="goodsOrGroupAddFun('goodsIncluded')">添加</button>
              </div>
              <div class="col-sm-10 col-sm-offset-2">
                <span class="addShopItem" v-for="(item, i) in goodsIncludedData.selecteds">
                  {{item.goodsName}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, goodsIncludedData)">&#xe61e;</i>
                </span>
              </div>
            </div>
            <div class="form-group" v-if="browserData.rangeTypeShow.goodsExcludedIds == 'goodsExcludedIds'">
              <label class="control-label col-sm-2">排除商品范围</label>
              <div class="col-sm-8">
                <search-goods-or-group id="goodsExcluded" placeholder="商品名称和商家编码模糊搜索" @selected="selectedGoodsExcluded"></search-goods-or-group>
              </div>
              <div class="col-sm-2">
                <i class="iconfont control-label deleteIcon" style="margin-right: 10px;" @click="deleteIconFun('', 'rangeTypeShow', 'goodsExcludedIds')">&#xe61e;</i>
                <button class="btn btn-primary btn-sm" @click="goodsOrGroupAddFun('goodsExcluded')">添加</button>
              </div>
              <div class="col-sm-10 col-sm-offset-2">
                <span class="addShopItem" v-for="(item, i) in goodsExcludedData.selecteds">
                  {{item.goodsName}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, goodsExcludedData)">&#xe61e;</i>
                </span>
              </div>
            </div>
            <div class="form-group" v-if="browserData.rangeTypeShow.brandIncludedIds == 'brandIncludedIds'">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">参与商品品牌</label>
                <div class="col-sm-7">
                  <select-goods-brand id="brandIncluded" @selected="selectBrandIncluded"></select-goods-brand>
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'rangeTypeShow', 'brandIncludedIds')">&#xe61e;</i>
              </div>
              <div class="col-sm-1">
                <button class="btn btn-primary btn-sm" @click="goodsOrGroupAddFun('brandIncluded')">添加</button>
              </div>
              <div class="col-sm-5">
                <span class="addShopItem" v-for="(item, i) in brandIncludedData.selecteds">
                  {{item.name}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, brandIncludedData)">&#xe61e;</i>
                </span>
              </div>
            </div>
            <div class="form-group" v-if="browserData.rangeTypeShow.brandExcludedIds == 'brandExcludedIds'">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">排除商品品牌</label>
                <div class="col-sm-7">
                  <select-goods-brand id="brandExcluded" @selected="selectBrandExcluded"></select-goods-brand>
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'rangeTypeShow', 'brandExcludedIds')">&#xe61e;</i>
              </div>
              <div class="col-sm-1">
                <button class="btn btn-primary btn-sm" @click="goodsOrGroupAddFun('brandExcluded')">添加</button>
              </div>
              <div class="col-sm-5">
                <span class="addShopItem" v-for="(item, i) in brandExcludedData.selecteds">
                  {{item.name}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, brandExcludedData)">&#xe61e;</i>
                </span>
              </div>
            </div>
            <div class="form-group" v-if="browserData.rangeTypeShow.customCatIncludedIds == 'customCatIncludedIds'">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">参与商品分类</label>
                <div class="col-sm-7">
                  <search-custom-category id="customCatIncludeds" @selected="searchCustomCategoryIncludeds"></search-custom-category>
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'rangeTypeShow', 'customCatIncludedIds')">&#xe61e;</i>
              </div>
              <div class="col-sm-1">
                <button class="btn btn-primary btn-sm" @click="goodsOrGroupAddFun('customCatIncludeds')">添加</button>
              </div>
              <div class="col-sm-5">
                <span class="addShopItem" v-for="(item, i) in customCatIncludedsData.selecteds">
                  {{item.name}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, customCatIncludedsData)">&#xe61e;</i>
                </span>
              </div>
            </div>
            <div class="form-group" v-if="browserData.rangeTypeShow.customCatExcludedIds == 'customCatExcludedIds'">
              <div class="col-sm-6">
                <label class="control-label col-sm-4">排除商品分类</label>
                <div class="col-sm-7">
                  <search-custom-category id="customCatExcludeds" @selected="searchCustomCategoryExcludeds"></search-custom-category>
                </div>
                <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun('', 'rangeTypeShow', 'customCatExcludedIds')">&#xe61e;</i>
              </div>
              <div class="col-sm-1">
                <button class="btn btn-primary btn-sm" @click="goodsOrGroupAddFun('customCatExcludeds')">添加</button>
              </div>
              <div class="col-sm-5">
                <span class="addShopItem" v-for="(item, i) in customCatExcludedsData.selecteds">
                  {{item.name}}
                  <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i, customCatExcludedsData)">&#xe61e;</i>
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-12"></div>
          <div class="col-md-12 bgFFF">
            <template v-for="(item, i) in giftStrategyAddVO.levels || browserLevels">
              <div class="form-group">
                <small class="control-label col-sm-2 required">满赠{{i+1}}级条件</small>
                <div class="col-sm-8">
                  <select class="form-control select-sm" v-model="item.giftStrategyType">
                    <option value="leastTypeNumber">原始单参与商品种数</option>
                    <option value="leastNumber">原始单参与商品数量</option>
                    <option value="leastGoodsFee">原始单参与货款金额</option>
                    <option value="leastTotalFee">全订单应收金额(含邮费)</option>
                  </select>
                </div>
                <div class="col-sm-2">
                  <button class="btn btn-primary btn-sm" @click="addGiftStrategyType(item, i)">添加</button>
                </div>
              </div>
              <div class="form-group" v-if="item.giftStrategyTypeShow.leastTypeNumber == 'leastTypeNumber' || item.giftStrategyTypeShow.leastNumber == 'leastNumber'">
                <div class="col-sm-6" v-if="item.giftStrategyTypeShow.leastTypeNumber == 'leastTypeNumber'">
                  <label class="control-label col-sm-6">原始单参与商品种数</label>
                  <div class="col-sm-5">
                    <input class="form-control input-sm" type="text" v-model="item.leastTypeNumber">
                  </div>
                  <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun(i, 'giftStrategyTypeShow', 'leastTypeNumber')">&#xe61e;</i>
                </div>
                <div class="col-sm-6" v-if="item.giftStrategyTypeShow.leastNumber == 'leastNumber'">
                  <label class="control-label col-sm-6">原始单参与商品数量</label>
                  <div class="col-sm-5">
                    <input class="form-control input-sm" type="text" v-model="item.leastNumber">
                  </div>
                  <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun(i, 'giftStrategyTypeShow', 'leastNumber')">&#xe61e;</i>
                </div>
              </div>
              <div class="form-group" v-if="item.giftStrategyTypeShow.leastGoodsFee == 'leastGoodsFee' || item.giftStrategyTypeShow.leastTotalFee == 'leastTotalFee'">
                <div class="col-sm-6" v-if="item.giftStrategyTypeShow.leastGoodsFee == 'leastGoodsFee'">
                  <label class="control-label col-sm-6">原始单参与货款金额</label>
                  <div class="col-sm-5">
                    <input class="form-control input-sm" type="text" v-model="item.leastGoodsFee">
                  </div>
                  <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun(i, 'giftStrategyTypeShow', 'leastGoodsFee')">&#xe61e;</i>
                </div>
                <div class="col-sm-6" v-if="item.giftStrategyTypeShow.leastTotalFee == 'leastTotalFee'">
                  <label class="control-label col-sm-7">全订单应收金额(含邮费)</label>
                  <div class="col-sm-4">
                    <input class="form-control input-sm" type="text" v-model="item.leastTotalFee">
                  </div>
                  <i class="iconfont control-label col-sm-1 deleteIcon" @click="deleteIconFun(i, 'giftStrategyTypeShow', 'leastTotalFee')">&#xe61e;</i>
                </div>
              </div>
            </template>
          </div>
          <div class="col-md-12"></div>
          <div class="col-md-12 bgFFF">
            <div class="form-group">
              <label class="control-label col-sm-2" style="font-weight: bold;">赠品明细及顺序</label>
              <label class="control-label col-sm-3 checkbox-inline">
                <input type="checkbox">
                策略保存时预留库存
              </label>
              <label class="control-label col-sm-7 giftTip">(级别数值越大，优先级越高)</label>
            </div>
            <template v-for="(item, i) in giftStrategyAddVO.levels">
              <div class="form-group">
                <small class="control-label col-sm-2 required">满赠{{i+1}}级条件</small>
                <div class="col-sm-2">
                  <select class="form-control select-sm" v-model="item.repeatType">
                    <option value="ONCE">不倍增</option>
                    <option value="BY_TYPE_NUMBER">按商品种类数倍增</option>
                    <option value="BY_NUMBER">按商品数量倍增</option>
                    <option value="BY_GOODS_FEE">按货款金额倍增</option>
                    <option value="BY_TOTAL_FEE">按全订单应收倍增</option>
                  </select>
                </div>
                <div class="col-sm-4">
                  <label class="control-label giftTip">订单赠送上限组数</label>
                  <input class="form-control input-sm iptSm" :disabled="item.repeatType == 'ONCE'" type="text" v-model="item.groupLimit">
                </div>
                <label class="control-label col-sm-2">赠品类型</label>
                <div class="col-sm-2">
                  <select class="form-control select-sm">
                    <option value="">无</option>
                    <option value="GWP">GWP</option>
                    <option value="OPEX">OPEX</option>
                  </select>
                </div>
              </div>
              <div class="row form-horizontal tableContent">
                <table class="table table-hover table-condensed myTable">
                  <thead>
                    <tr>
                      <th>赠品序列</th>
                      <th>赠品商家编码</th>
                      <th>赠品商品名称</th>
                      <th>每组数量</th>
                      <th>赠品数量</th>
                      <th>当前余量</th>
                      <th>重设数量</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(itemDetail, j) in item.details">
                      <td :class="{required: j == 0}">第{{j+1}}赠品</td>
                      <td colspan="2">
                        <search-goods-or-group :id="'searchGoodsOrGroup_'+i+'_'+j" placeholder="商品名称和商家编码模糊搜索" @selected="searchGoodsOrGroup" :disabled="itemDetail.isEdit == false" :selectedData="itemDetail.sku"></search-goods-or-group>
                      </td>
                      <td>
                        <input class="form-control input-sm iptSm" type="text" v-model="itemDetail.groupNumber" :disabled="itemDetail.isEdit == false">
                      </td>
                      <td>
                        <input class="form-control input-sm iptSm" type="text" v-model="itemDetail.totalNumber" :disabled="itemDetail.isEdit == false || itemDetail.isNew">
                      </td>
                      <td>
                        <input class="form-control input-sm iptSm" disabled="true" type="text" v-model="itemDetail.leftNumber">
                      </td>
                      <td>
                        <input class="form-control input-sm iptSm" type="number" min="0" v-model="itemDetail.addNumber" :disabled="itemDetail.isEdit == false || !itemDetail.isNew">
                      </td>
                      <td>
                        <div>
                          <i class="iconfont iconfontEdit" v-if="itemDetail.isEdit == false" @click="editFun(i, j, itemDetail)">&#xe622;</i>
                        </div>
                        <div v-if="itemDetail.isEdit == true">
                          <i class="iconfont iconfontYes" @click="saveIconFun(i, j, itemDetail)">&#xe626;</i>
                          <i class="iconfont iconfontNo" @click="clearFun(itemDetail)">&#xe7ca;</i>
                        </div>
                        <div>
                          <i class="iconfont iconfontDelete" @click="deleteDetailFun(itemDetail)">&#xe613;</i>
                        </div>
                        <div>
                          <i class="iconfont iconfontAdd" v-if="j == item.details.length-1" @click="addFun(i, j)">&#xe60a;</i>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
          <div class="col-md-12 createBtn">
            <button class="btn btn-primary" @click="giftStrategyAdd" v-if="!$route.params.id">创建</button>
            <button class="btn btn-primary" @click="giftStrategyModify" v-if="$route.params.id">保存</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import deepClone from '../../common/deepClone'

import datePicker from '../../component/datePicker'
import addressFolder from '../../component/addressFolder'
import searchGoodsOrGroup from '../../component/searchGoodsOrGroup'
import selectGoodsBrand from '../../component/selectGoodsBrand'
import searchCustomCategory from '../../component/searchCustomCategory'
import giftItemAdd from '../../component/giftItemAdd'
import searchWarehouse from '../../component/searchWarehouse'
import searchDistributor from '../../component/searchDistributor'
export default {
  components: {
    datePicker,
    addressFolder,
    searchGoodsOrGroup,
    selectGoodsBrand,
    searchCustomCategory,
    giftItemAdd,
    searchWarehouse,
    searchDistributor
  },
  data () {
    return {
      regionData: {
        selected: {},
        selecteds: []
      },
      goodsOrGroupData: {
        selected: {},
        selecteds: []
      },
      goodsOrGroupAllData: {
        selected: {},
        selecteds: []
      },
      goodsIncludedData: {
        selected: {},
        selecteds: []
      },
      brandIncludedData: {
        selected: {},
        selecteds: []
      },
      brandExcludedData: {
        selected: {},
        selecteds: []
      },
      goodsExcludedData: {
        selected: {},
        selecteds: []
      },
      customCatIncludedsData: {
        selected: {},
        selecteds: []
      },
      customCatExcludedsData: {
        selected: {},
        selecteds: []
      },
      warehouseData: {
        selected: {},
        selecteds: []
      },
      distributorData: {
        selected: {},
        selecteds: []
      },

      giftStrategyAddVO: {
        giftStrategyName: '',
        partyId: '',
        timeType: 'PAY_TIME',
        startTime: '',
        endTime: '',
        delay: '0',
        tradeFrom: '',
        platformStyleKey: '',
        platformSkuKey: '',
        sellerMemoKey: '',
        buyerMemoKey: '',
        range: 'ALL',
        shopIds: [],
        warehouseIds: [],
        regionIds: [],
        buyers: [],
        distributorIds: [],
        onceGoodsGroupIds: [],
        onceGoodsSkuIds: [],
        goodsIncludedGroupIds: [],
        goodsIncludedSkuIds: [],
        goodsExcludedGroupIds: [],
        goodsExcludedSkuIds: [],
        brandIncludedIds: [],
        brandExcludedIds: [],
        customCatIncludedIds: [],
        customCatExcludedIds: [],
        levels: [{
          giftStrategyType: '', //不传到后台
          giftStrategyTypeShow: {
            leastTypeNumber: '',
            leastNumber: '',
            leastGoodsFee: '',
            leastTotalFee: '',
          }, //不传到后台

          leastTypeNumber: '', //（满赠条件）商品种类数
          leastNumber: '',  //（满赠条件）商品数量
          leastGoodsFee: '',  //（满赠条件）货款金额
          leastTotalFee: '',  //（满赠条件）应收金额
          level: '',
          groupLimit: '',
          repeatType: 'ONCE',
          details: [{
            isEdit: false, //不传到后台

            sort: '1',
            giftStrategyLevelId: '1',
            totalNumber: '',
            groupNumber: '',
            leftNumber: '',
            addNumber: ''
          }]
        }]
      },
      browserData: {
        range: 'ALL',
        buyers: '',
        level: 1,
        rangeType: '',
        rangeTypeShow: {
          goodsIncludedIds: '',
          goodsExcludedIds: '',
          brandIncludedIds: '',
          brandExcludedIds: '',
          customCatIncludedIds: '',
          customCatExcludedIds: '',
        },
        targetOrderType: '',
        targetOrderTypeShow: {
          tradeFrom: '',
          platformStyleKey: '',
          platformSkuKey: '',
          sellerMemoKey: '',
          buyerMemoKey: '',
          regionIds: '',
          warehouseIds: '',
          distributorIds: '',
          buyers: '',
          onceGoodsIds: '',
          allGoodsIds: ''
        },
        newLevel: {
          giftStrategyType: '', //不传到后台
          giftStrategyTypeShow: {
            leastTypeNumber: '',
            leastNumber: '',
            leastGoodsFee: '',
            leastTotalFee: '',
          }, //不传到后台

          leastTypeNumber: '', //（满赠条件）商品种类数
          leastNumber: '',  //（满赠条件）商品数量
          leastGoodsFee: '',  //（满赠条件）货款金额
          leastTotalFee: '',  //（满赠条件）应收金额
          level: '',
          groupLimit: '',
          repeatType: 'ONCE',
          details: [{
            isEdit: false, //不传到后台

            sort: '1',
            giftStrategyLevelId: '',
            totalNumber: '',
            groupNumber: '',
            leftNumber: '',
            addNumber: ''
          }]
        },
        newDetail: {
          isEdit: false, //不传到后台

          sort: '',
          giftStrategyLevelId: '',
          totalNumber: '',
          groupNumber: '',
          leftNumber: '',
          addNumber: ''
        }
      },
      item_i: 0,
      itemDetail_j: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      initStyle();
      this.getGiftStrategyDetail();
    });
  },
  watch: {
    'browserData.range': function (newVal) {
      if (newVal) {
        this.giftStrategyAddVO.range = 'ALL';
        for (var i in this.browserData.rangeTypeShow) {
          this.browserData.rangeTypeShow[i] = '';
        }
      } else {
        this.giftStrategyAddVO.range = 'GOODS_TARGET';
      }
    },
    'browserData.level': function (newVal) {
      this.giftStrategyAddVO.levels.splice(1, this.giftStrategyAddVO.levels.length - 1);
      for (var j = 0; j < Number(newVal) - 1; j++){
        this.giftStrategyAddVO.levels.push(deepClone(this.browserData.newLevel));
      }
    }
  },
  methods: {
    getStrLength (str) {
      console.log(str, str.length);
      if (str.length > 20) {
        str = str.substring(0, 20);
        layer.msg('限20字', {time: 2000});
      }
    },
    getGiftStrategyDetail () {
      const _self = this;
      if (_self.$route.params.id) {
        http({
          instance: _self,
          url: api.getGiftStrategyDetail,
          type: 'post',
          data: {
            data: {
              giftStrategyId: _self.$route.params.id
            }
          },
          success (res) {
            if (res.data) {
              _self.giftStrategyAddVO = res.data;
              // 目标订单条件
              if (_self.giftStrategyAddVO.shops.length) {
                _self.browserData.targetOrderTypeShow['shopIds'] = 'shopIds';
                _self.$set(_self.giftStrategyAddVO, 'shopIds', []);
                _self.giftStrategyAddVO.shops.forEach(function (val, i) {
                  _self.giftStrategyAddVO.shopIds.push(val.shopId);
                });
              }
              if (_self.giftStrategyAddVO.warehouses.length) {
                _self.browserData.targetOrderTypeShow['warehouseIds'] = 'warehouseIds';
                _self.warehouseData.selecteds = _self.giftStrategyAddVO.warehouses;
                _self.$set(_self.giftStrategyAddVO, 'warehouseIds', []);
                _self.giftStrategyAddVO.warehouses.forEach(function (val, i) {
                  _self.giftStrategyAddVO.warehouseIds.push(val.warehouseId);
                });
              }
              if (_self.giftStrategyAddVO.regions.length) {
                _self.browserData.targetOrderTypeShow['regionIds'] = 'regionIds';
                // _self.regionData.selecteds = _self.giftStrategyAddVO.regions;
                // _self.$set(_self.giftStrategyAddVO, 'regionIds', []);
                // _self.giftStrategyAddVO.regions.forEach(function (val, i) {
                //   _self.giftStrategyAddVO.regionIds.push(val.regionId);
                // });
              }
              for (var i in _self.browserData.targetOrderTypeShow) {
                if (_self.giftStrategyAddVO[i]) {
                  _self.browserData.targetOrderTypeShow[i] = i;
                }
              }
              _self.getDetailGoodsData(_self.giftStrategyAddVO.onceGoodsSkus, _self.giftStrategyAddVO.onceGoodsGroups, _self.goodsOrGroupData, 'onceGoodsIds', 'targetOrderTypeShow');
              _self.getDetailGoodsData(_self.giftStrategyAddVO.allGoodsSkus, _self.giftStrategyAddVO.allGoodsGroups, _self.goodsOrGroupAllData, 'allGoodsIds', 'targetOrderTypeShow');
              // 参与商品选择
              if (_self.giftStrategyAddVO.range == 'ALL') {
                _self.browserData.range = true;
              } else if (_self.giftStrategyAddVO.range == 'GOODS_TARGET') {
                _self.browserData.range = false;
              }
              _self.getDetailGoodsData(_self.giftStrategyAddVO.goodsIncludedSkus, _self.giftStrategyAddVO.goodsIncludedGroups, _self.goodsIncludedData, 'goodsIncludedIds', 'rangeTypeShow');
              _self.getDetailGoodsData(_self.giftStrategyAddVO.goodsExcludedSkus, _self.giftStrategyAddVO.goodsExcludedGroups, _self.goodsExcludedData, 'goodsExcludedIds', 'rangeTypeShow');
              // 满赠*级条件
              _self.giftStrategyAddVO.levels.forEach(function (item, i) {
                _self.$set(item, 'giftStrategyTypeShow', _self.browserData.newLevel.giftStrategyTypeShow);
                for (var n in item.giftStrategyTypeShow) {
                  if (item[n]) {
                    item.giftStrategyTypeShow[n] = n;
                  }
                }
                // 满赠*级条件 详情
                item.details.forEach(function (itemDetail, j) {
                  // console.log(i, j);
                  // console.log(_self.$refs[searchGoodsOrGroup_0_1]);
                  // if (typeof itemDetail.goodsGroup == 'undefined') {
                  //   _self.$refs['searchGoodsOrGroup_'+i+'_'+j][0].key =itemDetail.sku.skuName;
                  // } else {
                  //   _self.$refs['searchGoodsOrGroup_'+i+'_'+j][0].key = itemDetail.goodsGroup.goodsGroupName;
                  // }
                  _self.$set(itemDetail, 'isEdit', false);
                  _self.$set(itemDetail, 'isNew', false);  // 是否是新加的detail
                  // 将suk或goodsGroup 转换成 sukIds或goodsGroupIds
                  if (itemDetail.goodsGroup) {
                    itemDetail.goodsGroupId = itemDetail.goodsGroup.goodsGroupId;
                    delete itemDetail.goodsGroup;
                  } else if (itemDetail.sku) {
                    itemDetail.skuId = itemDetail.sku.skuId;
                    delete itemDetail.sku;
                  }
                });
              });
              // 复制过来的赠品策略：命名和生效时间为空
              if (_self.$route.params.copy) {
                _self.giftStrategyAddVO.giftStrategyName = '';
                _self.giftStrategyAddVO.startTime = '';
                _self.giftStrategyAddVO.endTime = '';
              }
            }
          }
        });
      }
    },
    getDetailGoodsData(val1, val2, selecteds, str, type) {
      if (val1.length || val2.length) {
        this.browserData[type][str] = str;
        if (val1.length) {
          val1.forEach(function (item, i) {
            selecteds.selecteds.push({
              goodsCode: item.skuCode,
              goodsId: item.skuId,
              goodsName: item.skuName,
              goodsType: 'SKU'
            });
          });
        }
        if (val2.length) {
          val2.forEach(function (item, i) {
            selecteds.selecteds.push({
              goodsCode: item.goodsGroupCode,
              goodsId: item.goodsGroupId,
              goodsName: item.goodsGroupName,
              goodsType: 'GOODS_GROUP'
            });
          });
        }
      }
    },
    statusCheck () {  // 根据状态判断生效时间的设置
      let statusCheck = true;
      let cur_time = new Date().getTime();
      let start_time = new Date(this.giftStrategyAddVO.startTime).getTime();
      let end_time = new Date(this.giftStrategyAddVO.endTime).getTime();
      if (!start_time || !end_time) {
        statusCheck = false;
        layer.msg('生效开始时间和生效结束时间不能为空', {time: 2000});
      } else if (this.$route.params.status == 'NOT_START') {  // 未开始
        if (start_time > end_time) {  // 开始时间迟于结束时间
          statusCheck = false;
          layer.msg('生效开始时间不能迟于生效结束时间', {time: 2000});
        } else if (start_time < cur_time) {  // 开始时间先于当前时间
          statusCheck = false;
          layer.msg('生效开始时间不能先于当前时间', {time: 2000});
        }
      } else if (this.$route.params.status == 'IN_EFFECT') {  // 生效中
        if (cur_time > end_time) {  // 开始时间迟于结束时间
          statusCheck = false;
          layer.msg('生效结束时间不能先于当前时间', {time: 2000});
        }
      }
      console.log(statusCheck);
      return statusCheck;
    },
    ajaxCheck () {
      let isAjax = true;
      if (this.statusCheck ()) {
        if (!this.giftStrategyAddVO.shopIds.length) {
          isAjax = false;
          layer.msg('店铺不能为空', {time: 2000});
        } else {
          this.giftStrategyAddVO.levels.forEach(function (item, i) {
            let giftStrategyTypeShow_item = [];
            for (var i in item.giftStrategyTypeShow) {
              if (item.giftStrategyTypeShow[i] === '') {
                giftStrategyTypeShow_item.push(false);
              }
            }
            if (giftStrategyTypeShow_item.length === 4) {
              isAjax = false;
              layer.msg('满赠*级条件至少选一项', {time: 2000});
            }
            item.details.forEach(function (itemDetail, j) {
              if (typeof itemDetail.groupNumber == 'undefined') {
                isAjax = false;
              }
            });
          });
        }
      } else {
        isAjax = false;
      }
      return isAjax;
    },
    giftStrategyModify () {
      const _self = this;
      _self.addOrModify();
      if (_self.ajaxCheck()) {
        http({
          instance: _self,
          url: api.giftStrategyModify,
          type: 'post',
          data: {
            data: _self.giftStrategyAddVO,
          },
          success (res) {
            if (res.data) {
              layer.msg('修改成功', {time: 2000});
              _self.getGiftStrategyDetail();
            }
          }
        });
      }
    },
    addOrModify () {
      const _self = this;
      _self.getData(_self.warehouseData.selecteds, 'warehouseIds', 'warehouseId');
      _self.getData(_self.distributorData.selecteds, 'distributorIds', 'id');
      _self.getData(_self.customCatIncludedsData.selecteds, 'customCatIncludedIds', 'id');
      _self.getData(_self.customCatExcludedsData.selecteds, 'customCatExcludedIds', 'id');
      _self.getData(_self.goodsIncludedData.selecteds, 'goodsIncludedSkuIds','goodsId', 'goodsType', 'goodsIncludedGroupIds');
      _self.getData(_self.goodsExcludedData.selecteds, 'goodsExcludedSkuIds','goodsId', 'goodsType', 'goodsExcludedGroupIds');
      _self.getData(_self.goodsOrGroupData.selecteds, 'onceGoodsSkuIds','goodsId', 'goodsType', 'onceGoodsGroupIds');
      _self.getData(_self.goodsOrGroupAllData.selecteds, 'onceGoodsSkuIds','goodsId', 'goodsType', 'onceGoodsGroupIds');
      _self.getData(_self.brandIncludedData.selecteds, 'brandIncludedIds', 'id');
      _self.getData(_self.brandExcludedData.selecteds, 'brandExcludedIds', 'id');
    },
    getData (selecteds, val1, val2, val3, val4) {
      if (val3) {
        for (var i in selecteds) {
          if (selecteds[i][val3] == 'SKU') {
            this.giftStrategyAddVO[val1].push(selecteds[i][val2]);
          } else if (selecteds[i][val3] == 'GOODS_GROUP') {
            this.giftStrategyAddVO[val4].push(selecteds[i][val2]);
          }
        }
      } else {
        this.giftStrategyAddVO[val1] = [];
        for (var i in selecteds) {
          this.giftStrategyAddVO[val1].push(selecteds[i][val2]);
        }
      }
    },
    giftStrategyAdd () {
      const _self = this;
      _self.addOrModify();
      if (_self.ajaxCheck()) {
        _self.giftStrategyAddVO.levels.forEach(function (item, i) {
          item.level = i + 1;  // set level
          // 删除不用传到后台的字段
          delete item.giftStrategyType;
          delete item.giftStrategyTypeShow;
          item.details.forEach(function (itemDetail, j) {
            delete itemDetail.isEdit;
          });
        });
        http({
          instance: _self,
          url: api.giftStrategyAdd,
          type: 'post',
          data: {
            data: _self.giftStrategyAddVO,
          },
          success (res) {
            if (res.success) {
              layer.msg('新建成功', {time: 2000});
            }
          }
        });
      }
    },
    clearFun (itemDetail) {
      for (var n in itemDetail) {
        itemDetail[n] = '';
      }
    },
    editFun (i, j, itemDetail) {
      const _self = this;
      itemDetail.isEdit = true;
      this.item_i = i;
      this.itemDetail_j = j;
      this.giftStrategyAddVO.levels[this.item_i].details[this.itemDetail_j].sort = this.itemDetail_j + 1;
      this.giftStrategyAddVO.levels[this.item_i].details[this.itemDetail_j].giftStrategyLevelId = this.item_i + 1;
      if (_self.$route.params.id && _self.giftStrategyAddVO.levels[i].details[j].groupNumber) {
        itemDetail.isNew = true;
      }
    },
    saveIconFun (i, j, itemDetail) {
      const _self = this;
      itemDetail.isEdit = false;
      if (_self.$route.params.id) {
        if (itemDetail.isNew) {  // 修改详情保存
          _self.modifyDetail(api.giftStrategyLevelDetailModify, itemDetail);
        } else {
          itemDetail.giftStrategyId = _self.$route.params.id;
          itemDetail.giftStrategyLevelId = _self.giftStrategyAddVO.levels[i].details[0].giftStrategyLevel.giftStrategyLevelId;
          _self.modifyDetail(api.giftStrategyLevelDetailAdd, itemDetail);
        }
      }
    },
    deleteDetailFun (itemDetail) {
      this.modifyDetail(api.giftStrategyLevelDetailDelete, {giftStrategyLevelDetailId: itemDetail.giftStrategyLevelDetailId});
    },
    modifyDetail (api, data) {
      const _self = this;
      http({
        instance: _self,
        url: api,
        type: 'post',
        data: {
          data: data,
        },
        success (res) {
          if (res.data) {
            _self.getGiftStrategyDetail();
          }
        }
      });
    },
    addFun (i, j) {
      const _self = this;
      if ((this.giftStrategyAddVO.levels[i].details[j].skuId || this.giftStrategyAddVO.levels[i].details[j].goodsGroupId) && this.giftStrategyAddVO.levels[i].details[j].groupNumber && this.giftStrategyAddVO.levels[i].details[j].totalNumber) {
        this.giftStrategyAddVO.levels[i].details[j].isEdit = false;
        this.giftStrategyAddVO.levels[i].details.push(deepClone(this.browserData.newDetail));
      } else {
        layer.msg('请完整填写当前赠品', {time: 2000});
      }
    },
    addTargetOrderType () {
      this.browserData.targetOrderTypeShow[this.browserData.targetOrderType] = this.browserData.targetOrderType;
    },
    addRangeType () {
      this.browserData.rangeTypeShow[this.browserData.rangeType] = this.browserData.rangeType;
    },
    addGiftStrategyType (item, i) {
      this.giftStrategyAddVO.levels[i].giftStrategyTypeShow[item.giftStrategyType] = item.giftStrategyType;
    },
    getBuyers () {
      for (var i in this.browserData.buyers.split(',')) {
        this.giftStrategyAddVO.buyers.push(this.browserData.buyers.split(',')[i]);
      }
    },
    chooseEffectiveTimeStart (time) {
      this.giftStrategyAddVO.startTime = time.data;
    },
    chooseEffectiveTimeEnd (time) {
      this.giftStrategyAddVO.endTime = time.data;
    },

    deleteIconFun (i, data, val) {
      if (data == 'browserData') {
        this.giftStrategyAddVO.buyers.splice(i, 1);
      } else if (data == 'giftStrategyTypeShow') {
        this.giftStrategyAddVO.levels[i][data][val] = '';
      } else if (i === '') {
        this.browserData[data][val] = '';
      } else {
        data.selecteds.splice(i, 1);
      }
    },
    chooseRegion (val) {
      this.regionData.selected = val;
    },
    regionAddFun () {
      if (typeof this.regionData.selected.province == 'undefined') {
        this.regionData.selecteds.push({
          province: {
            regionId: -1,
          regionName: '全国'
          },
          city: '',
          region: ''
        });
      } else if (this.regionData.selected.province.regionId > -1) {
        this.regionData.selecteds.push(deepClone(this.regionData.selected));
      }
      this.$refs.region.regionDefault = {
        province: '',
        city: '',
        region: ''
      };
    },
    getShopSelecteds (data) {
      // this.giftStrategyAddVO.shopIds = [];
      for(var i in data) {
        this.giftStrategyAddVO.shopIds.push(data[i].shopId);
      }
    },
    getSelecteds (data) {
      this[data].selecteds.push(deepClone(this[data].selected));
    },
    goodsOrGroupAddFun (val) {
      if (val == 'all'){
        this.goodsOrGroupAllData.selecteds.push(deepClone(this.goodsOrGroupAllData.selected));
      } else if (val == 'goodsIncluded') {
        this.goodsIncludedData.selecteds.push(deepClone(this.goodsIncludedData.selected));
      } else if (val == 'goodsExcluded') {
        this.goodsExcludedData.selecteds.push(deepClone(this.goodsExcludedData.selected));
      } else if (val == 'customCatIncludeds') {
        this.customCatIncludedsData.selecteds.push(deepClone(this.customCatIncludedsData.selected));
      } else if (val == 'customCatExcludeds') {
        this.customCatExcludedsData.selecteds.push(deepClone(this.customCatExcludedsData.selected));
      } else if (val == 'brandIncluded') {
        this.brandIncludedData.selecteds.push(deepClone(this.brandIncludedData.selected));
      } else if (val == 'brandExcluded') {
        this.brandExcludedData.selecteds.push(deepClone(this.brandExcludedData.selected));
      } else {
        this.goodsOrGroupData.selecteds.push(deepClone(this.goodsOrGroupData.selected));
      }
    },
    selectedGoodsExcluded (data) {
      if (data.goodsId && data.goodsName) {
        this.goodsExcludedData.selected = data;
      } else {
        this.goodsExcludedData.selected = {};
      }
    },
    selectedGoodsIncluded (data) {
      if (data.goodsId && data.goodsName) {
        this.goodsIncludedData.selected = data;
      } else {
        this.goodsIncludedData.selected = {};
      }
    },
    selectedGoodsOrGroup (data) {
      if (data.goodsId && data.goodsName) {
        this.goodsOrGroupData.selected = data;
      } else {
        this.goodsOrGroupData.selected = {};
      }
    },
    selectedGoodsOrGroupAll (data) {
      if (data.goodsId && data.goodsName) {
        this.goodsOrGroupAllData.selected = data;
      } else {
        this.goodsOrGroupAllData.selected = {};
      }
    },
    searchCustomCategoryIncludeds (data, val) {
      console.log(data)
      if (data) {
        this.customCatIncludedsData.selected = {
          id: data,
          name: val
        };
      } else {
        this.customCatIncludedsData.selected = {};
      }
    },
    searchCustomCategoryExcludeds (data, val) {
      if (data) {
        this.customCatExcludedsData.selected = {
          id: data,
          name: val
        };
      } else {
        this.customCatExcludedsData.selected = {};
      }
    },
    selectBrandIncluded (id, name) {
      if (id) {
        this.brandIncludedData.selected = {
          id: id,
          name: name
        }
      }
    },
    selectBrandExcluded (id, name) {
      if (id) {
        this.brandExcludedData.selected = {
          id: id,
          name: name
        }
      }
    },
    selectedWarehouse (data) {
      if (data.warehouseId) {
        this.warehouseData.selected = {
          warehouseId: data.warehouseId, 
          warehouseName: data.warehouseName,
          type: data.warehouseType
        };
      } else {
        this.warehouseData.selected = {};
      }
    },
    selectedDistributor (data) {
      if (data.distributorId) {
        this.distributorData.selected = {
          id: data.distributorId,
          name: data.distributorName
        };
      } else {
        this.distributorData.selected = {};
      }
    },
    searchGoodsOrGroup (data) {
      if (data.goodsType == 'SKU') {
        this.$set(this.giftStrategyAddVO.levels[this.item_i].details[this.itemDetail_j], 'skuId', data.goodsId);
      } else if (data.goodsType == 'GOODS_GROUP') {
        this.$set(this.giftStrategyAddVO.levels[this.item_i].details[this.itemDetail_j], 'goodsGroupId', data.goodsId);
      } else {
        delete this.giftStrategyAddVO.levels[this.item_i].details[this.itemDetail_j].skuId;
        delete this.giftStrategyAddVO.levels[this.item_i].details[this.itemDetail_j].goodsGroupId;
      }
    }
  }
}
</script>

<style lang="sass">
.giftStrategyDetail {
  .deleteIcon {
    vertical-align: middle;
    color: #6A6A6A;
    cursor: pointer;
    font-size: 14px;
  }
  .giftTip {
    color: #999;
  }
  small {
    margin: 0;
  }
  small:before {
    top: 10px;
    left: 0px;
  }
  .addShopItem {
    margin-right: 10px;
  }
  .iptSm {
    display: inline-block;
    width: 80px;
  }
  .createBtn {
    margin: 20px 0;
    text-align: center;
  }
}
</style>