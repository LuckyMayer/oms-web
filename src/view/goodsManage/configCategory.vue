<template>
    <div class="content-wrapper">
        <section class="content-header">
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-desktop"></i> 商品管理</a></li>
                <li class="active">配置</li>
                <li class="active">分类配置</li>
            </ol>
        </section>

        <!-- Main content -->
        <section class="content">
            <div class="row">
                <div class="col-md-12">
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li><router-link :to="{ name: 'configTags'}">标签配置</router-link></li>
                            <li><router-link :to="{ name: 'configStyle'}">规格配置</router-link></li>
                            <li class="active"><a href="#configCategory" data-toggle="tab">分类配置</a></li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active clearfix" id="configCategory">
                                <div class="col-md-12 no-padding">
                                    <div class="cgy-wrap col-md-12 no-padding text-center clearfix">
                                        <div class="cgy-level" v-for="(item_level, index_level) in cgy_stack">
                                            <div class="title">
                                               <label>{{index_level+1}}级品类</label>
                                               <i class="fa fa-plus text-blue add-category" @click="addCategory(index_level)"></i>
                                            </div>

                                            <div class="cgy-list">
                                                <ul>
                                                    <li v-if="item_level.length==0">
                                                        <small>~当前品类没有子品类~</small> 
                                                    </li>
                                                    <li class="cgy-item"
                                                        v-for="(item_cgy, index_cgy) in item_level" 
                                                        @click.stop="selectCategory(index_level, index_cgy)"
                                                        :class="{'active': item_cgy.selected}">

                                                        <div class="item-edit" v-show="item_cgy.selected">
                                                           <i class="fa fa-trash" @click.stop="deleteCategory(index_level, index_cgy)"></i>&nbsp;
                                                           <i class="fa fa-edit" v-if="item_cgy.edit == false || typeof item_cgy.edit === 'undefined'" @click.stop="editCategory(index_level, index_cgy)"></i>

                                                           <template  v-else>
                                                                <i class="fa fa-close"  @click.stop="editCategory(index_level, index_cgy)"></i>
                                                                <i class="fa fa-check"  @click.stop="editCategorySubmit()"></i>
                                                           </template>
                                                        </div>

                                                        <div class="item-name">
                                                            <span v-text="item_cgy.name" v-show="item_cgy.edit == false || typeof item_cgy.edit === 'undefined'"></span>
                                                            <input type="text" 
                                                                class="form-control input-sm" 
                                                                v-model="edit_form_data.name" 
                                                                v-show="item_cgy.edit == true"
                                                                @keyup.enter="editCategorySubmit()"/>
                                                        </div>

                                                        <div class="item-arrow"  v-show="!item_cgy.leaf">
                                                            <i class="fa fa-chevron-right"></i>
                                                        </div>
                                                    </li>
                                               </ul>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div id="addCategpry" role="dialog" aria-hidden="true" class="modal fade">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" data-dismiss="modal" class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button> 
                        <h4 class="modal-title" v-if="add_cgy_flag.levelIndex==0">添加一级品类</h4>
                        <h4 class="modal-title" v-if="add_cgy_flag.levelIndex>0">添加【{{add_cgy_flag.parent_name}}】的子品类</h4>
                    </div> 
                    <div class="modal-body">
                        <input type="text" class="form-control input-sm" placeholder="请输入品类名称" v-model="add_form_data.name" @keyup.enter="addCategorySubmit">
                    </div> 
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-primary" @click="addCategorySubmit">确定</button> 
                        <button type="button" data-dismiss="modal" class="btn btn-sm btn-default">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import deepClone from '../../common/deepClone'

