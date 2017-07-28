<template>
    <div id="login-wrap">
        <div id="login-header">
            <img src="/src/img/logo.png" alt="Leqee We Deliver Result">
        </div>
        <div id="login-content">
            <img src="/src/img/login-word.png" alt="乐其OMS管理系统" id="login-word">
            <div class="input-wrap">
                <input type="text" class="form-control" placeholder="请输入用户名" v-model="userInfo.username">
                <i class="fa fa-user input-icon"></i>
            </div>
            <div class="input-wrap">
                <input type="password" class="form-control" placeholder="请输入密码" v-model="userInfo.password" @keyup.enter='login'>
                <i class="fa fa-unlock-alt input-icon"></i>
            </div>
            <span class="text-red" id="error-msg" v-text="errorMsg"></span>
            <button @click="login" id="btn-login">登录</button>
        </div>
    </div>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import {setCookie, getCookie} from '../common/cookie' 

export default {
    mounted () {
        if(getCookie('username')){
            this.$router.push({name: 'home'});
        }
    },
    data () {
        return {
            'userInfo': {
                'username': '',
                'password': ''
            },
            'errorMsg': ''
        }
    },
    methods: {
        login () {
            const _self = this;
            
             _self.errorMsg = '';
            http({
                instance: _self,
                url: api.login,
                type: 'post',
                hasLoading: true,
                data: {
                    data: _self.userInfo
                },
                success (res) {
                    _self.errorMsg = '';
                  	_self.$router.push({name: 'home'});
                },
                fail (res){
                    _self.errorMsg = res.subMsg;
                }
            });
        }
    }
}
</script>
<style scoped>
    #login-wrap {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: url(/src/img/login-bkg.png) center center no-repeat #fff;
        background-size: cover;
    }
    #login-header {
        width: 100%;
        height: 60px;
        background-color: #3697de;
        overflow: hidden;
        padding-left: 80px;
    }
    #login-content {
        width: 470px;
        height: 360px;
        padding: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -180px;
        margin-left: -235px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px #ccc;
    }
    #login-word {
        display: block;
        margin:30px auto;
    }
    #login-content .form-control {
        margin:20px auto;
        width: 80%;
        padding:6px 30px;
        height: 40px;
        background-color: #f7f7f7;
        border-radius: 3px;
    }
    #btn-login {
        display: block;
        border: none;
        outline: none;
        background-color: #3697de;
        color: #fff;
        text-align: center;
        font-size: 16px;
        width: 80%;
        margin:40px auto;
        padding: 15px;
        border-radius: 5px;
        letter-spacing: 10px;
    }
    #btn-login:hover,
    #btn-login:focus,
    #btn-login:active {
        background-color: #238BD8;
    }
    #error-msg {
        display: block;
        width: 100%;
        position: absolute;
        top: 230px;
        left: 0;
        text-align: center;
    }
    .input-wrap {
        position: relative;
    }
    .input-icon {
        position: absolute;
        top: 15px;
        left: 55px;
        color: #71B5E8;
    }
</style>
