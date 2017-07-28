<template>
    <input :id="id||'searchGoodsOrGroup'" class="form-control input-sm" :placeholder="placeholder" v-model="key"/>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import deepClone from '../common/deepClone'
import autoComplete from '../common/autoComplete'

export default {
    mounted: function() {
        var _self = this;
        this.selectorID = _self.id || 'searchGoodsOrGroup';
        // console.log(this.selectedData);
        // this.key = this.selectedData.skuName || '';
    },
    data: function() {
    	return {
    		key: '',
    		goodsOrGroupList: []
    	}
    },
    props: ['id','placeholder', 'selectedData'],
    methods: {
    	searchGoodsOrGroupList: function(callback) {
            var _self = this;
            http({
                instance: _self,
                url: api.searchGoodsOrGroup,
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
                	_self.$set(_self,'goodsOrGroupList', data.data);
                    
                    if (_self.goodsOrGroupList.length >= 1) {
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

            _self.searchGoodsOrGroupList(function(){
                autoComplete({
                    inputId: "#" + _self.selectorID, 
                    suggestList: _self.goodsOrGroupList, 
                    searchProperty: ['goodsName','goodsCode']
                }, function(row){
                    _self.$emit('selected', deepClone(row));
                });
            });
        }
    }
}
</script>