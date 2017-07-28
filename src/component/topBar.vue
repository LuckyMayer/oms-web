<template>
    <header class="main-header">
        <router-link :to="{name: 'home'}" class="logo">
            <img src="/src/img/banner-logo.png" alt="">
        </router-link>
       
        <!-- Header Navbar -->
        <nav class="navbar navbar-static-top" role="navigation">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>
          
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li class="dropdown party party-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                          <span id="currentPartyNameSpan" v-if="currentParty" v-text="currentParty.partyName"></span>
                        </a>
                        <div class="dropdown-menu" id="choose-party">
                            <party-bar @choose="chooseParty" :party="userSession.currentParty"></party-bar>
                        </div>
                    </li>
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                          <img src="/src/img/avator.png" class="user-image" alt="User Image">
                          <span class="hidden-xs" v-text="userSession.user.account"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <!-- User image -->
                            <li class="user-header">
                                <img src="/src/img/avator.png" class="img-circle" alt="User Image">
                                    <p v-text="userSession.user.account"></p>
                            </li>
                    
                            <!-- Menu Footer-->
                            <li class="user-footer">
                                <div class="pull-left">
                                    <a href="#" class="btn btn-default btn-sm btn-flat"><i class="fa fa-edit"></i> 修改信息</a>
                                </div>
                                <div class="pull-right">
                                    <a href="#" class="btn btn-default btn-sm btn-flat" @click="logout"><i class="fa fa-power-off"></i> 退出</a>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import {getCookie, deleteCookie, setCookie} from '../common/cookie'
import partyBar from './partyBar'

export default {
	props : ['userSession'],
    components : {
       partyBar
    },
    mounted () {
    	this.userAccount = this.userSession.user.account;
    	this.party = this.userSession.currentParty;
    },
    data () {
        return {
            username: '',
            party : null,
            currentPartyId : null,
            currentParty : null
        }
    },
    methods: {
        logout () {
            const _self = this;
            http({
                instance: _self,
                url: api.logout,
                type: 'post',
                success (res) {
                    if(res.success) {
                        deleteCookie();
                    }
                    _self.$router.push({name: 'login'});
                }
            });
        },
        
        chooseParty(party) {
            this.party = party;
            if(!this.party) return;
            const partyId = this.currentPartyId;
            this.currentParty = party;
            if(partyId != party.partyId) {
                this.$emit("unready", {});
            }
            const _self = this;
            setTimeout(function() {
                _self.$emit("ready", {});
            }, 0);
            this.ready = true;
            this.userSession.currentParty = party;
        }
    }
}
</script>
<style scoped>
    .main-header {
        background:url(/src/img/topbar-bkg.png) top left no-repeat #3697de;
        color: #fff;
    }
    .main-header a {
        color: #fff;
    }
    .sidebar-toggle:hover {
        color: #71B5E8;
    }
    .navbar-custom-menu a {
        background-color: #3697de;
        color: #fff;
    }
    .navbar-custom-menu a:hover,
    .navbar-custom-menu a:active,
    .navbar-custom-menu a:focus {
        background-color: #71B5E8;
        color: #fff;
    }
    .navbar-custom-menu>.navbar-nav>li>.dropdown-menu {
        background-color: #71B5E8;
        right: -1px;
    }
    .navbar-nav>.user-menu>.dropdown-menu>.user-footer {
        background-color: #fff;
    }
    .btn-default {
        color: #444 !important;
        background-color: #f4f4f4 !important;
        border-radius: 3px !important;
    }
    .navbar-nav>.user-menu>.dropdown-menu>li.user-header>p {
        color: #fff;
    }
    #choose-party {
        background-color: #fff;
        width: 700px;
    }
</style>