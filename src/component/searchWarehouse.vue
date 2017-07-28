<template>
    <input :id="id||'searchWarehouse'" class="form-control input-sm" :placeholder="placeholder" v-model="key" @dblclick="searchWarehouseList"/>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import deepClone from '../common/deepClone'
import autoComplete from '../common/autoComplete'

export default {
    mounted: function() {
        var _self = this;
        this.selectorID = _self.id || 'searchWarehouse';
        Common.bindInputDownmenuClearEvent("#" + this.selectorID, 
            function() {
                return _self.choosedData;
            },
            function() {
            	_self.choosedData = null;
            }
        );
        Common.bindAutoSelect("#" + this.selectorID, function() {
        	_self.searchWarehouseList();
        });
    },
    data: function() {
    	return {
    		key: '',
    		warehouseList: [],
            count: 0,
            choosedData : null
    	}
    },
    computed: {
        _selfContainsDeleted () {
            return this.containsDeleted == undefined ? true : this.containsDeleted;
        }
    },
    props: ['id','placeholder','defaultWarehouse','containsDeleted'],
    methods: {
    	searchWarehouseList: function() {
            var _self = this;
            $("#" + this.selectorID).attr("searched", true);
            http({
                instance: _self,
                url: api.getWarehouseNameList,
                type: 'post',
                data: {
                	data: {
                        'key': _self.key,
                        'containsDeleted': _self._selfContainsDeleted
                    }
                },
                loadingParam : {
                    target : "#" + this.selectorID,
                    position : 'right'
                },
                success: function(data){
                	_self.$set(_self,'warehouseList', data.data);
                    if (_self.warehouseList.length >= 1) {
                    	autoComplete({
                            inputId: "#" + _self.selectorID, 
                            suggestList: _self.warehouseList, 
                            searchProperty: ['warehouseName']
                        }, function(row){
                        	_self.choosedData = deepClone(row);
                        });
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
                _self.searchWarehouseList();
            }else {
                // _self.$emit('selected', deepClone(row));
            }
            _self.count++;
        },
        
        choosedData : function() {
       		this.$emit('selected', this.choosedData || {});
        },
        
        defaultWarehouse: function(val){

            if(val != undefined && val != {} && !$.isEmptyObject(val)){
                var _self = this;
                _self.key = val.warehouseName;
            }
            
        }
    }
}
</script>