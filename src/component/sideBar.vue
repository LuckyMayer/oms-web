
<template>
    <aside class="main-sidebar">
        <section class="sidebar" >
            <ul class="sidebar-menu" v-if="menuList != null && menuList.length > 0">
                <side-bar-item :item="child" v-for="child in menuList" @menu-active="menuActive"></side-bar-item>
            </ul>
            <div style="text-align:center; color:red;font-weight:bold;" v-if="menuList == null || menuList.length == 0">无目录权限，请找管理员申请</div>
        </section>
    </aside>
</template>

<script>
import http from '../common/http'
import api from '../common/api'
import sideBarItem from './sideBarItem'

export default {
    components : {
       sideBarItem
    },
    mounted () {
        this.$nextTick(() => {
            $("aside").height($(document).height()-$("header").height());
        });
        const _self = this;
        http({
            instance: _self,
            url: api.menuList,
            type: 'post',
            data:{},
            hasLoading: false,
            success (res) {
                //_self.menuList = res.data;
                const data = res.data;
                const viewName = _self.$route.name;
                console.log(res.data)
                var bind = function(data, parent) {
                    if(data.view == viewName) {
                        data.active = true;
                    }
                    data.parent = parent;
                    if(!data.children) return;
                    let children = data.children;
                    for(let i = 0; i < children.length; i++) {
                        bind(children[i], data);
                    }
                }
                var activeFalse = function(data) {
                    data.active = false;
                    if(!data.children || data.children.length <= 0) return;
                    for(let i = 0; i < data.children.length; i++) {
                        activeFalse(data.children[i]);
                    }
                }
                var chooseActivePage = function(data, viewName) {
                    if(data.view == viewName) {
                        _self.beforeItem = data;
                        let parent = data;
                        while(parent) {
                            parent.active = true;
                            parent = parent.parent;
                        }
                        return true;
                    }
                    if(!data.children) return;
                    for(let i = 0; i < data.children.length; i++) {
                        if(chooseActivePage(data.children[i], viewName)) return true;
                    }
                }
                for(let i = 0; i < data.length; i++) {
                    bind(data[i]);
                    activeFalse(data[i]);
                }
                for(let i = 0; i < data.length; i++) {
                    if(chooseActivePage(data[i], viewName)) break;
                }
                _self.menuList = res.data;
            }
        });
    },
    data () {
        return {
            menuList: []
        }
    },
    watch : {
    },
    methods : {
        menuActive(item) {
            item.active = true;
            if(this.beforeItem) {
                this.beforeItem.active = false;
            }
            this.beforeItem = item;
        }
    }
}
</script>
<style scoped>
    .main-sidebar {
        margin-top: 10px;
        border-right: 1px solid #d2d6de;
    }
    .skin-blue .wrapper, .skin-blue .main-sidebar, .skin-blue .left-side {
        background-color: #fff;
    }
</style>
