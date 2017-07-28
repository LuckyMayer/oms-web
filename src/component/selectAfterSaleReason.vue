<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedReason" @change="selectReason">
		<option value="">{{_selfPlaceholder}}</option>
		<option v-for="item in ReasonList" :value="item.resonType">{{item.reasonName}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
    mounted () {
        this.fetchReasonList();
    },
	props: [ 'placeholder', 'disabled', 'defaultReasonType'],
	data () {
        return {
            ReasonList: [],
            selectedReason: ''
        }
    },
    computed: {
        _selfPlaceholder () {
            return this.placeholder ||'=== 请选择退换原因 ===';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        fetchReasonList () {
            const _self = this;
            http({
                instance: _self,
                url: api.getAfterSaleReasonList,
                type: 'post',
                hasLoading: false,
                success (res) {
                    _self.ReasonList = res.data;
                }
            });
        },
        selectReason () {
            if(this.selectedReason != undefined) {
                this.$emit('selected', {
                    reasonType: this.selectedReason
                });
            }
        }
    },
    watch: {
        defaultReasonType: function() {
            if(this.defaultReasonType != undefined && this.defaultReasonType != ''){
                this.selectedReason = this.defaultReasonType;
                this.selectReason();
            }
        },
    }
}
</script>