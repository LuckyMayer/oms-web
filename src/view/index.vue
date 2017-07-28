<template>
    <div v-if="currentSession">
        <top-bar @ready="topBarReady" @unready="topBarUnready" :user-session="currentSession"></top-bar>
        <side-bar></side-bar>
        
        <router-view v-if="ready"></router-view>
    </div>
</template>

<script>
import {getCookie} from '../common/cookie' 

import topBar from '../component/topBar'
import sideBar from '../component/sideBar'
import http from '../common/http'
import api from '../common/api'

export default {
    data() {
       return {
           ready : false,
           currentSession : null
       }    
    },
	mounted () {
		if(!getCookie('d_session_id')) { //假如没有session的话
			this.$router.push({name : 'login'});
			return;
		}
		const _self = this;
		const sessionId = getCookie('d_session_id'); //拿到当前的回话编号
		http({
			instance: _self,
            url: api.getSession,
            type: 'post',
            loadingParam : {
            	target : document.body
            },
            data:{},
            success (res) {
				if(!res.success) {
					//出错~~ 可以选择刷新或者跳转到登录页面
					alert("出错");
					return;
				}
				_self.currentSession = res.data;
				if(!_self.currentSession) {
					_self.$router.push({name : 'login'});
				}
            }
		});
    },
    components: {
        'topBar': topBar,
        'sideBar': sideBar
    },
    methods : {
        topBarReady() {
            this.ready = true;
        },
        
        topBarUnready() {
            this.ready = false;
        }
    }
}
</script>
