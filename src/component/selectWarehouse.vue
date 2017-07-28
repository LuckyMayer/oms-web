
<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedWarehouse" @change="selectWarehouse" @click="clickWarehouse">
		<option value="">{{_selfPlaceholder}}</option>
		<option v-for="item in WarehouseList" :value="item.warehouseId">{{item.warehouseName}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
    mounted () {
        // if(this.shopId != undefined && this.shopId != ''){
        //     this.fetchWarehouseList();
        // }
    },
	props: ['partyId', 'placeholder', 'disabled', 'shopId', 'defaultWarehouseId', 'defaultWarehouseName'],
	data () {
        return {
            WarehouseList: [],
            selectedWarehouse: ''
        }
    },
    computed: {
        _selfPlaceholder () {
            return this.placeholder ||'=== 请选择仓库 ===';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        fetchWarehouseList () {
            const _self = this;
            http({
                instance: _self,
                url: api.getWarehouseList,
                type: 'post',
                data: {
                    data: {
                        'shopId': _self.shopId,
                    }
                },
                hasLoading: false,
                success (res) {
                    _self.WarehouseList = res.data;
                    if(_self.defaultWarehouseId){
                        var isExist = false;
                        _self.WarehouseList.forEach(function(item) {
                            if(item.warehouseId == _self.defaultWarehouseId) {
                                isExist = true;
                            }
                        });
                        if(!isExist && _self.defaultWarehouseName != undefined && _self.defaultWarehouseName != ''){
                            _self.WarehouseList.push({warehouseId: _self.defaultWarehouseId, warehouseName: _self.defaultWarehouseName});
                            _self.selectedWarehouse = _self.defaultWarehouseId;
                        }else if(!isExist && (_self.defaultWarehouseName == undefined || _self.defaultWarehouseName == '')){
                            _self.selectedWarehouse = '';
                        }else {
                            _self.selectedWarehouse = _self.defaultWarehouseId;
                        }
                    }
                }
            });
        },
        selectWarehouse () {
            if(this.selectedWarehouse != undefined) {
                this.$emit('selected', {
                    data: this.selectedWarehouse
                });
            }
            
        },
        clickWarehouse () {
            if(this.shopId === ''){
                layer.msg('请先选择店铺哦！', {
                    time: 2000
                });

            }
        }

    },
    watch: {
        shopId: function(val) {
            if(this.shopId !== ''){
                this.fetchWarehouseList();
            } else {
            	this.selectedWarehouse = '';
            }
        },
        defaultWarehouseId: function(val) {
            if(this.shopId !== ''){
                if(val == '' || val == undefined){
                    this.selectedWarehouse = '';
                }else{
                    this.selectedWarehouse = val;
                }  
            }
        }
    }
}
</script>