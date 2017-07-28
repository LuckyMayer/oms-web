<template>
    <li class="treeview" :class="{'active' : item.active}" >
        <a href="javascript:;" @click="menuClick" >
            <i :class="item.icon"></i>
            <span v-text="item.name"></span>
            <i v-if="!item.leaf" class="fa fa-angle-right pull-right"></i>
        </a>
        <ul class="treeview-menu" v-if="item.children != null && item.children.length > 0">
            <side-bar-item v-for="child in item.children" :item="child" @menu-active="menuActive"></side-bar-item>
        </ul>
    </li>
</template>

<script>
import sideBarItem from './sideBarItem'
export default {
    name : "side-bar-item",
    props : ['item'],
    components : {
       sideBarItem
    },
    mounted () {
    },
    // computed: {
    //     level: function () {
    //         let parent = this.item;
    //         let i = 0;
    //         while(parent) {
    //             parent = parent.parent;
    //             i++;
    //         }
    //         return 'treeview' + i;
    //     }
    // },
    methods : {
        menuClick() {
            if(this.item.leaf) {
                this.$router.push({name : this.item.view});
                this.menuActive(this.item);
            }
        },
        menuActive(item) {
            this.$emit('menu-active', item);
        }
    }
}
</script>
<style scoped>
    .skin-blue .sidebar-menu > li.header {
        color: #58666e;
        background: #1a2226;
    }
    .skin-blue .sidebar-menu > li > a {
        color: #58666e;
    }
    .skin-blue .sidebar-menu > li:hover > a,
    .skin-blue .sidebar-menu > li.active > a {
        color: #fff;
        background-color: #3697de;
    }
    .skin-blue .sidebar-menu > li > .treeview-menu {
        background-color: #efefef;
    }
    .skin-blue .treeview-menu > li > a {
        color: #333;
        padding-top: 8px;
        padding-left: 34px;
        padding-bottom: 8px;
    }
    .skin-blue .treeview-menu > li.active > a,
    .skin-blue .treeview-menu > li > a:hover {
        color: #3697de; 
    }
    .skin-blue li .pull-right {
        text-align: center;
    }
/*    .sidebar-menu .treeview-menu .treeview-menu {
        padding-left: 0;
    }
    .sidebar-menu .treeview-menu .treeview-menu a {
        padding-left: 50px;
    }*/
    .skin-blue .sidebar-menu > li.active > a > .pull-right {
        -webkit-transform-origin:center center;
        transform-origin:center center;
        -webkit-transform:rotate3d(0,0,1,90deg);
        transform:rotate3d(0,0,1,90deg);
    }
    .skin-blue .treeview-menu > li.active > a > .pull-right {
        -webkit-transform-origin:center center;
        transform-origin:center center;
        -webkit-transform:rotate3d(0,0,1,90deg);
        transform:rotate3d(0,0,1,90deg);
    }
</style>