<template>
	<div class="content-wrapper">
		<!-- <section class="content-header">
            <ol class="breadcrumb">
                <li><i class="fa fa-desktop"></i> 销售</li>
                <li class="active">原始订单</li>
                <li class="active">订单录入</li>
            </ol>
        </section> -->
        <section class="content">
	        <div class="tabs">
			    <div class="tabs-list-wrapper">
			        <ul class="tabs-list">
			        	<li v-for="tab in tabList"  :class="{'active': tab.active}" @click="clickTab(tab,1)"><a :href="'#/ordersManage/manualOrderGeneration/ordersGeneration'+tab.subUrl">{{tab.name}}</a></li>
			        </ul>
			    </div>
			    <div class="tabs-content-wrapper" >
			   		<component v-if="currentView != ''" :is="currentView" :oms-order-sn="orderSn"></component>
			    </div>
			</div>
        </section>	
	</div>
</template>

<script>
import singleOrderGeneration from './singleOrderGeneration'
import batchOrderGeneration from './batchOrderGeneration'
import batchOrderList from './batchOrderList'
import shipOnlyOrderGeneration from './shipOnlyOrderGeneration'

const EVENT_ACTIVE_CHANGE = 'vue-tabs-active-change'

export default {
	data () {
        return {
            tabList: [{
            	"name": "手工建单",
            	"view": "singleOrderGeneration",
            	"active": false,
                "subUrl": "/singleOrderGeneration/0"
            }, {
                "name": "补寄订单",
                "view": "shipOnlyOrderGeneration",
                "active": false,
                "subUrl": "/shipOnlyOrderGeneration/0"
            }, {
            	"name": "批量录单",
            	"view": "batchOrderGeneration",
            	"active": false,
                "subUrl": "/batchOrderGeneration/0"
            }, {
            	"name": "批量录单查询",
            	"view": "batchOrderList",
            	"active": false,
                "subUrl": "/batchOrderList/0"
            }],
            currentView: "",
            orderSn: "",
        }
    },
    mounted () {
        if(this.$route.params.tab != undefined) {
            var tabTemp = {};
            var view = '';
            view = this.$route.params.tab;
            this.orderSn = this.$route.params.omsOrderSn;
            if(view != ''){
                this.tabList.forEach(function(item) {
                    if(item.view == view) {
                        tabTemp = item;
                    }
                });
                this.clickTab(tabTemp,0);
            }
        }
        
    },
    methods: {
    	clickTab (tab,type) {
            if (tab && !tab.active) {
                this.select(tab)
                if(type == 1) {
                    this.orderSn = '0';
                }               
            }
        },
        select (tab) {
            if (!tab) {
                return
            }
            this.currentView = tab.view;
            this.$set(tab, 'active', true);
            this.tabList.forEach((ftab) => {
                if (ftab.name !== tab.name) {
                    this.$set(ftab, 'active', false);
                }
            })
        },
    },
	components: {singleOrderGeneration,batchOrderGeneration,batchOrderList,shipOnlyOrderGeneration}
}
</script>

<style scoped>
.tabs {
    position: relative;
}

.tabs-list-wrapper {
    /*padding: 0px 8px;*/
}

.tabs-list {
    list-style: none;
    margin: 0px;
    padding: 0px;
    height: 40px;
    width: auto;
    border-bottom: 1px solid #3697DE;
    /*font-size: 0.875rem;*/
    background-color: transparent;
}

.tabs-list li {
	display: inline-block;
    float: left;
    position: relative;
    color: #000;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    border-top: 1px solid transparent;
    padding: 0.78571em 0.95em;
    overflow: hidden;
    margin-bottom: -1px;
}
.tabs-list li a{
    padding: 0.78571em 1em;
    overflow: hidden;
}
.tabs-list li.active {
    background-color: #FFF;
    border-color: #3697DE;
    border-bottom:1px solid #FFF;
    /*margin-bottom: -3px;*/
    position: relative;
    font-weight: bold;
    box-shadow: none;
    border-radius: 5px 5px 0px 0px;	
    overflow: visible;
}

.tabs-list li:hover {
    cursor: pointer;
}

.tabs-content-wrapper {
    position: relative;
    background-color: #FFF;
}
.content-wrapper {
    padding-top: 0px;
    margin-left: 0px;
}
</style>