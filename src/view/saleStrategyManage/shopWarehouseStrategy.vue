<template>
	<div class="content-wrapper">
		<input type="hidden" v-model='currentI'>
		<input type="hidden" v-model='currentJ'>
		<input type="hidden" v-model='currentK'>
		<input type="hidden" v-model='needEdit'>
		<div class="popup-wrap form-inline" id="pw-region">
			<div class="popup-region">
				<p class="popup-title">
					地区设置
				</p>
				<div class="popup-main clear-fix">
		            <ul class="selected-region-list" v-if="selectedRegionList.length">
		                <li @click="clearRegion">清空<span class="btn-delete-region"><i class="fa fa-times"></i></span></li>
		                <li v-for="(r,index) in selectedRegionList">
		                    {{r.regionName}}
		                    <span class="btn-delete-region"><i class="fa fa-times" @click="deleteRegion(index)"></i></span>
		                </li>
		            </ul>
		            <div class="pcd-wrap clearfix">
		                <ul class="province-list">
		                	<li>
		                		<input type="checkbox" class="areaCheckbox" @click="checkChina($event)">
		                        <span class="areaTitle">全国</span>
		                	</li>
		                	<li>
		                		<input type="checkbox" class="areaCheckbox" @click="checkAllArea($event,'CENTRAL_CHINA')">
		                        <span class="areaTitle">华中</span>
		                	</li>
		                    <li v-for="cc in CENTRAL_CHINA">
		                        <input type="checkbox" class="CENTRAL_CHINA SINGLE_PROVINCE" :value="{'regionId':cc.regionId,'regionName':cc.regionName,'area':cc.area}" v-model="selectedRegionList">
		                        <span @click="searchCity(cc.regionId)">{{cc.regionName}}</span>
		                    </li>
		                    <li>
		                		<input type="checkbox" class="areaCheckbox" @click="checkAllArea($event,'EAST_CHINA')">
		                        <span class="areaTitle">华东</span>
		                	</li>
		                    <li v-for="ec in EAST_CHINA">
		                        <input type="checkbox" class="EAST_CHINA SINGLE_PROVINCE" :value="{'regionId':ec.regionId,'regionName':ec.regionName,'area':ec.area}" v-model="selectedRegionList">
		                        <span @click="searchCity(ec.regionId)">{{ec.regionName}}</span>
		                    </li>
		                    <li>
		                		<input type="checkbox" class="areaCheckbox" @click="checkAllArea($event,'GANG_AO_TAI')">
		                        <span class="areaTitle">港澳台</span>
		                	</li>
		                    <li v-for="gat in GANG_AO_TAI">
		                        <input type="checkbox" class="GANG_AO_TAI SINGLE_PROVINCE" :value="{'regionId':gat.regionId,'regionName':gat.regionName,'area':gat.area}" v-model="selectedRegionList">
		                        <span @click="searchCity(gat.regionId)">{{gat.regionName}}</span>
		                    </li>
		                    <li>
		                		<input type="checkbox" class="areaCheckbox" @click="checkAllArea($event,'NORTH_CHINA')">
		                        <span class="areaTitle">华北</span>
		                	</li>
		                    <li v-for="nc in NORTH_CHINA">
		                        <input type="checkbox" class="NORTH_CHINA SINGLE_PROVINCE" :value="{'regionId':nc.regionId,'regionName':nc.regionName,'area':nc.area}" v-model="selectedRegionList">
		                        <span @click="searchCity(nc.regionId)">{{nc.regionName}}</span>
		                    </li>
		                    <li>
		                		<input type="checkbox" class="areaCheckbox" @click="checkAllArea($event,'NORTH_EAST')">
		                        <span class="areaTitle">东北</span>
		                	</li>
		                    <li v-for="ne in NORTH_EAST">
		                        <input type="checkbox" class="NORTH_EAST SINGLE_PROVINCE" :value="{'regionId':ne.regionId,'regionName':ne.regionName,'area':ne.area}" v-model="selectedRegionList">
		                        <span @click="searchCity(ne.regionId)">{{ne.regionName}}</span>
		                    </li>
		                    <li>
		                		<input type="checkbox" class="areaCheckbox" @click="checkAllArea($event,'NORTH_WEST')">
		                        <span class="areaTitle">西北</span>
		                	</li>
		                    <li v-for="nw in NORTH_WEST">
		                        <input type="checkbox" class="NORTH_WEST SINGLE_PROVINCE" :value="{'regionId':nw.regionId,'regionName':nw.regionName,'area':nw.area}" v-model="selectedRegionList">
		                        <span @click="searchCity(nw.regionId)">{{nw.regionName}}</span>
		                    </li>
		                    <li>
		                		<input type="checkbox" class="areaCheckbox" @click="checkAllArea($event,'SOUTH_CHINA')">
		                        <span class="areaTitle">华南</span>
		                	</li>
		                    <li v-for="sc in SOUTH_CHINA">
		                        <input type="checkbox" class="SOUTH_CHINA SINGLE_PROVINCE" :value="{'regionId':sc.regionId,'regionName':sc.regionName,'area':sc.area}" v-model="selectedRegionList">
		                        <span @click="searchCity(sc.regionId)">{{sc.regionName}}</span>
		                    </li>
		                    <li>
		                		<input type="checkbox" class="areaCheckbox" @click="checkAllArea($event,'SOUTH_WEST')">
		                        <span class="areaTitle">西南</span>
		                	</li>
		                    <li v-for="sw in SOUTH_WEST">
		                        <input type="checkbox" class="SOUTH_WEST SINGLE_PROVINCE" :value="{'regionId':sw.regionId,'regionName':sw.regionName,'area':sw.area}" v-model="selectedRegionList">
		                        <span @click="searchCity(sw.regionId)">{{sw.regionName}}</span>
		                    </li>
		                </ul>
		                <ul class="city-list">
		                    <li v-for="c in cityListForPopup">
		                        <input type="checkbox" :value="{'regionId':c.regionId,'regionName':c.regionName,'area':c.area}" v-model="selectedRegionList">
		                        <span @click="searchDistrict(c.regionId)">{{c.regionName}}</span>
		                    </li>
		                </ul>
		                <ul class="district-list">
		                    <li v-for="d in districtListForPopup">
		                        <input type="checkbox" :value="{'regionId':d.regionId,'regionName':d.regionName,'area':d.area}" v-model="selectedRegionList">
		                        <span>{{d.regionName}}</span>
		                    </li>
		                </ul>
		            </div>
	            </div>
	            <div class="popup-footer">
	            	<template v-if="editRegionType == 'default'">
						<button class="btn btn-sm btn-primary" @click="confirmDefaultRegions"><i class="fa fa-check"></i>保存</button>
						<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
					</template>
					<template v-if="editRegionType == 'cover'">
						<button class="btn btn-sm btn-primary" @click="confirmCoverRegions"><i class="fa fa-check"></i>保存</button>
						<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
					</template>
					<template v-if="editRegionType == 'coverExclude'">
						<button class="btn btn-sm btn-primary" @click="confirmCoverExcludeRegions"><i class="fa fa-check"></i>保存</button>
						<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
					</template>
					<template v-if="editRegionType == 'defaultExclude'">
						<button class="btn btn-sm btn-primary" @click="confirmDefaultExcludeRegions"><i class="fa fa-check"></i>保存</button>
						<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
					</template>
	            </div>
	        </div>
		</div>
		<div class="popup-wrap form-inline" id="pw-add-warehouse">
			<div class="popup-content">
				<p class="popup-title">
					添加仓库
				</p>
				<div class="popup-main clearfix">
					<div class="col col-md-12">
						<div class="form-group">
							<search-warehouse id="searchWarehouse" placeholder="仓库 ( 模糊搜索 )" @selected="selectedWarehouse"></search-warehouse>
			                <input type="hidden" id="hidden-addWarehouseTempId" v-model="addWarehouseTempId">
			                <button class="btn btn-sm btn-primary" @click="addWarehouse"><i class="fa fa-plus"></i>添加</button>
		                </div>
		                <ul class="selected-item-list" v-if="addWarehouseList.length">
		                	<li>清空<span class="btn-delete-item" @click="clearWarehouse"><i class="fa fa-times"></i></span></li>
		                	<li v-for="(warehouse,index) in addWarehouseList">
	                            {{warehouse.warehouseName}}
	                            <span class="btn-delete-item" @click="deleteWarehouse(index)"><i class="fa fa-times"></i></span>
	                        </li>
		                </ul>
	                </div>
                </div>
                <div class="popup-footer">
                	<button class="btn btn-sm btn-primary" @click="confirmAddWarehouse"><i class="fa fa-check"></i>保存</button>
					<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
                </div>
			</div>
		</div>
		<div class="popup-wrap form-inline" id="pw-add-shipping">
			<div class="popup-content">
				<p class="popup-title">
					添加快递
				</p>
				<div class="popup-main clearfix">
					<div class="col col-md-12">
						<div class="form-group">
							<select id="searchShipping" class="form-control input-sm" v-model="addShippingTempId">
								<option value="">-- 请选择 --</option>
								<option v-for="shipping in shippingListByWarehouseId" :value="shipping.shippingId">{{shipping.shippingName}}</option>
							</select>
							<!-- <search-shipping id="searchShipping" placeholder="快递 ( 模糊搜索 )" @selected="selectedShipping"></search-shipping>
			                <input type="hidden" id="hidden-addShippingTempId" v-model="addShippingTempId"> -->
			                <button class="btn btn-sm btn-primary" @click="addShipping"><i class="fa fa-plus"></i>添加</button>
		                </div>
		                <ul class="selected-item-list" v-if="addShippingList.length">
		                	<li>清空<span class="btn-delete-item" @click="clearShipping"><i class="fa fa-times"></i></span></li>
		                	<li v-for="(shipping,index) in addShippingList">
	                            {{shipping.shippingName}}
	                            <span class="btn-delete-item" @click="deleteShipping(index)"><i class="fa fa-times"></i></span>
	                        </li>
		                </ul>
	                </div>
                </div>
                <div class="popup-footer">
                	<button class="btn btn-sm btn-primary" @click="confirmAddShipping"><i class="fa fa-check"></i>保存</button>
					<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
                </div>
			</div>
		</div>
		<div class="popup-wrap form-inline" id="pw-shop-group">
			<div class="popup-content">
				<p class="popup-title">
					添加店铺集合
				</p>
				<div class="popup-main clearfix">
					<div class="col col-md-12">
						<div class="form-group">
	                        <select multiple="multiple" class="form-control input-sm" id="shopGroupSelect">
	                            <option v-for="s in availableShopList" :value="s.shopId">{{s.shopName}}</option>
	                        </select>
	                    </div>
	                </div>
                </div>
                <div class="popup-footer">
                	<button class="btn btn-sm btn-primary" @click="confirmShopGroup"><i class="fa fa-check"></i>保存</button>
					<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
                </div>
			</div>
		</div>
		<div class="popup-wrap form-inline" id="pw-shop-this">
			<div class="popup-content">
				<p class="popup-title">
					添加店铺
				</p>
				<div class="popup-main clearfix">
					<div class="col col-md-12">
						<div class="form-group">
	                        <select multiple="multiple" class="form-control input-sm" id="shopThisSelect">
	                            <option v-for="s in availableShopList" :value="s.shopId">{{s.shopName}}</option>
	                        </select>
	                    </div>
	                </div>
                </div>
                <div class="popup-footer">
                	<button class="btn btn-sm btn-primary" @click="confirmShopThis"><i class="fa fa-check"></i>保存</button>
					<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
                </div>
			</div>
		</div>
		<div class="popup-wrap form-inline" id="pw-copy-strategy">
			<div class="popup-content">
				<p class="popup-title">
					复制策略
				</p>
				<div class="popup-main clearfix">
					<div class="col col-md-12">
						<div class="form-group">
	                        <select multiple="multiple" class="form-control input-sm" id="shopCopySelect">
	                            <option v-for="s in availableShopList" :value="s.shopId">{{s.shopName}}</option>
	                        </select>
	                    </div>
	                </div>
                </div>
                <div class="popup-footer">
                	<button class="btn btn-sm btn-primary" @click="confirmCopyStrategy"><i class="fa fa-check"></i>保存</button>
					<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
                </div>
			</div>
		</div>
		<div class="content-header">
			<ol class="breadcrumb">
                <li><a><i class="fa fa-desktop"></i>店铺</a></li>
                <li class="active">店铺选仓策略</li>
                <li class="breadbtn">
                	<button v-if="!needEdit" class="btn btn-sm btn-primary" @click="toggleEditStatus"><i class="fa fa-edit"></i>编辑</button>
					<button v-if="needEdit" class="btn btn-sm btn-default" @click="toggleEditStatus"><i class="fa fa-reply"></i>取消</button>	
                </li>
            </ol>
		</div>
		<div class="content form-inline">
			<div class="box box-primary no-border-top" style="min-width:960px;">
                <div class="box-body">
                    <table class="table" style="min-width:960px;">
                        <thead>
                            <th style="width:150px;">店铺 ( 集合 )</th>
                            <th style="width:150px;">发货仓库 ( 默认 )</th>
                            <th style="width:200px;">仓库默认区域</th>
                            <th style="width:200px;">仓库覆盖区域</th>
                            <!-- <th style="">操作</th> -->
                            <th style="width:150px;">可用快递 ( 默认 )</th>
                            <th style="width:200px;">默认排除区域</th>
                            <th style="width:200px;">覆盖排除区域</th>
                        </thead>
                        <tbody>
                        	<template v-for="(strategy,i) in shopWarehouseStrategyList">
                        		<template v-if="strategy.transformWarehouseConfigs.length >= 1">
	                        		<template v-for="(wConfig,j) in strategy.transformWarehouseConfigs">
	                        			<template v-if="wConfig.transformShippingConfigs.length >= 1">
		                        			<template v-for="(sConfig,k) in wConfig.transformShippingConfigs">
				                                <tr>
				                                  	<td v-if="k == 0 && j ==0" :rowspan="computedFirstRowspan[i]">
				                                  		<p class="fa-add">
				                                  			<i class="fa fa-plus-square-o" title="添加店铺" v-if="needEdit" @click="addThisShop(i)"></i>
				                                  			<i class="fa fa-copy" title="复制策略" v-if="needEdit" @click="copyStrategy(i)"></i>
				                                  		</p>
				                                  		<template v-if="strategy.shops.length">
					                                    <p v-for="(shop,si) in strategy.shops">
					                                      	{{shop.shopName}}
					                                      	<i v-if="needEdit" class="fa fa-minus-square-o" @click="deleteThisShop(i,si)"></i>
					                                    </p>
					                                    </template>
					                                    <label class="radio-wrap" v-if="needEdit">
					                                    	<input type="radio" value="DEFAULT" v-model="strategy.chooseWarehouseType">
					                                    	<span>默认选仓</span>
					                                    </label></br>
		       											<label class="radio-wrap" v-if="needEdit">
		       												<input type="radio" value="BEST" v-model="strategy.chooseWarehouseType">
		       												<span>全局最优</span>
		       											</label></br>
		       											<label class="radio-wrap" v-if="needEdit">
		       												<input type="radio" value="SHIPPING_BEST" v-model="strategy.chooseWarehouseType">
		       												<span>快递最优</span>
		       											</label>
				                                  	</td>
				                        			<td v-if="k == 0" :rowspan="wConfig.transformShippingConfigs.length || 1">
				                        				<template v-if="j==0">
					                        				<p class="fa-add">
				                        						<i class="fa fa-plus-square-o" title="添加仓库" v-if="needEdit" @click="addThisWarehouse(i)"></i>
				                        					</p>
				                        				</template>
				                        				<p>
				                        					{{wConfig.warehouse.warehouseName}}
				                        					<i v-if="needEdit" class="fa fa-minus-square-o" v-if="wConfig.warehouse.warehouseName" @click="deleteThisWarehouse(i,j)"></i>
				                        				</p>
				                        			</td>
				                        			<td v-if="k == 0" :rowspan="wConfig.transformShippingConfigs.length || 1">
				                        				<p class="edit-region">
				                        					<i class="fa fa-edit" v-if="needEdit" title="编辑仓库默认区域" @click="editDefaultRegions(i,j)"></i>
				                        				</p>
				                        				<template v-if="wConfig.defaultRegions.length">
				                        				<span v-for="dr in wConfig.defaultRegions">{{dr.regionName}} , </span>
				                        				</template>
				                        			</td>
				                        			<td v-if="k == 0" :rowspan="wConfig.transformShippingConfigs.length || 1">
				                        				<p class="edit-region">
				                        					<i class="fa fa-edit" v-if="needEdit" title="编辑仓库覆盖区域" @click="editCoverRegions(i,j)"></i>
				                        				</p>
				                        				<template v-if="wConfig.coverRegions.length">
				                        				<span v-for="cr in wConfig.coverRegions">{{cr.regionName}} , </span>
				                        				</template>
				                        			</td>
				                        			<!-- <td v-if="k == 0" :rowspan="wConfig.transformShippingConfigs.length || 1">
				                        				<button class="btn-ghost success" v-if="needEdit" @click="addThisShippings(i,j)">添加快递</button>
				                        			</td> -->
				                        			<td>
				                        				<template v-if="k==0">
				                        					<p class="fa-add">
				                        						<i class="fa fa-plus-square-o" title="添加快递" v-if="needEdit" @click="addThisShippings(i,j,wConfig.warehouse.warehouseId)"></i>
				                        					</p>
				                        				</template>
				                        				<label class="radio-wrap">
					                                    	<input type="radio" :value="sConfig.shipping.shippingId" v-model="wConfig.defaultShippingId" v-if="needEdit">
					                                    	<span>{{sConfig.shipping.shippingName}} <span v-if="sConfig.shipping.shippingId == wConfig.defaultShippingId">( 默认 )</span></span>
					                                    </label>
				                        				<i class="fa fa-minus-square-o" v-if="needEdit" @click="deleteThisShipping(i,j,k)"></i>
				                        			</td>
				                        			<td>
				                        				<p class="edit-region">
				                        					<i class="fa fa-edit" v-if="needEdit" title="编辑默认排除区域" @click="editDefaultExcludeRegions(i,j,k)"></i>
				                        				</p>
				                        				<template v-if="sConfig.defaultExcludeRegions.length">
				                        				<span v-for="er in sConfig.defaultExcludeRegions">
				                        					{{er.regionName}} , 
				                        				</span>
				                        				</template>
				                        			</td>
				                        			<td :class="'lastTd'+i">
				                        				<p class="edit-region">
				                        					<i class="fa fa-edit" v-if="needEdit" title="编辑覆盖排除区域" @click="editCoverExcludeRegions(i,j,k)"></i>
				                        				</p>
				                        				<template v-if="sConfig.coverExcludeRegions.length">
				                        				<span v-for="er in sConfig.coverExcludeRegions">
				                        					{{er.regionName}} , 
				                        				</span>
				                        				</template>
				                        			</td>
				                                </tr>
			                                </template>
		                                </template>
		                                <template v-else>
		                                	<tr>
			                                  	<td v-if="j ==0" :rowspan="computedFirstRowspan[i]">
			                                  		<p class="fa-add">
			                                  			<i class="fa fa-plus-square-o" title="添加店铺" v-if="needEdit" @click="addThisShop(i)"></i>
			                                  			<i class="fa fa-copy" title="复制策略" v-if="needEdit" @click="copyStrategy(i)"></i>
			                                  		</p>
			                                  		<template v-if="strategy.shops.length">
				                                    <p v-for="(shop,si) in strategy.shops">
				                                      {{shop.shopName}}
				                                      	<i class="fa fa-minus-square-o" v-if="needEdit" @click="deleteThisShop(i,si)"></i>
				                                    </p>
				                                    </template>
				                                    <label class="radio-wrap" v-if="needEdit">
				                                    	<input type="radio" value="DEFAULT" v-model="strategy.chooseWarehouseType">
				                                    	<span>默认选仓</span>
				                                    </label></br>
	       											<label class="radio-wrap" v-if="needEdit">
	       												<input type="radio" value="BEST" v-model="strategy.chooseWarehouseType">
	       												<span>全局最优</span>
	       											</label></br>
	       											<label class="radio-wrap" v-if="needEdit">
	       												<input type="radio" value="SHIPPING_BEST" v-model="strategy.chooseWarehouseType">
	       												<span>快递最优</span>
	       											</label>
			                                  	</td>
			                        			<td>
			                        				<template v-if="j==0">
			                        					<p class="fa-add">
			                        						<i class="fa fa-plus-square-o" title="添加仓库" v-if="needEdit" @click="addThisWarehouse(i)"></i>
			                        					</p>
			                        				</template>
			                        				<p>
			                        					{{wConfig.warehouse.warehouseName}}
			                        					<i class="fa fa-minus-square-o" v-if="wConfig.warehouse.warehouseName" v-if="needEdit" @click="deleteThisWarehouse(i,j)"></i>
			                        				</p>
			                        			</td>
			                        			<td>
			                        				<p class="edit-region">
			                        					<i class="fa fa-edit" v-if="needEdit" title="编辑仓库默认区域" @click="editDefaultRegions(i,j)"></i>
			                        				</p>
			                        				<template v-if="wConfig.defaultRegions.length">
			                        				<span v-for="dr in wConfig.defaultRegions">{{dr.regionName}} , </span>
			                        				</template>
			                        			</td>
			                        			<td>
			                        				<p class="edit-region">
			                        					<i class="fa fa-edit" v-if="needEdit" title="编辑仓库覆盖区域" @click="editCoverRegions(i,j)"></i>
			                        				</p>
			                        				<template v-if="wConfig.coverRegions.length">
			                        				<span v-for="cr in wConfig.coverRegions">{{cr.regionName}} , </span>
			                        				</template>
			                        			</td>
			                        			<!-- <td>
			                        				<button class="btn-ghost success" v-if="needEdit" @click="addThisShippings(i,j)">添加快递</button>
			                        			</td> -->
			                        			<td>
			                        				<p class="fa-add">
		                        						<i class="fa fa-plus-square-o" title="添加快递" v-if="needEdit" @click="addThisShippings(i,j,wConfig.warehouse.warehouseId)"></i>
		                        					</p>
			                        			</td>
			                        			<td></td>
			                        			<td :class="'lastTd'+i"></td>
			                                </tr>
		                                </template>
	                        		</template>
                        		</template>
                        		<template v-else>
                        			<tr>
                        				<td>
                        					<p class="fa-add">
                        						<i class="fa fa-plus-square-o" title="添加店铺" v-if="needEdit" @click="addThisShop(i)"></i>
                        						<i class="fa fa-copy" title="复制策略" v-if="needEdit" @click="copyStrategy(i)"></i>
                        					</p>
	                                  		<template v-if="strategy.shops.length">
		                                    <p v-for="(shop,si) in strategy.shops">
		                                      	{{shop.shopName}}
		                                      	<i class="fa fa-minus-square-o" v-if="needEdit" @click="deleteThisShop(i,si)"></i>
		                                    </p>
		                                    </template>
		                                    <label class="radio-wrap" v-if="needEdit">
		                                    	<input type="radio" value="DEFAULT" v-model="strategy.chooseWarehouseType">
		                                    	<span>默认选仓</span>
		                                    </label></br>
   											<label class="radio-wrap" v-if="needEdit">
   												<input type="radio" value="BEST" v-model="strategy.chooseWarehouseType">
   												<span>全局最优</span>
   											</label></br>
   											<label class="radio-wrap" v-if="needEdit">
   												<input type="radio" value="SHIPPING_BEST" v-model="strategy.chooseWarehouseType">
   												<span>快递最优</span>
   											</label>
	                                  	</td>
                        				<td>
                        					<p class="fa-add">
                        						<i class="fa fa-plus-square-o" title="添加仓库" v-if="needEdit" @click="addThisWarehouse(i)"></i>
                        					</p>
                        				</td>
                        				<td></td>
                        				<td></td>
                        				<td></td>
                        				<td></td>
                        				<!-- <td></td> -->
                        				<td :class="'lastTd'+i"></td>
                        			</tr>
                        		</template>
                        	</template>
                        	<tr>
                        		<td colspan="7">
                        			<button class="btn btn-sm btn-primary" style="display:block;margin-bottom:5px;" v-if="needEdit" @click="addShopGroup">
                        				<i class="fa fa-plus"></i>添加店铺集合
                        			</button>
                        			未添加店铺：<span v-for="s in availableShopList" class="available-shop">{{s.shopName}}</span>
                        		</td>
                        	</tr>
                        </tbody>
                    </table>
                </div>
                <div class="box-footer">
                	<button class="btn btn-sm btn-primary" v-if="needEdit" @click="submitAllData">
                		<i class="fa fa-check"></i>保存
                	</button>
                </div>
            </div>
		</div>
	</div>
