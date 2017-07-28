<template>
    <div style="padding:10px;">
        <div style="margin:5px;" v-for="partyBar in partyBars">
            <div><label v-if="partyBar.groupName" style="font-weight:bold; color: #333333" v-text="partyBar.groupName"></label></div>
            <div>
                <a style="margin:5px;cursor:pointer;font-size:12px;" v-for="party in partyBar.parties" @click="setParty(party)">
                    <label style="cursor:pointer;white-space:nowrap" v-text="party.partyName"></label>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import http from '../common/http'
    import api from '../common/api'

    export default {
        props: ['party'],
        mounted () {
            this.init();
        },
        
        data () {
            return {
                partyBars: [],
                currentParty : null
            }
        },
        
        watch : {
            currentParty(party) {
                this.$emit("choose", party);
            }
        },
        
        methods : {
            init () {
                const _self = this;
                http({
                    instance: _self,
                    url: api.partyBarList,
                    type: 'post',
                    data:{},
                    success (res) {
                        _self.partyBars = res.data;
                        const partyBars = _self.partyBars;
                        let choosedParty = null;
                        for(var i = 0; i < partyBars.length; i++) {
                            var parties = partyBars[i].parties;
                            for(var j = 0; j < parties.length; j++) {
                            	var party = parties[j];
                            	if(!choosedParty) {
                            		choosedParty = party;
                            	}
                                if(_self.party) {
                                	if(_self.party.partyId == party.partyId) {
                                		choosedParty = party;
                                		break;
                                	}
                                }
                            }
                        }
                        if(choosedParty) {
							_self.setParty(choosedParty);                        	
                        } else {
							_self.currentParty = {partyName : "无业务组权限，请找管理员申请"}
                        }
                    }
                });
            },
            
            setParty(party) {
            	if(!party) return;
            	if(this.currentParty && party.partyId == this.currentParty.partyId) {
					return; //相同的业务组
            	}
            	this.currentParty = party;
            	const _self = this;
                http({
                    instance: _self,
                    url: api.switchParty,
                    type: 'post',
                    data:{partyId : party.partyId},
                    loadingParam : {
                    	target : document.body
                    },
                    success (res) {
                       	const userSession = res.data;
                       	_self.currentParty = userSession.currentParty;
                    }
                });
            }
        }
    }
</script>