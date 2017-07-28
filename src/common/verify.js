// 验证字符串str是否为JSON格式
function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }

    return true;
}

export { isJSON }
