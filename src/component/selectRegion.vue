<template>
	<select :id="_selfCompId" class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedRegion" @change="selectRegion">
		<option value="">{{_selfPlaceholder}}</option>
		<option v-for="item in RegionList" :value="item.regionId">{{item.regionName}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
    mounted () {
        if(this.init || this.init === undefined) {
            this.fetchRegionList();
        }
    },
	props: ['compId', 'init', 'placeholder', 'disabled','regionType','parentId','defaultRegionId'],
	data () {
        return {
            RegionList: [],
            selectedRegion: ''
        }
    },
    computed: {
        _selfCompId () {
            return this.compId || 'searchRegion_' + this.regionType;
        },
        _selfPlaceholder () {
            return this.placeholder ||'';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        fetchRegionList () {
            
            const _self = this;
            http({
                instance: _self,
                url: api.getRegionList,
                type: 'post',
                data:{
                    data:{
                        'regionType': _self.regionType,
                        'parentId': _self.parentId
                    }
                },
                loadingParam : {
                    target : '#' + _self._selfCompId,
                    position : Common.Loading.positionSelectRight
                },
                success (res) {
                    _self.RegionList = res.data;
                    // _self.RegionList.forEach(function(item) {
                    //     if(item.regionName.length == 2) {
                    //         var regionNameArr = item.regionName
                    //         item.regionName = item.regionName.substr(0,1) + '　' + item.regionName.substr(1,2);
                    //     }
                    // });
                    if(res.data.length == 0){
                        _self.display = false;
                    }
                    if(_self.defaultRegionId){
                        _self.selectedRegion = _self.defaultRegionId;
                    }else {
                        _self.selectedRegion = '';
                    }
                }
            });
            
            
        },
        selectRegion () {
            if(this.selectedRegion == ''){
                this.$emit('selected', {
                    data: {'regionId': '', 'regionName': ''}
                });
            }else{
                this.RegionList.forEach((fregion) => {
                    if(fregion.regionId == this.selectedRegion){
                        this.$emit('selected', {
                            data: fregion
                        });
                        return false;
                    }
                })
            }
            
        }
    },
    watch: {
        parentId: function (val){
            if(this.regionType == '1' || (this.regionType != '1' && this.parentId != '')){
                this.fetchRegionList();
            }else if(this.regionType != '1' && this.parentId == '') {
                this.RegionList = [];
                this.selectedRegion = '';
            }
        },
        defaultRegionId: function (val) {
            if(this.regionType == '1' || (this.regionType != '1' && this.parentId != '')){
                this.selectedRegion = val;
            }
        }
    }
}
</script>