export default {
    components: {
        
    },
    mounted () {
        this.$nextTick(() => {
            initStyle();
        });

        this.fetchListByParentCid('', 0);
    },
    data () {
        return {
            cgy_stack: [], // 品类栈

            edit_form_data: {
                cid: '',
                name: ''
            },

            add_form_data: {
                name: '',
                parentCid: '',
                leaf: true
            },

            add_cgy_flag: {
                levelIndex: '',
                parent_name: ''
            },

            edit_index: {
                levelIndex: '',
                cgyIndex: ''
            }
        }
    },
    methods: {
        fetchListByParentCid (parentCid = '', targetLevelIndex = 0) {
            const _self = this;

            http({
                instance: _self,
                url: api.getCategoryList,
                type: 'post',
                data: {
                    data:{
                        "parentCid": parentCid
                    }
                },
                success (res) {
                    _self.$set(_self.cgy_stack, targetLevelIndex, res.data);
                }
            });
        },
        initCategoryList () {
            this.cgy_stack.forEach((elem, index, array) => {
                this.$set(array, index, []);
            });
        },
        selectCategory (selectedLevelIndex, selectedCgyIndex) {
            const selectedItem = this.cgy_stack[selectedLevelIndex][selectedCgyIndex];

            if (selectedItem.selected) {
                return;
            } 
            this.resetSelectedStatus(selectedLevelIndex, selectedCgyIndex);
            this.fetchListByParentCid(selectedItem.cid, selectedLevelIndex+1);
            this.resetEditStatus(selectedItem, false, false);
        },
        resetSelectedStatus (selectedLevelIndex, selectedCgyIndex) {
            for (let i = selectedLevelIndex+1; i< this.cgy_stack.length; i++) {
                this.cgy_stack.splice(selectedLevelIndex+1, 1);
                for (let j = 0; j < this.cgy_stack[i-1].length; j++) {
                    this.$set(this.cgy_stack[i-1][j], 'selected', false);
                }
            }
            this.cgy_stack.splice(selectedLevelIndex+1, 1);
            this.$set(this.cgy_stack[selectedLevelIndex][selectedCgyIndex], 'selected', true);
        },
        resetEditStatus (targetItem, targetStatus, otherStatus) {
            this.cgy_stack.forEach((elemLevel) => {
                elemLevel.forEach((elemCgy) => {
                    this.$set(elemCgy, 'edit', otherStatus);
                });
            });
            this.$set(targetItem, 'edit', targetStatus);
        },
        editCategory (levelIndex, cgyIndex) {
            const editItem = this.cgy_stack[levelIndex][cgyIndex];
            const currentStatus = (typeof editItem.edit === 'undefined')? false : editItem.edit;

            this.edit_index.levelIndex = levelIndex;
            this.edit_index.cgyIndex = cgyIndex;

            this.resetEditStatus(editItem, !currentStatus, false);
            if (editItem.edit) {
                this.edit_form_data.cid = editItem.cid;
                this.edit_form_data.name = editItem.name;
            }
        },
        editCategorySubmit () {
            const _self = this;            

            if (!_self.edit_form_data.name.trim()) {
                layer.msg('品类名称不能为空哦', {
                    time: 1200
                });
                return;
            }

            http({
                instance: _self,
                url: api.modCategoryName,
                type: 'post',
                data: {
                    data: _self.edit_form_data
                },
                success (res) {
                    layer.msg('修改成功', {
                        time: 1000
                    }, () => {
                        _self.$set(_self.cgy_stack[_self.edit_index.levelIndex][_self.edit_index.cgyIndex], 'name', _self.edit_form_data.name.trim());
                        _self.$set(_self.cgy_stack[_self.edit_index.levelIndex][_self.edit_index.cgyIndex], 'edit', false);
                    });
                }
            });
        },
        deleteCategory (levelIndex, cgyIndex) {
            const _self = this; 
            const deleteItem = this.cgy_stack[levelIndex][cgyIndex];

            const layerConfirm = layer.confirm('您确定删除吗?', {
                btn: ['是','否'],
                title: false,
                shadeClose: true,
                closeBtn: 0
            }, () => {
                layer.close(layerConfirm);
                http({
                    instance: _self,
                    url: api.delCategory,
                    type: 'post',
                    data: {
                        data: {
                            cid: deleteItem.cid
                        }
                    },
                    success (res) {
                        layer.msg('删除成功', {
                            time: 1000
                        }, () => {
                            _self.cgy_stack[levelIndex].splice(cgyIndex, 1);
                            _self.cgy_stack.splice(levelIndex+1, _self.cgy_stack.length-levelIndex+1);
                            // _self.initCategoryList();
                            // _self.fetchListByParentCid();
                        });
                    }
                });
            });
        },
        addCategory (levelIndex) {
            $('#addCategpry').modal('show');

            this.add_cgy_flag.levelIndex = levelIndex;
            this.add_form_data.name = '';

            if (levelIndex == 0) {
                this.add_form_data.parentCid = '';
                return;
            }else{
                this.cgy_stack[levelIndex-1].forEach((elem) => {
                    if (elem.selected) {
                        this.add_form_data.parentCid = elem.cid;
                        this.add_cgy_flag.parent_name = elem.name;
                    }
                });
            }
        },
        addCategorySubmit () {
            const _self = this;

            if (!_self.add_form_data.name.trim()) {
                layer.msg('品类名称不能为空哦', {
                    time: 1200
                });
                return;
            }

            http({
                instance: _self,
                url: api.addCategory,
                type: 'post',
                data: {
                    data: _self.add_form_data
                },
                success (res) {
                    $('#addCategpry').modal('hide');
                    layer.msg('添加成功', {
                        time: 1000
                    }, () => {
                        _self.cgy_stack[_self.add_cgy_flag.levelIndex].push(res.data);
                        _self.cgy_stack[_self.add_cgy_flag.levelIndex-1].forEach((elem) => {
                            if (elem.selected) {
                               _self.$set(elem, 'leaf', false);
                            }
                        });
                    });
                }
            });
        },
    },
}
</script>

<style>
    .cgy-wrap{
        min-height: 500px;
    }
    .cgy-level{
        float: left;
        width: 260px;
        height: 100%;
        border: 1px solid #E5E5E5;
    }

    .cgy-level .title{
        height: 30px;
        padding: 5px;
        border-bottom: 1px solid #F0F0F0;
    }
    .cgy-level .title .add-category{
        cursor: pointer;
    }

    .cgy-level .cgy-list{
        padding: 5px 0;
        max-height: 700px;
        overflow-y: auto;
    }

    .cgy-item{
        display: block;
        position: relative;
        width: 100%;
        height: 40px;
        padding: 5px 10px;
        cursor: pointer;
    }
    .cgy-item:hover{
        background: #F7F7F7;
    }
    .cgy-item.active{
        background: #2F90E4;
        color: #fff;
    }

    .cgy-item .item-edit{
        position: absolute;
        padding: 10px 0 10px 13px;
        top: 0;
        left: 0;
        z-index: 9;
        color: #E7E7E7;
    }
    .cgy-item .item-edit *:hover{
        color: #fff;
    }
    .cgy-item .item-name{
        position: absolute;
        width: 100%;
        padding: 10px;
        top: 0;
        left: 0;
        text-align: center;
    }
    .cgy-item .item-name input{
        height: 25px;
        width: 67%;
        padding: 5px;
        margin: -2px 0 0 60px;
    }
    .cgy-item .item-arrow{
        position: absolute;
        padding: 10px;
        top: 0;
        right: 0;
        z-index: 9;
    }
</style>