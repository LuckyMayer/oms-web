<template>
	<input :id="_selfCompId" type="text" class="form-control input-sm no-padding" :placeholder="_selfPlaceholder" v-model="key" :disabled="_selfDisabled" @dblclick="fetchGoodsList"/>
</template>

<script>
import http from '../common/http'
import api from '../common/api'
import deepClone from '../common/deepClone'
import autocomplete from '../common/autoComplete'

export default {
	props: ['compId', 'placeholder', 'disabled', 'partyId', 'initGood'],
	data () {
        return {
        	key: '', // 搜索关键字
            goodsList: [], // 搜索商品列表   
            choosedData: null,
            addGoods: {
                addGoodsDisabled: true,
                styleType1Display: false,
                styleType2Display: false,
                styleType3Display: false,
                addStyleType1: {
                    active: "",
                    styleType:{
                        name: "",
                        id: ""
                    },
                    styleValues:[],
                },
                addStyleType2: {
                    active: "",
                    styleType:{
                        name: "",
                        id: ""
                    },
                    styleValues:[],
                },
                addStyleType3: {
                    active: "",
                    styleType:{
                        name: "",
                        id: ""
                    },
                    styleValues:[],
                },
                addOuterSkuId: "",
                addOuterIid: "",
                addGoodsId: "",
                addGoodsName: "",
                addPrice:"",
                addQuantity: "",
                addTaxFee: ""
            },
        }
    },
    computed: {
    	_selfCompId () {
    		return this.compId || 'searchGoodsName';
    	},
        _selfPlaceholder () {
            return this.placeholder ||'搜索套餐商品名称';
        },
        _selfDisabled () {
            return this.disabled || false
        },
        goodsName () {
            return this.initGood == undefined ? '' : this.initGood.addGoodsName;
        }
    },
    mounted() {
        const _self = this;
        Common.bindInputDownmenuClearEvent("#" + this._selfCompId,
            function() {
                return _self.choosedData;
            },
            function() {
                _self.choosedData = null;
            }
        );
        Common.bindAutoSelect("#" + this._selfCompId, function() {
    		_self.fetchGoodsList();    	
        });
    },
    methods: {
        fetchGoodsList () {
        	const _self = this;
        	$("#" + this._selfCompId).attr('searched', true);
            http({
                instance: _self,
                url: api.getGroupGoodsNameList,
                type: 'post',
                loadingParam : {
                    target : '#' + _self._selfCompId,
                    position : 'right'
                },
                data: {
                    data: {
                        'key': _self.key,
                        'partyId': _self.partyId || ''
                    }
                },
                success (res) {
                    _self.goodsList = res.data.content;

                    // $("#"+_self._selfCompId).trigger("autocomplete").trigger("focus").trigger("showSelect");

                    _self.initAutocomplete(_self._selfCompId, _self.goodsList, ['goodsGroupName']);
                }
            });
        },
        initAutocomplete (inputId, suggestList, searchProperty) {
        	const _self = this;

        	autocomplete({
        		inputId: '#' + inputId,
        		suggestList: suggestList,
        		searchProperty: searchProperty
        	}, (data) => {
                _self.fetchGroupGoodSkus (deepClone(data));
        		// _self.$emit("seleted", deepClone(data));
        	});
        },
        fetchGroupGoodSkus (data) {
            const _self = this;
            http({
                instance: _self,
                url: api.getGroupGoodsDetailForOrder,
                type: 'post',
                data:{
                    data:{
                        "id":data.goodsGroupId, 
                    },
                },
                hasLoading: false,
                success (res) {
                    _self.addGoods.addOuterSkuId = '';
                    _self.addGoods.addOuterIid = res.data.goodsGroupCode;
                    _self.addGoods.addGoodsId = res.data.goodsGroupId;
                    _self.addGoods.addGoodsName = res.data.goodsGroupName;
                    _self.addGoods.addPrice = res.data.goodsGroupPrice;
                    _self.addGoods.addTaxFee = "0.00";
                    _self.addGoods.addQuantity = 1;
                    _self.addGoods.addGoodsDisabled = false;

                    _self.choosedData = _self.addGoods;

                   _self.$emit("selected", deepClone(_self.addGoods)); 
                },
                fail() {
                    _self.addGoods.addGoodsDisabled = true;
                }
            });
        },
    },
    watch: {
    	key (newVal) {
            if(this.choosedData == null) {
                this.fetchGoodsList();
            }
    	},
        choosedData () {
            if(!this.choosedData) {
                Object.assign(this.$data, this.$options.data());
                this.$emit("selected", deepClone(this.addGoods));
            }  
        },
        goodsName (newVal) {
            if(newVal != undefined && newVal == '') {
                Object.assign(this.$data, this.$options.data());
                this.choosedData = this.addGoods;
                this.key = '';
            }else if(newVal != undefined && newVal != '') {
                this.key = this.initGood.addGoodsName;
                this.choosedData = this.initGood;
            }
        }
    }
}
</script>