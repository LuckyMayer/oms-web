<template>
	<div>
		<component is="overlay" v-if="showOverlay" :on-click="cancelInvoice"></component>
		<div class="order-detail-modal invoice-modal">
        	<div class="order-invoice-content">
        		<div class="col-md-12 form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-4 control-label">发票类型：</label>
                        <div class="col-sm-6">
                        <component is="select-invoice-type" :default-invoice-type="invoice.invoiceType" @selected="selectedInvoiceType"></component>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 form-horizontal" v-if="invoice.invoiceType=='1'">
                    <div class="form-group">
                        <label class="col-sm-4 control-label">单位抬头：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">注册地址：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">税号：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">开户银行：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">银行账号：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">内容：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">开票金额：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">发票收件人：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">发票手机号：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">固定电话：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">发票收件地址：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">具体地址：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">邮编：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">指定寄出快递：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">备注：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
    			</div>
        		<div class="col-md-12 form-horizontal" v-if="invoice.invoiceType=='2'">
                    <div class="form-group">
                        <label class="col-sm-4 control-label">抬头：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">内容：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">开票金额：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">发票收件人：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">发票手机号：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">固定电话：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">发票收件地址：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">具体地址：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">邮编：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">指定寄出快递：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">备注：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
    			</div>
        		<div class="col-md-12 form-horizontal" v-if="invoice.invoiceType=='3'">
                    <div class="form-group">
                        <label class="col-sm-4 control-label">抬头：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">内容：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">开票金额：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">发送邮箱：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">备注：</label>
                        <div class="col-sm-6">
                           <input type="text" class="input-sm form-control">
                        </div>
                    </div>
    			</div>
    			<div class="col-md-12 form-horizontal action-buttons">
    				<div class="col-md-3 action-button"></div>
    				<div class="col-md-3 action-button">
    				<button class="btn btn-xs btn-default btn-cancel" @click="cancelInvoice">取消</button>
    				</div>
    				<div class="col-md-3 action-button">
    				<button class="btn btn-xs btn-primary">申请开票</button>
    				</div>
    			</div>
        	</div>
    	</div>
	</div>
</template>

<script>
import http from '../../../common/http'
import api from '../../../common/api'
import overlay from '../../../component/overlay'
import selectInvoiceType from '../../../component/selectInvoiceType'

export default {
	data () {
		return {
			invoice: {
            	invoiceType: "1",
            },
		}
	},
	props: {
	    showOverlay: {
	      	type: Boolean,
	      	default: true
	    },
	},
	computed: {
	    
	},
	methods: {
        cancelInvoice () {
        	this.$emit('cancel', false);
        },
        selectedInvoiceType (data) {
            this.invoice.invoiceType = data.data;
        }
	},
	components: {overlay,selectInvoiceType}
}
</script>

<style scoped>
.order-detail-modal {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;	
	background-color: #fff;
	margin: 60px auto;
	float: none;
	opacity: 1;
	padding: 20px 5px;
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 90%;
	z-index: 1002;
}
.invoice-modal {
	width: 600px;
}
</style>