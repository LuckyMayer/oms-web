<template>
  <input :id="_selfCompId" type="text" class="form-control input-sm" :placeholder="_selfPlaceholder" v-model="key" :disabled="_selfDisabled" @click="getRoleList"/>
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
            roleList: [], // 搜索角色列表   
        }
    },
    computed: {
        _selfCompId () {
            return this.id || 'searchRole';
        },
        _selfPlaceholder () {
            return this.placeholder ||'搜索角色名称';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    mounted () {
    },
    methods: {
        getRoleList () {
            var _self = this;
            http({
                instance: _self,
                url: api.getRoleList,
                type: 'post',
                data: {
                    data: {
                        'key': _self.key
                    }
                },
                loadingParam : {
                    target : "#" + _self._selfCompId,
                    position: 'right'       
                },
                success: function(res){
                    _self.roleList = res.data;
                    if(_self.roleList.length) {
                        _self.complete("#" + _self._selfCompId, _self.roleList, ['roleName']);
                    }
                }
            });
        },
        complete (id, list, prop) {
            const _self = this;
            autoComplete({
                inputId: id, 
                suggestList: list, 
                searchProperty: prop
            }, function(row){
                _self.$emit('selected', deepClone(row));
            });
        }
    },
    watch: {
      'key': function (newVal) {
            this.getRoleList();
        }
    }
}
</script>