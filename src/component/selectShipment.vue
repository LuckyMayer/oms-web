
<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedShipment" @change="selectShipment" @click="clickShipment">
		<option value="">{{_selfPlaceholder}}</option>
		<option v-for="item in ShipmentList" :value="item.shippingId">{{item.shippingName}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
    mounted () {
        if(this.warehouseId != undefined && this.warehouseId != ''){
            this.fetchShipmentList();
        }     
    },
	props: ['partyId', 'placeholder', 'disabled', 'warehouseId', 'defaultShippingId', 'defaultShippingName'],
	data () {
        return {
            ShipmentList: [],
            selectedShipment: ''
        }
    },
    computed: {
        _selfPlaceholder () {
            return this.placeholder ||'=== 请选择快递 ===';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        fetchShipmentList () {
            const _self = this;
            http({
                instance: _self,
                url: api.getShipmentList,
                type: 'post',
                hasLoading: false,
                data: {
                    data: {
                        'warehouseId': _self.warehouseId,
                    }
                },
                success (res) {
                    _self.ShipmentList = res.data;
                    if(_self.defaultShippingId){
                        var isExist = false;
                        _self.ShipmentList.forEach(function(item){
                            if(item.shippingId == _self.defaultShippingId) {
                                isExist = true;
                            }
                        });
                        if(!isExist && _self.defaultShippingName != undefined && _self.defaultShippingName != '') {
                            _self.ShipmentList.push({shippingId: _self.defaultShippingId, shippingName: _self.defaultShippingName})
                            _self.selectedShipment = _self.defaultShippingId;
                        }else if(!isExist && !_self.defaultShippingName) {
                            _self.selectedShipment = '';
                        }else {
                            _self.selectedShipment = _self.defaultShippingId;
                        }
                        
                    }
                }
            });
        },
        selectShipment () {
            if(this.selectedShipment != undefined) {
                this.$emit('selected', {
                    data: this.selectedShipment
                });
            }
            
        },
        clickShipment () {
            if(this.warehouseId == ''){
                layer.msg('请先选择仓库哦！', {
                    time: 2000
                });
            }
        }
    },
    watch: {
        warehouseId: function(val) {
            if(this.warehouseId == '' || !this.warehouseId){
                this.selectedShipment = '';
                this.selectShipment();
            }else{
                this.selectedShipment = '';
                this.fetchShipmentList();
            }  
            
        },
        defaultShippingId: function(val) {
            if(this.defaultShippingId != ''){
                if(val == '' || val == undefined){
                    this.selectedShipment = '';
                }else{
                    this.selectedShipment = val;
                }  
            }
        }
    }
}
</script>