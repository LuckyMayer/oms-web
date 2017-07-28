export { getDateStr }

//获取当前时间
function getDateStr(AddDayCount,hms) 
{ 
    var dd = new Date(); 
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear(); 
    var M = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
    var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate(); //获取当前几号，不足10补0
    var H = dd.getHours()<10?"0"+dd.getHours():dd.getHours();
    var m = dd.getMinutes()<10?"0"+dd.getMinutes():dd.getMinutes();
    var s = dd.getSeconds()<10?"0"+dd.getSeconds():dd.getSeconds();
    if (hms) {
        return y+"-"+M+"-"+d+" "+H+":"+m+":"+s; 
    }else{
        return y+"-"+M+"-"+d; 
    }
}