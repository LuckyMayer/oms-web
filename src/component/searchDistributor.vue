<template>
    <input :id="_selfCompId" class="form-control input-sm" :placeholder="_selfPlaceholder" v-model="key" @dblclick="getDistributorData" :disabled="_selfDisabled"/>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import deepClone from '../common/deepClone'
import autoComplete from '../common/autoComplete'

export default {
    data: function() {
        return {
            key: '',
            distributorList: [],
            choosedData : null
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
                _self.key = '';
            }
        );
    	Common.bindAutoSelect("#" + this._selfCompId, function() {
        	_self.getDistributorData();
        });
    },
    computed: {
        _selfCompId () {
            return this.compId || 'searchDistributor';
        },
        _selfPlaceholder () {
            return this.placeholder ||'模糊搜索';
        },
        _selfDisabled () {
            return this.disabled || false;
        },
        _selfDistributorStatus () {
            return this.distributorStatus || '';
        },
        initDistributorName () {
            return this.initDistributor == undefined ? undefined : this.initDistributor.distributorName;
        }
    },
    props: ['compId','placeholder','disabled','initDistributor','distributorStatus'],
    methods: {
        getDistributorData: function() {
            var _self = this;
            $("#" + this._selfCompId).attr("searched", true);
            http({
                instance: _self,
                url: api.getDistributorData,
                type: 'post',
                data: {
                    data: {
                        'keyWords': _self.key,
                        'status': _self._selfDistributorStatus
                    }
                },
                loadingParam : {
                    target : '#' + _self._selfCompId,
                    position : 'right'
                },
                success: function(data){
                    _self.$set(_self,'distributorList', data.data.content);
                    if(data.data.totalCount >= 1) {
                        _self.initAutocomplete(_self._selfCompId, _self.distributorList, ['distributorName']);
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
                this.key = data.distributorName;
            	this.choosedData = data;
            });
        }
    },
    watch: {
        'key': function (newval) {
            if(this.choosedData == null) {
                this.getDistributorData();
            }
        	
        },
        choosedData() {
            if(this.choosedData) {
            	this.$emit("selected", {data : deepClone(this.choosedData)});
            } else {
            	this.$emit("selected", {data : {}});
            }       	
        },
        initDistributorName: function(val) {
            if(val != undefined && this.initDistributor != {} && !$.isEmptyObject(this.initDistributor)) {
                this.key = val;
                this.choosedData = this.initDistributor;
            }else if(val == {} || $.isEmptyObject(this.initDistributor)) {
                this.choosedData = null;
                this.distributorList = [];
                $('#' + this._selfCompId).val('');
            }
        }
    }
}
</script>