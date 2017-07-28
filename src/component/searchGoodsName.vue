<template>
	<input :id="_selfCompId" type="text" class="form-control input-sm" :placeholder="_selfPlaceholder" v-model="key" :disabled="_selfDisabled"/>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

import autoComplete from '../common/autoComplete'
import deepClone from '../common/deepClone'

export default {
	props: ['id', 'compId', 'placeholder', 'disabled'],
	data () {
        return {
        	key: '', // 搜索关键字
            goodsList: [], // 搜索商品列表
            choosedData : null
        }
    },
    computed: {
    	_selfCompId () {
    		return this.id || 'searchGoodsName';
    	},
        _selfPlaceholder () {
            return this.placeholder ||'搜索商品名称';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    mounted () {
    	var _self = this;
    	Common.bindInputDownmenuClearEvent("#" + this._selfCompId, 
            function() {
                return _self.choosedData;
            },
            function() {
            	_self.choosedData = null;
            }
        );
    	Common.bindAutoSelect("#" + this._selfCompId, function() {
        	_self.getGoodsList();
        });
    },
    methods: {
        getGoodsList () {
            var _self = this;
            $("#" + this._selfCompId).attr("searched", true);
            http({
                instance: _self,
                url: api.getGoodsNameList,
                type: 'post',
                data: {
                    data: {
                        'key': _self.key,
                        'status': 'ALL'
                    }
                },
                loadingParam : {
                    target : "#" + _self._selfCompId,
                    position: 'right'              
                },
                success: function(res){
                    _self.goodsList = res.data.content;
                    let goodsList = res.data.content;
                    if(_self.goodsList) {
                        autoComplete({
                            inputId: "#" + _self._selfCompId, 
                            suggestList: goodsList, 
                            searchProperty: ['goodsName']
                        }, function(row){
                        	_self.choosedData = deepClone(row);
                        });
                    }
                }
            });
        }
    },
    watch: {
    	'key': function (newVal) {
            this.getGoodsList();
        },
        
        choosedData : function() {
        	this.$emit('selected', this.choosedData || {});
        }
    }
}
</script>