</template>
<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import deepClone from '../../common/deepClone'

import searchWarehouse from '../../component/searchWarehouse'
// import searchShipping from '../../component/searchShipping'
import selectRegion from '../../component/selectRegion'

var VM = {}, tempStrategyData = {};
export default {
	mounted () {
		VM = this;
		initStyle();
		VM.getProvinceList();
		VM.getShopList();
		VM.getShopWarehouseStrategyList();
	},
	data () {
		return {
			needEdit : false,
    		formData : {
                data : {
                }
    		},
    		editRegionType : '',
    		provinceListForPopup : [],
            cityListForPopup: [],
            districtListForPopup : [],
            selectedRegionList : [],
    		computedFirstRowspan : [],
    		currentI : '',
    		currentJ : '',
    		currentK : '',
    		availableShopList : [],
    		popupSelectedShopList : [],
    		NORTH_CHINA : [],
    		SOUTH_CHINA : [],
    		CENTRAL_CHINA : [],
    		NORTH_WEST : [],
    		NORTH_EAST : [],
    		SOUTH_WEST : [],
    		EAST_CHINA : [],
    		GANG_AO_TAI : [],
    		shopWarehouseStrategyList : [],
    		rowspan : [],
    		addWarehouseTempId : '',
    		addWarehouseList : [],
    		addShippingTempId : '',
    		addShippingList : [],
    		shippingListByWarehouseId : []
		};
	},
	components : {
        searchWarehouse,
        // searchShipping,
        selectRegion
    },
    watch : {
    	shopWarehouseStrategyList : {
    		deep: true,
    		handler : function() {
    			VM.computedFirstRowspan = [];
	    		VM.$nextTick(function(){
	    			for (let i in VM.shopWarehouseStrategyList) {
						VM.computedFirstRowspan.push($('.lastTd'+i).length);
					}
	    		});
    		}
    	}
    },
	methods : {
		toggleEditStatus () {
			if (VM.needEdit) {
				layer.confirm('确定取消本次编辑吗', {
				  	btn: ['确定','取消'] //按钮
				}, function(index){
				  	VM.needEdit = false;
					VM.getShopWarehouseStrategyList();
					layer.close(index);
				}, function(index){
					layer.close(index);
				});
			} else {
				VM.needEdit = true;
			}
		},
		closePopup (e) {
            if ($(e.target).eq(0).hasClass('popup-wrap')) {
                $(e.target).eq(0).hide();
            }
        },
        cancelPopup () {
        	$('.popup-wrap').hide();
        },
        checkChina (e) {
        	if ($(e.target).prop('checked')) {
        		$('.areaCheckbox').prop('checked',true);
        		$('.SINGLE_PROVINCE').each(function(index){
	    			if (! $(this).prop('checked')) {
	    				$('.SINGLE_PROVINCE').eq(index).click();
	    			}
	    		});
        	} else {
        		$('.areaCheckbox').prop('checked',false);
        		$('.SINGLE_PROVINCE').each(function(index){
	    			if ($(this).prop('checked')) {
	    				$('.SINGLE_PROVINCE').eq(index).click();
	    			}
	    		});
        	}
        },
        checkAllArea (e,area) {
        	if ($(e.target).prop('checked')) {
        		$('.'+area).each(function(index){
	    			if (! $(this).prop('checked')) {
	    				$('.'+area).eq(index).click();
	    			}
	    		});
        	} else {
        		$('.'+area).each(function(index){
	    			if ($(this).prop('checked')) {
	    				$('.'+area).eq(index).click();
	    			}
	    		});
        	}
        },
		getShopList () {
            http({
                instance: VM,
                url: api.getShopList,
                type: 'post',
                success (res) {
                    VM.availableShopList = res.data;
                }
            });
        },
        getProvinceList () {
            http({
                instance: VM,
                url: api.regionList,
                type: 'post',
                data: {
                  data: {
                    parentId:'',
                    regionType: 1
                  }
                },
                hasLoading: false,
                success (res) {
                  if (res.code == 200) {
                    VM.provinceListForPopup = res.data;
                    for (let i in VM.provinceListForPopup) {
                    	VM[VM.provinceListForPopup[i].area].push({
            				regionId : VM.provinceListForPopup[i].regionId,
            				regionName : VM.provinceListForPopup[i].regionName,
            				area : VM.provinceListForPopup[i].area
            			});
                    }
                  }
                }   
            });
        },
        getShopWarehouseStrategyList () {
        	http({
                instance: VM,
                url: api.getShopWarehouseStrategyList,
                type: 'post',
                hasLoading: true,
                success (res) {
                    VM.shopWarehouseStrategyList = res.data;
                    VM.computAvailableShops();
                }
            });
        },
        computAvailableShops () {
        	let doingShopId = [];
            for (let i in VM.shopWarehouseStrategyList) {
            	for (let j in VM.shopWarehouseStrategyList[i].shops) {
            		doingShopId.push(VM.shopWarehouseStrategyList[i].shops[j].shopId);
            	}
            }
            console.log(doingShopId);
            
            for (let m in doingShopId) {
            	for (let n in VM.availableShopList) {
            		if (doingShopId[m] == VM.availableShopList[n].shopId) {
            			VM.availableShopList.splice(n,1);
            		}
            	}
            }
        },
        addThisWarehouse (i) {
        	VM.currentI = i;
        	VM.addWarehouseList = [];
        	VM.addWarehouseTempId = '';
        	$('#searchWarehouse').val('');
        	$('#pw-add-warehouse').show();
        },
        selectedWarehouse (data) {
            if (data.warehouseId) {
                VM.$set(VM,'addWarehouseTempId', data.warehouseId);
            } else {
                VM.$set(VM,'addWarehouseTempId', "");
            }
        },
        addWarehouse () {
        	let flag = true;
        	if (VM.addWarehouseTempId) {
        		//如果没有选过，则加入已选列表
        		for (let i in VM.addWarehouseList) {
        			if (VM.addWarehouseList[i].warehouseId == VM.addWarehouseTempId) {
        				flag = false;
        				VM.addWarehouseTempId = '';
		        		$('#searchWarehouse').val('');
        				alert('已经选过该仓库或该仓库已经在配置中');
        			}
        		}
        		//如果初始数据里没有，则加入已选列表
        		for (let j in VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs) {
        			if (VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs[j].warehouse.warehouseId == VM.addWarehouseTempId) {
        				flag = false;
        				VM.addWarehouseTempId = '';
		        		$('#searchWarehouse').val('');
        				alert('已经选过该仓库或该仓库已经在配置中');
        			}
        		}
        		if (flag) {
        			let templateWarehouse = {
		        		warehouseId : VM.addWarehouseTempId,
		        		warehouseName : $('#searchWarehouse').val()
		        	}
		        	VM.addWarehouseList.push(templateWarehouse);
		        	VM.addWarehouseTempId = '';
		        	$('#searchWarehouse').val('');
        		}
        	}
        },
        deleteWarehouse (index) {
            VM.addWarehouseList.splice(index,1);
        },
        clearWarehouse () {
            VM.addWarehouseList = [];
        },
        confirmAddWarehouse () {
        	for (let i in VM.addWarehouseList) {
        		VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs.push({
        			warehouse : {
						warehouseName : VM.addWarehouseList[i].warehouseName,
						warehouseId : VM.addWarehouseList[i].warehouseId,
					},
					defaultShippingId : '',
					defaultRegions : [],
					coverRegions : [],
					transformShippingConfigs : []
        		});
        	}
        	$('#pw-add-warehouse').hide();
        },
        deleteThisWarehouse (i,j) {
        	// if (VM.shopWarehouseStrategyList[i].transformWarehouseConfigs.length > 1) {
        	// 	VM.shopWarehouseStrategyList[i].transformWarehouseConfigs.splice(j,1);
        	// }
        	VM.shopWarehouseStrategyList[i].transformWarehouseConfigs.splice(j,1);
        },
        deleteThisShop (i,si) {
        	if (VM.shopWarehouseStrategyList[i].shops.length > 1) {
        		VM.availableShopList.push({
        			shopId : VM.shopWarehouseStrategyList[i].shops[si].shopId,
        			shopName : VM.shopWarehouseStrategyList[i].shops[si].shopName,
        		});
        		VM.shopWarehouseStrategyList[i].shops.splice(si,1);
        	} else {
        		if (confirm('当前操作将删除整条策略，确定吗？')) {
        			VM.availableShopList.push({
	        			shopId : VM.shopWarehouseStrategyList[i].shops[si].shopId,
	        			shopName : VM.shopWarehouseStrategyList[i].shops[si].shopName,
	        		});
	        		VM.shopWarehouseStrategyList.splice(i,1);
        		}
        	}
        },
        addThisShop (i) {
        	VM.currentI = i;
        	$('#pw-shop-this').show();
        },
        confirmShopThis () {
        	$('#shopThisSelect option').each(function(){
        		if ($(this).prop('selected')) {
	        		VM.shopWarehouseStrategyList[VM.currentI].shops.push({
	        			shopId : $(this).val(),
	        			shopName : $(this).text()
	        		});
	        	}
        	});
        	VM.computAvailableShops();
        	$('#pw-shop-this').hide();
        },
        copyStrategy (i) {
        	tempStrategyData = deepClone(VM.shopWarehouseStrategyList[i]);
        	$('#pw-copy-strategy').show();
        },
        confirmCopyStrategy () {
        	tempStrategyData.id = '';
        	tempStrategyData.shops = [];
        	console.log(tempStrategyData);
        	$('#shopCopySelect option').each(function(){
        		if ($(this).prop('selected')) {
	        		tempStrategyData.shops.push({
	        			shopId : $(this).val(),
	        			shopName : $(this).text()
	        		});
	        	}
        	});
        	if (tempStrategyData.shops.length >= 1) {
        		VM.shopWarehouseStrategyList.push(tempStrategyData);
        		VM.computAvailableShops();
        	}
        	$('#pw-copy-strategy').hide();
        },
        addShopGroup () {
        	$('#pw-shop-group').show();
        },
        confirmShopGroup () {
      //   	let mockData ={
    		// 	id : '',
    		// 	shops : [],
    		// 	chooseWarehouseType : '',
    		// 	transformWarehouseConfigs : [
    		// 		{
    		// 			warehouse : {
    		// 				warehouseName : '',
    		// 				warehouseId : '',
    		// 			},
    		// 			defaultRegions : [
    		// 				{
    		// 					regionName : '',
    		// 					regionId : ''
    		// 				}
    		// 			],
    		// 			coverRegions : [
    		// 				{
    		// 					regionName : '',
    		// 					regionId : ''
    		// 				}
    		// 			],
    		// 			transformShippingConfigs : [
    		// 				{
    		// 					shipping : {
    		// 						shippingName : '',
    		// 						shippingId : ''
    		// 					},
    		// 					coverExcludeRegions : [
    		// 						{
		    // 							regionName : '',
		    // 							regionId : ''
		    // 						}
    		// 					],
    		//					defaultExcludeRegions : [
    		// 						{
		    // 							regionName : '',
		    // 							regionId : ''
		    // 						}
    		// 					]
    		// 				}
    		// 			],
    		// 		}
    		// 	],
    		// };
    		let mockData = {
    			id : '',
    			shops : [],
    			chooseWarehouseType : 'BEST',
    			transformWarehouseConfigs : []
    		};
        	$('#shopGroupSelect option').each(function(){
        		if ($(this).prop('selected')) {
	        		mockData.shops.push({
	        			shopId : $(this).val(),
	        			shopName : $(this).text()
	        		});
	        	}
        	});
        	if (mockData.shops.length >= 1) {
        		VM.shopWarehouseStrategyList.push(mockData);
        		VM.computAvailableShops();
        	}
        	$('#pw-shop-group').hide();
        },
        editDefaultRegions (i,j) {
        	let selectedRegionList = [];
        	VM.editRegionType = 'default';
        	VM.currentI = i;
        	VM.currentJ = j;
        	for (let m in VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].defaultRegions) {
        		selectedRegionList.push({
        			regionId : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].defaultRegions[m].regionId,
        			regionName : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].defaultRegions[m].regionName,
        			area : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].defaultRegions[m].area,
        		});
        	}
        	VM.selectedRegionList = selectedRegionList;
        	$('.areaCheckbox').prop('checked',false);
        	$('#pw-region').show();
        },
        confirmDefaultRegions () {
        	VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs[VM.currentJ].defaultRegions = VM.selectedRegionList;
        	$('#pw-region').hide();
        },
        editCoverRegions (i,j) {
        	let selectedRegionList = [];
        	VM.editRegionType = 'cover';
        	VM.currentI = i;
        	VM.currentJ = j;
        	for (let m in VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].coverRegions) {
        		selectedRegionList.push({
        			regionId : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].coverRegions[m].regionId,
        			regionName : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].coverRegions[m].regionName,
        			area : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].coverRegions[m].area,
        		});
        	}
        	VM.selectedRegionList = selectedRegionList;
        	$('.areaCheckbox').prop('checked',false);
        	$('#pw-region').show();
        },
        confirmCoverRegions () {
        	VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs[VM.currentJ].coverRegions = VM.selectedRegionList;
        	$('#pw-region').hide();
        },
        editCoverExcludeRegions (i,j,k) {
        	let selectedRegionList = [];
        	VM.editRegionType = 'coverExclude';
        	VM.currentI = i;
        	VM.currentJ = j;
        	VM.currentK = k;
        	for (let m in VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].transformShippingConfigs[k].coverExcludeRegions) {
        		selectedRegionList.push({
        			regionId : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].transformShippingConfigs[k].coverExcludeRegions[m].regionId,
        			regionName : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].transformShippingConfigs[k].coverExcludeRegions[m].regionName,
        			area : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].transformShippingConfigs[k].coverExcludeRegions[m].area,
        		});
        	}
        	VM.selectedRegionList = selectedRegionList;
        	$('.areaCheckbox').prop('checked',false);
        	$('#pw-region').show();
        },
        editDefaultExcludeRegions (i,j,k) {
        	let selectedRegionList = [];
        	VM.editRegionType = 'defaultExclude';
        	VM.currentI = i;
        	VM.currentJ = j;
        	VM.currentK = k;
        	for (let m in VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].transformShippingConfigs[k].defaultExcludeRegions) {
        		selectedRegionList.push({
        			regionId : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].transformShippingConfigs[k].defaultExcludeRegions[m].regionId,
        			regionName : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].transformShippingConfigs[k].defaultExcludeRegions[m].regionName,
        			area : VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].transformShippingConfigs[k].defaultExcludeRegions[m].area,
        		});
        	}
        	VM.selectedRegionList = selectedRegionList;
        	$('.areaCheckbox').prop('checked',false);
        	$('#pw-region').show();
        },
        confirmCoverExcludeRegions () {
        	VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs[VM.currentJ].transformShippingConfigs[VM.currentK].coverExcludeRegions = VM.selectedRegionList;
        	$('#pw-region').hide();
        },
        confirmDefaultExcludeRegions () {
        	VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs[VM.currentJ].transformShippingConfigs[VM.currentK].defaultExcludeRegions = VM.selectedRegionList;
        	$('#pw-region').hide();
        },
        searchCity (regionId) {
            http({
                instance: VM,
                url: api.regionList,
                type: 'post',
                data: {
                  data: {
                    parentId: regionId,
                    regionType: 2
                  }
                },
                hasLoading: false,
                success (res) {
                  if (res.code == 200) {
                    VM.cityListForPopup = res.data;
                  }
                }   
            });
        },
        searchDistrict (regionId) {
            http({
                instance: VM,
                url: api.regionList,
                type: 'post',
                data: {
                  data: {
                    parentId: regionId,
                    regionType: 3
                  }
                },
                hasLoading: false,
                success (res) {
                  if (res.code == 200) {
                    VM.districtListForPopup = res.data;
                  }
                }   
            });
        },
        deleteRegion (index) {
            VM.selectedRegionList.splice(index,1);
        },
        clearRegion () {
            VM.selectedRegionList = [];
            $('.areaCheckbox').prop('checked',false);
        },
        addThisShippings (i,j,warehouseId) {
        	VM.currentI = i;
        	VM.currentJ = j;
        	VM.addShippingList = [];
        	VM.addShippingTempId = '';
        	$('#searchShipping').val('');
        	http({
                instance: VM,
                url: api.getShippingListByWarehouseId,
                type: 'post',
                data: {
                  	data: {
                    	warehouseId: warehouseId
                  	}
                },
                hasLoading: false,
                success (res) {
	                VM.shippingListByWarehouseId = res.data;
                }   
            });
        	$('#pw-add-shipping').show();
        },
        // selectedShipping (data) {
        //     if (data.shippingId) {
        //         VM.$set(VM,'addShippingTempId',data.shippingId);
        //     } else {
        //         VM.$set(VM,'addShippingTempId',"");
        //     }
        // },
        addShipping () {
        	let flag = true;
        	if (VM.addShippingTempId) {
        		//如果没有选过，则加入已选列表
        		for (let m in VM.addShippingList) {
        			if (VM.addShippingList[m].shippingId == VM.addShippingTempId) {
        				flag = false;
        				VM.addShippingTempId = '';
		        		$('#searchShipping').val('');
        				alert('已经选过该快递或该快递已经在配置中');
        			}
        		}
        		//如果初始数据里没有，则加入已选列表
        		for (let n in VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs[VM.currentJ].transformShippingConfigs) {
        			if (VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs[VM.currentJ].transformShippingConfigs[n].shipping.shippingId == VM.addShippingTempId) {
        				flag = false;
        				VM.addShippingTempId = '';
		        		$('#searchShipping').val('');
        				alert('已经选过该快递或该快递已经在配置中');
        			}
        		}
        		if (flag) {
        			let templateShipping = {
		        		shippingId : VM.addShippingTempId,
		        		shippingName : $('#searchShipping').find("option:selected").text()
		        	};
		        	VM.addShippingList.push(templateShipping);
		        	VM.addShippingTempId = '';
		        	$('#searchShipping').val('');
        		}
        	}
        },
        clearShipping () {
        	VM.addShippingList = [];
        },
        deleteShipping (index) {
        	VM.addShippingList.splice(index,1);
        },
        confirmAddShipping () {
        	for (let i in VM.addShippingList) {
        		if ( i == 0) {
        			VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs[VM.currentJ].defaultShippingId = VM.addShippingList[i].shippingId;
        		}
        		VM.shopWarehouseStrategyList[VM.currentI].transformWarehouseConfigs[VM.currentJ].transformShippingConfigs.push({
        			shipping : {
						shippingId : VM.addShippingList[i].shippingId,
						shippingName : VM.addShippingList[i].shippingName,
					},
					coverExcludeRegions : [],
					defaultExcludeRegions : []
        		});
        	}
        	$('#pw-add-shipping').hide();
        },
        deleteThisShipping (i,j,k) {
        	VM.shopWarehouseStrategyList[i].transformWarehouseConfigs[j].transformShippingConfigs.splice(k,1);
        },
        submitAllData () {
        	http({
                instance: VM,
                url: api.editShopWarehouseStrategy,
                type: 'post',
                data: {
                  data: VM.shopWarehouseStrategyList
                },
                hasLoading: true,
                success (res) {
                	VM.needEdit = false;
                  	layer.msg('操作成功', {
                        time: 1000
                    });
                }   
            });
        }
	}
}
	
