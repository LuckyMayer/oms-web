<template>
	<div class="content-wrapper">
		<input type="hidden" v-model="actType">
		<input type="hidden" v-model="editShippingType">
		<div class="popup-wrap form-inline" id="pw-add-edit-warehouse">
			<div class="popup-content">
				<div id="pw-add-shipping">
					<p class="popup-title">
						<template v-if="editShippingType == 'shipping'">
							添加可用快递
						</template>
						<template v-if="editShippingType == 'COD'">
							添加可用COD
						</template>
					</p>
					<div class="popup-main clearfix">
						<div class="col col-md-12">
							<div class="form-group">
								<search-shipping id="searchShipping" placeholder="快递 ( 模糊搜索 )" @selected="selectedShipping"></search-shipping>
				                <input type="hidden" id="hidden-addShippingTempId" v-model="addShippingTempId">
				                <button class="btn-ghost success" @click="addShipping">添加</button>
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
						<template v-if="editShippingType == 'shipping'">
							<button class="btn btn-sm btn-primary" @click="confirmAddShipping"><i class="fa fa-check"></i>保存</button>
							<button class="btn btn-sm btn-default" @click="cancelEditShipping"><i class="fa fa-reply"></i>取消</button>
						</template>
						<template v-if="editShippingType == 'COD'">
							<button class="btn btn-sm btn-primary" @click="confirmAddCOD"><i class="fa fa-check"></i>保存</button>
							<button class="btn btn-sm btn-default" @click="cancelEditShipping"><i class="fa fa-reply"></i>取消</button>
						</template>
					</div>
				</div>
				<p v-if="actType == 'edit'" class="popup-title">
					编辑仓库
				</p>
				<p v-if="actType == 'add'" class="popup-title">
					新增仓库
				</p>
				<div class="popup-main clearfix">
                    <div class="col col-md-12">
                    	<div class="form-group">
							<label>仓库名称</label>
							<input type="text" class="form-control input-sm" v-model="addEditData.data.warehouseName">
							<input type="hidden" v-model="addEditData.data.warehouseId">
		                </div>
		                <div class="form-group">
							<label>物理仓</label>
							<select class="form-control input-sm" v-model="addEditData.data.physicalWarehouseId">
								<option value="">-- 全部 --</option>
								<option v-for="option in physicalWarehouseList" :value="option.warehouseId">
									{{option.warehouseName}}
								</option>
							</select>
		                </div>
		                <div class="form-group">
							<label>所属区域</label>
							<select class="form-control input-sm" v-model="addEditData.data.warehouseArea">
								<option value="">-- 全部 --</option>
								<option value="CENTRAL_CHINA">华中</option>
								<option value="SOUTH_CHINA">华南</option>
								<option value="NORTH_CHINA">华北</option>
								<option value="NORTH_WEST">西北</option>
								<option value="NORTH_EAST">东北</option>
								<option value="SOUTH_WEST">西南</option>
								<option value="EAST_CHINA">华东</option>
								<option value="GANG_AO_TAI">港澳台</option>
							</select>
		                </div>
		                <div class="form-group">
							<label>仓库类型</label>
							<select class="form-control input-sm" v-model="addEditData.data.warehouseType">
								<option value="">-- 全部 --</option>
								<option value="CAINIAO">菜鸟</option>
								<option value="WMS">WMS</option>
								<option value="OMS">OMS仓库自己出库</option>
								<option value="VIRTUAL">虚拟仓</option>
								<option value="ON_WAY">调拨用到的在途仓</option>
								<option value="DIFF">调拨用到的差异仓</option>
								<option value="PHYSICAL">物理仓</option>
							</select>
		                </div>
		                <div class="form-group">
							<label>仓库渠道</label>
							<select class="form-control input-sm" v-model="addEditData.data.warehouseChannel">
								<option value="">-- 全部 --</option>
								<option value="OTHER">其他</option>
								<option value="USED">二手仓</option>
								<option value="DISTRIBUTION">分销仓</option>
								<option value="DOMESTIC_FLAGSHIP">国内旗舰店</option>
							</select>
		                </div>
		                <div class="form-group">
							<label>可用快递</label>
							<input type="text" class="form-control input-sm" id="availableShippingInput" readonly="true" @focus="editShipping">
							<input type="hidden" v-model="addEditData.data.availableShippingIds">
		                </div>
		                <div class="form-group">
							<label>可用COD</label>
							<input type="text" class="form-control input-sm" id="availableCODInput" readonly="true" @focus="editCOD">
							<input type="hidden" v-model="addEditData.data.availableCODIds">
		                </div>
		                <div class="form-group">
							<label>备注</label>
							<input type="text" class="form-control input-sm" v-model="addEditData.data.memo">
		                </div>
		                <div class="form-group">
	                        <label for="">省</label>
	                        <select-region placeholder="-- 省 --" :init="true" region-type="1" parent-id="" v-model="addEditData.data.province" @selected="selectedProvince"></select-region>
	                    </div>
	                    <div class="form-group">
	                        <label for="">市</label>
	                        <select-region placeholder="-- 市 --" :init="false" region-type="2" :parent-id="addEditData.data.province" v-model="addEditData.data.city" @selected="selectedCity"></select-region>
	                    </div>
	                    <div class="form-group">
	                        <label for="">区</label>
	                        <select-region placeholder="-- 区 --" :init="false" region-type="3" :parent-id="addEditData.data.city" v-model="addEditData.data.district" @selected="selectedDistrict"></select-region>
	                    </div>
	                    <div class="form-group">
							<label>详细地址</label>
							<input type="text" class="form-control input-sm" v-model="addEditData.data.address">
		                </div>
		                <div class="form-group">
							<label>联系人</label>
							<input type="text" class="form-control input-sm" v-model="addEditData.data.contactName">
		                </div>
		                <div class="form-group">
							<label>手机</label>
							<input type="text" class="form-control input-sm" v-model="addEditData.data.contactMobile">
		                </div>
		                <div class="form-group">
							<label>固话</label>
							<input type="text" class="form-control input-sm" v-model="addEditData.data.contactPhone">
		                </div>
                    </div>
                </div>
                <div class="popup-footer">
					<template v-if="actType == 'edit'">
						<button class="btn btn-sm btn-primary" @click="submitEdit"><i class="fa fa-check"></i>保存</button>
						<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
					</template>
					<template v-if="actType == 'add'">
						<button class="btn btn-sm btn-primary" @click="submitAdd"><i class="fa fa-check"></i>保存</button>
						<button class="btn btn-sm btn-default" @click="cancelPopup"><i class="fa fa-reply"></i>取消</button>
					</template>
				</div>
			</div>
		</div>
		<div class="content-header">
			<ol class="breadcrumb">
                <li><a><i class="fa fa-desktop"></i>系统</a></li>
                <li class="active">仓库建档</li>
                <li class="breadbtn">
                	<button class="btn btn-sm btn-primary" @click="addWarehouse">
						<i class="fa fa-plus"></i>新建仓库
					</button>
                </li>
            </ol>
		</div>
		<div class="content form-inline">
			<div class="box" style="min-width:960px;">
                <div class="box-body">
                    <table class="table" style="min-width:960px;">
                        <thead>
                            <th style="width:200px;">区域</th>
                            <th style="width:200px;">物理仓</th>
                            <th style="width:200px;">仓库类型</th>
                            <th style="width:200px;">仓库渠道</th>
                            <th style="width:200px;">逻辑仓</th>
                            <th style="width:200px;">可用快递</th>
                            <th style="width:200px;">可用COD</th>
                            <th style="width:200px;">操作</th>
                        </thead>
                        <tbody>
                        	<tr v-for="item in warehouseRecordList">
                        		<td>{{warehouseAreaRelation[item.warehouseArea]}}</td>
                        		<td><template v-if="item.physicalWarehouse">{{item.physicalWarehouse.warehouseName}}</template></td>
                        		<td>{{warehouseTypeRelation[item.warehouseType]}}</td>
                        		<td>{{warehouseChannelRelation[item.warehouseChannel]}}</td>
                        		<td>{{item.warehouseName}}</td>
                        		<td>
                        			<span v-for="s in item.availableShippings">{{s.shippingName}}</span>
                        		</td>
                        		<td>
                        			<span v-for="s in item.availableCODs">{{s.shippingName}}</span>
                        		</td>
                        		<td>
                        			<span class="btn-edit" @click="editWarehouse(item.warehouseId)">编辑</span>
                        			<span class="btn-disable" v-if="item.status == 'NORMAL'" @click="disableWarehouse(item.warehouseId)">停用</span>
                        			<span class="btn-enable" v-if="item.status == 'DELETED'" @click="enableWarehouse(item.warehouseId)">启用</span>
                        		</td>
                        	</tr>
                        </tbody>
                    </table>
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

