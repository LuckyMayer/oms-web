//将订单商品按原始订单排成二维数组
export { dealWithOrderGoods }

function dealWithOrderGoods(data) {
	var tempOrderSns = [];
	var tempArr = [];
	var tempGroupObj = {};
	var orderGoodsNum = 0;
	var totalSkuNum = 0;
	var totalSkuDiscountFee = 0;

	data.forEach(function(item) {//第一次遍历  将商品按原始订单分类

        if(item.group){
        	item.skuCode = item.group.goodsGroupCode;
        	item.numShow = item.groupNum;
        	item.name = item.group.goodsGroupName;
        	var tempKey = item.diffKey;
        	if(tempKey in tempGroupObj){
        		tempGroupObj[tempKey] += 1;
        	}else{
        		tempGroupObj[tempKey] = 1;
        		orderGoodsNum += item.numShow;
        	}
        }else {
        	item.skuCode = item.sku.skuCode;
        	item.numShow = item.number;
        	orderGoodsNum += item.numShow;
        }

    	//计算总的商品优惠
    	totalSkuDiscountFee += item.discountFee ? item.discountFee : 0;
    	//计算总sku数量
    	totalSkuNum += item.number;
    	//
    	item.editable = false;
    	item.splitable = false;
    	item.price = item.price.toFixed(2);
    	item.discountFee = item.discountFee.toFixed(2);
    	item.taxFee = item.taxFee.toFixed(2);
    	item.goodsFee = item.goodsFee.toFixed(2);
    	item.totalFee = item.totalFee.toFixed(2);
    	
    	// item.returnNum = 0;
        if(tempOrderSns.indexOf(item.originOrder.platformOrderId) < 0){
            tempOrderSns.push(item.originOrder.platformOrderId); 
            tempArr[tempOrderSns.indexOf(item.originOrder.platformOrderId)] = [];
        }	        
        tempArr[tempOrderSns.indexOf(item.originOrder.platformOrderId)].push(item);
        
	});

	tempArr.forEach(function(item1) {//第二次遍历  处理套餐
		item1.forEach(function(item2){
			if(item2.group){
				if(item2.diffKey in tempGroupObj){
					item2.rowspan = tempGroupObj[item2.diffKey];
					item2.show = true;
					delete tempGroupObj[item2.diffKey];

				}else {
					item2.show = false;
				}
				
			}else{	
				item2.rowspan = 1;
				item2.show = true;
			}
		});
	});

	return {
		orderGoods: tempArr,
		totalSkuDiscountFee: totalSkuDiscountFee.toFixed(2),
		totalSkuNum: totalSkuNum,
		orderGoodsNum: orderGoodsNum,
		originOrderSns: tempOrderSns,
	};
}