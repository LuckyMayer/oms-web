<template>
    <input :id="id||'searchWarehouseByType'" class="form-control input-sm" :placeholder="placeholder" v-model="key"/>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import deepClone from '../common/deepClone'
import autoComplete from '../common/autoComplete'

export default {
    mounted: function() {
        var _self = this;
        this.selectorID = _self.id || 'searchWarehouseByType';
    },
    data: function() {
    	return {
    		key: '',
    		warehouseList: [],
            count: 0,
    	}
    },
    props: ['id','placeholder','defaultWarehouse'],
    methods: {
    	searchWarehouseList: function(callback) {
            var _self = this;
            http({
                instance: _self,
                url: api.searchWarehouseByType,
                type: 'post',
                data: {
                	data: {
                        key :  _self.key,
                        warehouseType : ["OMS","VIRTUAL"]
                    }
                },
                loadingParam : {
                    target : "#" + this.selectorID,
                    position : 'right'
                },
                success: function(data){
                	_self.$set(_self,'warehouseList', data.data);
                    
                    if (_self.warehouseList.length >= 1) {
                       	callback();
                    } else{
                        _self.$emit('selected', {});
                        return false;
                    }
                }
            });
    	}
    },
    watch: {
        'key': function (newval) {
            var _self = this;
            if((_self.defaultWarehouse == undefined || _self.defaultWarehouse == '') || _self.count > 0){
                _self.searchWarehouseList(function(){
                    autoComplete({
                        inputId: "#" + _self.selectorID, 
                        suggestList: _self.warehouseList, 
                        searchProperty: ['warehouseName']
                    }, function(row){
                        _self.$emit('selected', deepClone(row));
                    });
                });
            }else {
                // _self.$emit('selected', deepClone(row));
            }
            _self.count++;
        },
        defaultWarehouse: function(val){

            if(val != undefined && val != {}){
                var _self = this;
                _self.key = val.warehouseName;
            }
            
        }
    }
}
</script>