import searchShipping from '../../component/searchShipping'
import selectRegion from '../../component/selectRegion'

var VM = {}, originalShippings = [], originalCODs = [];
export default {
	mounted () {
		VM = this;
		initStyle();
		VM.getWarehouseRecordList();
		VM.getPhysicalWarehouseList();
	},
	data () {
		return {
			actType : '',
			editShippingType : '',
			warehouseRecordList : [],
			physicalWarehouseList : [],
    		addShippingTempId : '',
    		addShippingList : [],
    		addEditData : {
    			data : {
    				warehouseId : '',
    				warehouseName : '',
    				physicalWarehouseId : '',
    				warehouseArea : '',
    				warehouseType : '',
    				warehouseChannel : '',
    				availableShippingIds : [],
    				availableCODIds : [],
    				province : '',
    				city : '',
    				district : '',
    				address : '',
    				contactName : '',
    				contactPhone : '',
    				contactMobile : '',
    				memo : ''
    			}
    		},
    		warehouseTypeRelation : {
    			CAINIAO : '菜鸟',
    			WMS : 'WMS',
    			OMS : 'OMS仓库自己出库',
    			VIRTUAL : '虚拟仓',
    			ON_WAY : '调拨用到的在途仓',
    			DIFF : '调拨用到的差异仓',
    			PHYSICAL : '物理仓'
    		},
    		warehouseAreaRelation : {
    			CENTRAL_CHINA : '华中',
    			SOUTH_CHINA : '华南',
    			NORTH_CHINA : '华北',
    			NORTH_WEST : '西北',
    			NORTH_EAST : '东北',
    			SOUTH_WEST : '西南',
    			EAST_CHINA : '华东',
    			GANG_AO_TAI : '港澳台'
    		},
    		warehouseChannelRelation : {
    			OTHER : '其他',
    			USED : '二手仓',
    			DISTRIBUTION : '分销仓',
    			DOMESTIC_FLAGSHIP : '国内旗舰店'
    		}
		};
	},
	components : {
        searchShipping,
        selectRegion
    },
	methods : {
		selectedProvince (data) {
        	VM.addEditData.data.city = '';
        	VM.addEditData.data.district = '';
        	VM.addEditData.data.province = data.data.regionId;
        	
        },
        selectedCity (data) {
        	VM.addEditData.data.district = '';
			VM.addEditData.data.city = data.data.regionId;
        },
        selectedDistrict (data) {
			VM.addEditData.data.district = data.data.regionId;
        },
		getWarehouseRecordList () {
			http({
                instance: VM,
                url: api.getWarehouseRecordList,
                type: 'post',
                hasLoading: true,
                success (res) {
	                VM.warehouseRecordList = res.data;
                }   
            });
		},
		getPhysicalWarehouseList () {
			http({
                instance: VM,
                url: api.getPhysicalWarehouseList,
                type: 'post',
                hasLoading: false,
                success (res) {
	                VM.physicalWarehouseList = res.data;
                }   
            });
		},
		addWarehouse () {
			VM.actType = 'add';
			VM.addEditData.data = {
				warehouseId : '',
				warehouseName : '',
				physicalWarehouseId : '',
				warehouseArea : '',
				warehouseType : '',
				warehouseChannel : '',
				availableShippingIds : [],
				availableCODIds : [],
				province : '',
				city : '',
				district : '',
				address : '',
				contactName : '',
				contactPhone : '',
				contactMobile : '',
				memo : ''
			};
			originalShippings = []; 
			originalCODs = [];
			$('#availableShippingInput').val('');
			$('#availableCODInput').val('');
			console.log(originalShippings);
			console.log(originalCODs);
			$('#pw-add-edit-warehouse').show();
		},
		editWarehouse (warehouseId) {
			http({
                instance: VM,
                url: api.getWarehouseDetail,
                type: 'post',
                data: {
                	data : {
                		warehouseId : warehouseId
                	}
                },
                hasLoading: true,
                success (res) {
                	VM.actType = 'edit';
	                VM.addEditData.data = {
	    				warehouseId : res.data.warehouseId,
	    				warehouseName : res.data.warehouseName,
	    				physicalWarehouseId : res.data.physicalWarehouse ? res.data.physicalWarehouse.warehouseId : null,
	    				warehouseArea : res.data.warehouseArea,
	    				warehouseType : res.data.warehouseType,
	    				warehouseChannel : res.data.warehouseChannel,
	    				availableShippingIds : [],
	    				availableCODIds : [],
	    				province : (res.data.province) ? res.data.province.regionId : '',
	    				city : (res.data.city) ? res.data.city.regionId : '',
	    				district : (res.data.district) ? res.data.district.regionId : '',
	    				address : res.data.address,
	    				contactName : res.data.contactName,
	    				contactPhone : res.data.contactPhone,
	    				contactMobile : res.data.contactMobile,
	    				memo : res.data.memo
	    			};
	    			originalShippings = []; 
					originalCODs = [];
					let shippingNames = [];
					let CODNames = [];
	    			for (let m in res.data.availableShippings) {
                		VM.addEditData.data.availableShippingIds.push(res.data.availableShippings[m].shippingId);
                		shippingNames.push(res.data.availableShippings[m].shippingName);
                		originalShippings.push({
                			shippingId : res.data.availableShippings[m].shippingId,
                			shippingName : res.data.availableShippings[m].shippingName
                		});
                	}
                	for (let n in res.data.availableCODs) {
                		VM.addEditData.data.availableCODIds.push(res.data.availableCODs[n].shippingId);
                		CODNames.push(res.data.availableCODs[n].shippingName);
                		originalCODs.push({
                			shippingId : res.data.availableCODs[n].shippingId,
                			shippingName : res.data.availableCODs[n].shippingName
                		});
                	}
                	$('#availableShippingInput').val(shippingNames);
					$('#availableCODInput').val(CODNames);
					console.log(originalShippings);
					console.log(originalCODs);
	    			$('#pw-add-edit-warehouse').show();
                }   
            });
		},
		disableWarehouse (warehouseId) {
			http({
                instance: VM,
                url: api.disableWarehouse,
                type: 'post',
                data: {
                	data : {
                		warehouseId : warehouseId
                	}
                },
                hasLoading: true,
                success (res) {
	                VM.getWarehouseRecordList();
	                layer.msg('停用成功',{time: 1000});
                }   
            });
		},
		enableWarehouse (warehouseId) {
			http({
                instance: VM,
                url: api.enableWarehouse,
                type: 'post',
                data: {
                	data : {
                		warehouseId : warehouseId
                	}
                },
                hasLoading: true,
                success (res) {
	                VM.getWarehouseRecordList();
	                layer.msg('启用成功',{time: 1000});
                }   
            });
		},
        cancelPopup () {
        	$('.popup-wrap').hide();
        },
        cancelEditShipping () {
        	$('#pw-add-shipping').hide();
        },
        selectedShipping (data) {
            if (data.shippingId) {
                VM.$set(VM,'addShippingTempId',data.shippingId);
            } else {
                VM.$set(VM,'addShippingTempId',"");
            }
        },
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
        		if (flag) {
        			let templateShipping = {
		        		shippingId : VM.addShippingTempId,
		        		shippingName : $('#searchShipping').val()
		        	};
		        	VM.addShippingList.push(templateShipping);
		        	VM.addShippingTempId = '';
		        	$('#searchShipping').val('');
        		}
        	}
        },
        clearShipping () {
        	VM.addShippingList = [];
        	if (VM.editShippingType == 'shipping') {
        		originalShippings = [];
        	}
        	if (VM.editShippingType == 'COD') {
        		originalCODs = [];
        	}
        },
        deleteShipping (index) {
        	VM.addShippingList.splice(index,1);
        },
        editShipping () {
        	VM.editShippingType = 'shipping';
        	VM.addShippingList = originalShippings;
        	$('#pw-add-shipping').show();
        },
        confirmAddShipping () {
        	let shippingNames = [];
        	VM.addEditData.data.availableShippingIds = [];
        	for (let i in VM.addShippingList) {
        		shippingNames.push(VM.addShippingList[i].shippingName);
        		VM.addEditData.data.availableShippingIds.push(VM.addShippingList[i].shippingId);
        	}
        	$('#availableShippingInput').val(shippingNames);
        	$('#pw-add-shipping').hide();
        },
        editCOD () {
        	VM.editShippingType = 'COD';
        	VM.addShippingList = originalCODs;
        	$('#pw-add-shipping').show();
        },
        confirmAddCOD () {
        	let CODNames = [];
        	VM.addEditData.data.availableCODIds = [];
        	for (let i in VM.addShippingList) {
        		CODNames.push(VM.addShippingList[i].shippingName);
        		VM.addEditData.data.availableCODIds.push(VM.addShippingList[i].shippingId);
        	}
        	$('#availableCODInput').val(CODNames);
        	$('#pw-add-shipping').hide();
        },
        submitAdd () {
        	http({
                instance: VM,
                url: api.addWarehouse,
                type: 'post',
                data: VM.addEditData,
                hasLoading: true,
                success (res) {
	                VM.getWarehouseRecordList();
	                layer.msg('新建成功',{time: 1000},function(){
	                	$('#pw-add-edit-warehouse').hide();
	                });
                }   
            });
        },
        submitEdit () {
        	http({
                instance: VM,
                url: api.updateWarehouse,
                type: 'post',
                data: VM.addEditData,
                hasLoading: true,
                success (res) {
	                VM.getWarehouseRecordList();
	                layer.msg('编辑成功',{time: 1000},function(){
	                	$('#pw-add-edit-warehouse').hide();
	                });
                }   
            });
        },
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
	width: 170px !important;
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
    width: 550px;
    margin-left: -300px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
}
.popup-title {
	text-align: left;
    border-bottom: 1px solid #d2d6de;
    padding:10px;
    font-size: 16px;
    margin-bottom: 0;
}
.popup-main {
    padding: 10px 10px 0 10px;
}
.popup-content .col {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
.popup-footer {
    width: 100%;
    text-align: right;
    padding: 10px;
    border-top: 1px solid #d2d6de;
}
#pw-add-edit-warehouse .popup-content label {
	width: 4.5em;
	text-align: right;
}
#pw-add-shipping {
	position: absolute;
	top: 0;
	right: -410px;
	width: 400px;
	min-height: 300px;
	background-color: #fff;
	border-radius: 5px;
	z-index: 999;
	display: none;
}
#pw-add-shipping .popup-main {
	height: 200px;
	overflow-y: auto;
}
#pw-add-shipping .popup-footer {
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
.btn-edit, .btn-enable, .btn-disable {
    cursor: pointer;
    margin-right: 5px;
}
.btn-edit {
    color: #337ab7;
}
.btn-enable {
    color: #4cae4c;
}
.btn-disable {
    color: #d9534f;
}
li.breadbtn {
    float:right;
    margin-right:15px;
}
li.breadbtn:before {
    display: none;
}
</style>