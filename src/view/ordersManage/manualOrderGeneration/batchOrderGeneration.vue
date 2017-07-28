<template>
    <div class="batch-order-generation clearfix">
       <div class="left-context">
	       <div class="upload-div">
	       		<form action="">
       				<input type="file" class="file">
       				<input type="text" class="fileField" placeholder="文件名.xls">
       				<input type="button" class="fileBtn" value="批量导入">
    				<button type="submit" class="btn btn-sm btn-primary uploadBtn">上传</button>
	    		</form>
	       </div>
	       <div class="col-md-12 no-padding form-horizontal">
	       		<div class="form-group">
	       			<label class="col-md-2 control-label">仓库名称</label>
	       			<div class="col-md-5 no-padding">
	       				<input type="text" class="input-sm form-control">
	       			</div>
	       			<div class="col-md-4">
	       				<button class="btn btn-sm btn-default">查询代码</button>
	       			</div>
	       		</div>
	       		<div class="form-group">
	       			<label class="col-md-2 control-label">快递方式</label>
	       			<div class="col-md-5 no-padding">
	       				<input type="text" class="input-sm form-control">
	       			</div>
	       			<div class="col-md-4">
	       				<button class="btn btn-sm btn-default">查询代码</button>
	       			</div>
	       		</div>
	       		<div class="form-group">
	       			<label class="col-md-2 control-label">币种代码</label>
	       			<div class="col-md-5 no-padding">
	       				<input type="text" class="input-sm form-control">
	       			</div>
	       			<div class="col-md-4">
	       				<!-- <button class="btn btn-sm btn-default">查询代码</button> -->
	       			</div>
	       		</div>
	       		<div class="form-group">
	       			<label class="col-md-2 control-label">省市区标准写法参考</label>
	       			<div class="col-md-10 no-padding">
						<component is="select-region" placeholder="省" region-type="1" parent-id=""  @selected="selectedProvince" required style="width: 24%; display: inline;"></component>
                    	<component v-if="address.provinceId" is="select-region" placeholder="市" region-type="2" :parent-id="address.provinceId" @selected="selectedCity" required style="width: 24%; display: inline;"></component>
                    	<component v-if="address.showDistrictSelect" is="select-region" placeholder="区" region-type="3" :parent-id="address.cityId" @selected="selectedDistrict" style="width: 24%; display: inline;"></component>
                    	<component v-if="address.showStreetSelect" is="select-region" placeholder="街道" region-type="4" :parent-id="address.districtId || address.cityId" @selected="selectedStreet" style="width: 24%; display: inline;"></component>	       				
	       			</div>
	       		</div>

	       		
	       </div>
    		
       		
       </div>
       <div class="right-context">
       		<div class="col-md-12 no-padding form-horizontal">
       			<div class="form-group">
       				<div class="col-md-5 no-padding">
       					<label class="col-md-4 control-label">录单文件名</label>
	       				<div class="col-md-8 no-padding">
	       					<input type="text" class="input-sm form-control">
	       				</div>
       				</div>
       				<div class="col-md-5 no-padding">
       					<label class="col-md-3 control-label">上传时间</label>
	       				<div class="col-md-8 no-padding">
	       					<component is="date-range-picker" id="upload-time" :needhms="true" @get_date="selectedTime" :start-time="searchData.startCreateTime" :end-time="searchData.endCreateTime"></component>
	       				</div>
       				</div>
       				<div class="col-md-2">
       					<button class="btn btn-info btn-sm">查询</button>
       				</div>
       			</div>
       			
       		</div>
       </div>
    </div>
</template>

<script>
import {getDateStr} from '../../../common/getDateStr'
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'
import dateRangePicker from '../../../component/dateRangePicker'
import selectRegion from '../../../component/selectRegion'

export default {
    data() {
    	return {
    		searchData: {
    			startCreateTime: '',
    			endCreateTime: ''
    		},
    		address: {
    			provinceId: '',
    			provinceName: '',
    			cityId: '',
    			cityName: '',
    			districtId: '',
    			districtName: '',
    			streetId: '',
    			streetName: '',
    			showStreetSelect: false,
    			showDistrictSelect: false,
    		}

    	}
    },
    components: {
		dateRangePicker,selectRegion
    },
    methods: {
    	selectedTime(data) {
			this.searchData.startCreateTime = data.start_time;
            this.searchData.endCreateTime = data.end_time;
    	},
        selectedProvince (data) {
        	this.address.provinceId = data.data.regionId;
        	this.address.provinceName = data.data.regionName;
        	this.address.cityId = "";
        	this.address.cityName = "";
        	this.address.districtId = "";
        	this.address.districtName = "";
        	this.address.streetId = "";       	
        	this.address.receiverDistrict = ""; 
        	this.address.showStreetSelect = false;
        	this.address.showDistrictSelect = false;       	
        	
        },
        selectedCity (data) {
        	this.address.cityId = data.data.regionId;	
        	this.address.cityName = data.data.regionName;
        	this.address.districtId = "";
        	this.address.districtName = "";
        	this.address.streetId = "";
        	this.address.receiverStreet = "";	
       		this.address.showDistrictSelect = true;
       		this.address.showStreetSelect = false;	
			
        },
        selectedDistrict (data) {
        	this.address.districtId = data.data.regionId
        	this.address.districtName = data.data.regionName;
        	this.address.streetId = "";
        	this.address.streetName = "";	
        	this.address.showStreetSelect = true;
        },
        selectedStreet (data) {
        	this.address.streetId = data.data.regionId
        	this.address.streetName = data.data.regionName;
        },
    }
}
</script>

<style scoped>
.batch-order-generation{
	padding:14px 14px;
	font-size:12px;
	color:#666666;
	font-weight: normal;
}
.left-context {
	width: 30%;
	min-width: 390px;
	float: left;
}
.upload-div {
	margin-bottom: 10px;
}
.right-context {
	width: 68%;
	/*min-width: 910px;*/
	float: left;
	padding-left: 10px;
}
.file {
	display: none;
}
.fileField {
	width:250px;
	color: #555;
	border: 1px solid #ccc;
	height: 28px;
}
.fileBtn {
	height: 28px;
	margin-top: -3px;
	margin-left: -4px;
	padding-left: 10px;
	padding-right: 10px;
	border-radius: 0px 3px 3px 0px;
	border: 1px solid #ccc;
	/*line-height: 28px;*/
	background-color:  #eee;
	vertical-align: middle;
}
.uploadBtn {
	height: 28px;
	margin-left: 10px;
	margin-top: -3px;
	text-align: center;
	vertical-align: middle;
}
.control-label {
	padding-left: 2px;
	padding-right: 6px;
}
</style>