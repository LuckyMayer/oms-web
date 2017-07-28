<template>
    <select class="form-control input-sm" :disabled="disabled" v-model="choosed">
        <option value="">{{placeholder}}</option>
        <option v-for="(item, i) in brandList" :value="item.id">{{item.goodsBrandName}}</option>
    </select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

import autocomplete from '../common/autoComplete'

export default {
    props: ['compId', 'select'],
    data () {
        return {
            brandList: [], // 搜索商品列表   
            disabled: false,
            placeholder: '=== 全部品牌 ===',
            choosed: '',
            choosedName: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.fetchBrandList();
        });
    },
    watch : {
        choosed() {
            const _self =  this;
            _self.brandList.forEach(function (item, i) {
                if (item.id == _self.choosed) {
                    _self.choosedName = item.goodsBrandName;
                }
            });
            _self.$emit("selected", _self.choosed, _self.choosedName);
        },
        select () {
            if (this.select) {
                this.choosed = this.select;
            }
        }
    },
    methods: {
        fetchBrandList () {
            const _self = this;
            http({
                instance: _self,
                url: api.getGoodsBrandList,
                type: 'post',
                data: {
                    data: {
                        'partyId': ''
                    }
                },
                hasLoading: false,
                success (res) {
                    _self.brandList = res.data;

                }
            });
        }
    }
}
</script>