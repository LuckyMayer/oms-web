<template>
    <input :id="id||'searchSku'" class="form-control input-sm" :placeholder="placeholder" v-model="key"/>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import deepClone from '../common/deepClone'
import autoComplete from '../common/autoComplete'

export default {
    mounted: function() {
        var _self = this;
        this.selectorID = _self.id || 'searchSku';
        Common.bindInputDownmenuClearEvent("#" + this.selectorID, 
            function() {
                return _self.choosedData;
            },
            function() {
            	_self.choosedData = null;
            }
        );
        Common.bindAutoSelect("#" + this.selectorID, function() {
    		_self.searchSkuNameList(function(){
	            autoComplete({
	                inputId: "#" + _self.selectorID, 
	                suggestList: _self.skuList, 
	                searchProperty: ['skuName']
	            }, function(row){
	            	_self.choosedData = deepClone(row);
	            })});
        });
    },
    data: function() {
    	return {
    		key: '',
    		skuList: [],
    		choosedData : null
    	}
    },
    props: ['id','placeholder'],
    methods: {
    	searchSkuNameList: function(callback) {
            var _self = this;
            $("#" + this.selectorID).attr('searched', true);
            http({
                instance: _self,
                url: api.searchSkuNameList,
                type: 'post',
                data: {
                	data: {
                        'key': _self.key
                    }
                },
                loadingParam : {
                    target : '#' + _self.selectorID,
                    position : 'right'
                },
                success: function(data){
                	_self.$set(_self,'skuList', data.data.content);
                    
                    if (_self.skuList.length >= 1) {
                       	callback();
                    } else{
                    	_self.choosedData = {};
                        return false;
                    }
                }
            });
    	}
    },
    watch: {
        'key': function (newval) {
            var _self = this;

	        _self.searchSkuNameList(function(){
	            autoComplete({
	                inputId: "#" + _self.selectorID, 
	                suggestList: _self.skuList, 
	                searchProperty: ['skuName']
	            }, function(row){
	            	_self.choosedData = deepClone(row);
	            });
	        });
        },
        
        choosedData : function() {
        	this.$emit('selected', this.choosedData || {});        	
        }
    }
}
</script>