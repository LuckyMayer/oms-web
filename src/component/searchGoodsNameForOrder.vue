<template>
	<input :id="_selfCompId" type="text" class="form-control input-sm no-padding" :placeholder="_selfPlaceholder" v-model="key" :disabled="_selfDisabled" @dblclick="fetchGoodsList"/>
</template>

<script>
import http from '../common/http'
import api from '../common/api'
import deepClone from '../common/deepClone'
import autoComplete from '../common/autoComplete'

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
                addTaxFee:"",
                addQuantity: "",
            },
        }
    },
    mounted () {
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
    computed: {
    	_selfCompId () {
    		return this.compId || 'searchGoodsName';
    	},
        _selfPlaceholder () {
            return this.placeholder ||'搜索商品名称';
        },
        _selfDisabled () {
            return this.disabled || false;
        },
        goodsName() {
            return this.initGood == undefined ? '' : this.initGood.addGoodsName;
        }
    },
    methods: {
        fetchGoodsList () {
        	const _self = this;
        	$("#" + this._selfCompId).attr("searched", true);
            http({
                instance: _self,
                url: api.getGoodsNameListForOrder,
                type: 'post',
                loadingParam : {
                    target : "#" + _self._selfCompId,
                    position: 'right'              
                },
                data: {
                    data: {
                        'key': _self.key,
                        'partyId': _self.partyId || ''
                    }
                },
                success (res) {
                    _self.goodsList = res.data.content;
                    if(res.data.totalCount >= 1) {
                        _self.initAutocomplete(_self._selfCompId, _self.goodsList, ['goodsName']);
                    } else{
                        _self.$emit('selected', {});
                        return false;
                    }

                    
                }
            });
        },
        initAutocomplete (inputId, suggestList, searchProperty) {
        	const _self = this;

        	autoComplete({
        		inputId: "#" + inputId,
        		suggestList: suggestList,
        		searchProperty: searchProperty,
        	}, (data) => {
                _self.fetchGoodSkus(deepClone(data));
        		// _self.$emit("seleted", deepClone(data));
        	});
        },
        fetchGoodSkus (data) {
            const _self = this;
            http({
                instance: _self,
                url: api.getGoodsDetailForOrder,
                type: 'post',
                data:{
                    data:{
                        "goodsId":
                        data.id, 
                    },
                },
                hasLoading: false,
                success (res) {
                    _self.addGoods.addOuterSkuId = '';
                    _self.addGoods.addOuterIid = '';
                    _self.addGoods.addGoodsId = res.data.id;
                    _self.addGoods.addGoodsName = res.data.goodsName;
                    _self.addGoods.addPrice = "0.00";
                    _self.addGoods.addTaxFee = "0.00";
                    _self.addGoods.addQuantity = 1;
                    _self.addGoods.styleType1Display = false;
                    _self.addGoods.addStyleType1 = {
                        active: "",
                        styleType:{
                            name: "",
                            id: ""
                        },
                        styleValues:[],
                    };
                    _self.addGoods.styleType2Display = false;
                    _self.addGoods.addStyleType2 = {
                        active: "",
                        styleType:{
                            name: "",
                            id: ""
                        },
                        styleValues:[],
                    };
                    _self.addGoods.styleType3Display = false;
                    _self.addGoods.addStyleType3 = {
                        active: "",
                        styleType:{
                            name: "",
                            id: ""
                        },
                        styleValues:[],
                    };
                    if(res.data.styleType1){
                        _self.addGoods.addStyleType1.active = res.data.styleType1.values[0].id;
                        _self.addGoods.addStyleType1.styleType = res.data.styleType1;
                        _self.addGoods.addStyleType1.styleValues = res.data.styleType1.values;
                        _self.addGoods.styleType1Display = true;    
                    }
                    if(res.data.styleType2){
                        _self.addGoods.addStyleType2.active = res.data.styleType2.values[0].id;
                        _self.addGoods.addStyleType2.styleType = res.data.styleType2;
                        _self.addGoods.addStyleType2.styleValues = res.data.styleType2.values;
                        _self.addGoods.styleType2Display = true;
                    }
                    if(res.data.styleType3){
                        _self.addGoods.addStyleType3.active = res.data.styleType3.values[0].id;
                        _self.addGoods.addStyleType3.styleType = res.data.styleType3;
                        _self.addGoods.addStyleType3.styleValues = res.data.styleType3.values;
                        _self.addGoods.styleType3Display = true;
                    }
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
        goodsName(newVal) {
            if(newVal != undefined && newVal == '') {
                Object.assign(this.$data, this.$options.data());
                this.choosedData = this.addGoods;
                this.key = '';
            }else if(newVal != undefined && newVal != '') {
                this.key = this.initGood.addGoodsName;
                this.choosedData = this.initGood;
            }
        },
    }
}
</script>