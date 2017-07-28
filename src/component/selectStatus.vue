
<template>
    <select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedStatus" @change="selectStatus">
        <option value="">{{_selfPlaceholder}}</option>
        <option v-for="item in statusList" :value="item.value">{{item.name}}</option>
    </select>
</template>

<script>
export default {
    props: ['compId', 'placeholder', 'disabled'],
    data () {
        return {
            statusList: [{
                name: '正常',
                value: 'NORMAL'
            }, {
                name: '停用',
                value: 'DELETED'
            }],

            selectedStatus: ''
        }
    },
    computed: {
         _selfPlaceholder () {
            return this.placeholder ||'=== 全部状态 ===';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
         selectStatus () {
            this.$emit('selected', this.selectedStatus);
        }
    }
}
</script>