</script>
<style scoped>
.form-group {
    margin-right: 20px;
    margin-bottom: 10px;
}
.radio-wrap, input[type='checkbox'] {
    cursor: pointer;
}
input[type='radio'] {
	position: relative;
	top: 2px;
}
.form-control {
	width: 200px !important;
}
.btn i.fa {
	margin-right: .5em;
}
.popup-wrap {
    display: none;
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
    top: 100px;
    left: 50%;
    width: 380px;
    min-height: 300px;
    margin-left: -230px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
}
.popup-content .col {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
.popup-title {
    text-align: left;
    border-bottom: 1px solid #d2d6de;
    padding:10px;
    font-size: 16px;
    margin-bottom: 0;
}
.popup-main {
    overflow:hidden;
    padding: 10px;
}
.popup-footer {
    width: 100%;
    text-align: right;
    padding: 10px;
    border-top: 1px solid #d2d6de;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #fff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.btn-ghost {
	display: inline-block;
	border:1px solid black;
	outline: none;
	cursor: pointer;
	color:black;
	background-color: #fff;
	border-radius: 3px;
	padding:5px 16px;
	font-size: 12px; 
}
.btn-ghost.success {
	border-color: #4cae4c;
	color: #4cae4c;
}
.btn-ghost.danger {
	border-color: #d43f3a;
	color: #d43f3a;
}
.btn-confirm-popup {
	margin:0 10px;
}
.selected-item-list {
    width: 100%;
    overflow: hidden;
}
.selected-item-list li {
    float: left;
    border:1px solid #ccc;
    margin-right:10px;
    margin-bottom:10px;
    padding:5px 0 5px 15px;
    border-radius: 3px;
}
.btn-delete-item {
    display: inline-block;
    width: 26px;
    text-align: center; 
    cursor: pointer;
    color: #666;
}
.available-shop {
	margin:0 5px;
}
.edit-region {
	font-size: 18px;
	color: #3c8dbc;
	margin:0 !important;
}
.edit-region .fa {
	cursor: pointer;
}
.popup-region {
    position: absolute;
    top: 100px;
    left: 390px;
    width: 616px;
    height: 500px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
    overflow-x: hidden;
    overflow-y: hidden;
}
.popup-region .popup-title {
    width: 100%;
    text-align: left;
    padding:10px;
    font-size: 16px;
    border-bottom: 1px solid #d2d6de;
}
.popup-region .popup-main {
    height: 410px;
    overflow-y: scroll;
}
.popup-region .popup-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #fff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.selected-region-list {
    width: 100%;
    border:1px solid #ccc;
    overflow: hidden;
    padding: 10px 10px 0 10px;
    margin-bottom: 10px;
    border-radius: 3px;
}
.selected-region-list li {
    float: left;
    border:1px solid #ccc;
    margin-right:10px;
    margin-bottom:10px;
    padding:2px 0 2px 6px;
    border-radius: 3px;
}
.btn-delete-region {
    display: inline-block;
    width: 26px;
    text-align: center; 
    cursor: pointer;
    color: #666;
}
.popup-region .province-list {
    float: left;
    margin-right: 15px;
    border:1px solid #ccc;
    width: 183px;
    height: 385px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 3px;
}
.popup-region .city-list {
    float: left;
    margin-right: 15px;
    border:1px solid #ccc;
    width: 183px;
    height: 385px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 3px;
}
.popup-region .district-list {
    float: left;
    border:1px solid #ccc;
    width: 183px;
    height: 385px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 3px;
}
.popup-region .province-list li,
.popup-region .city-list li,
.popup-region .district-list li {
    padding:5px 10px;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
}
.popup-region .province-list li:last-child,
.popup-region .city-list li:last-child,
.popup-region .district-list li:last-child {
    border-bottom: none;
}
.areaTitle {
	color: #3c8dbc;
	font-weight: 600;
}
.fa-add {
	font-size: 18px;
	color: #3c8dbc;
	margin:0 !important;
}
.fa-add .fa {
	cursor: pointer;
}
.fa-minus-square-o {
	color: #dd4b39;
	cursor: pointer;
}
.fa-copy {
	color: #4cae4c;
	font-size: 16px;
	position: relative;
	top: -1px;
	left: 5px;
}
.form-control#shopGroupSelect, .form-control#shopThisSelect, .form-control#shopCopySelect {
	width: 360px !important;
	height: 185px;
}
li.breadbtn {
    float:right;
    margin-right:15px;
}
li.breadbtn:before {
    display: none;
}
</style>