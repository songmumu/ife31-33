
    // 全选事件（全选按钮，其他子选项按钮）
    function allSelected(allInput, allSelect) {
        if ($(allInput).prop("checked")) {
            $.each($(allSelect + ' input'), function() {
                $(this).prop("checked", true);
            })
        } else {
            $.each($(allSelect + ' input'), function() {
                $(this).prop("checked", false);
            })
        }
    }

    allSelected('#all_area', '.region');
    allSelected('#all_product', '.product');
    
    // 点击全选按钮
    $('#all_area').on('click', function() {
        allSelected('#all_area', '.region');
    });
    $('#all_product').on('click', function() {
        allSelected('#all_product', '.product');
    });

    // 单选对全选的影响（所有自选项按钮，全选按钮）
    function singleSelected(allSelect, allInput) {
        $(allSelect + ' input').each(function() {
            $(this).on('click', function() {
                var selectedNum = 0;
                $(allSelect + ' input').each(function() {
                    if ($(this).prop("checked")) {
                        selectedNum++;
                        if (selectedNum === $(allSelect + ' input').length) {
                            $(allInput).prop("checked", true);
                        } else {
                            $(allInput).prop("checked", false);
                        }
                    }
                })
            })
        })
    }
      
    singleSelected('.region', '#all_area');
    singleSelected('.product', '#all_product');

    // 查询后返回的数据
    var data = [];
    // 选中的地区子选项,用来记录被选中的地区
    var regionSelected = [];
    // 选中的产品子选项,用来记录被选中的产品
    var productSelected = [];
    // 选择产品的个数和地区的个数
    var regionLen = 0;
    var productLen = 0;
    // 格式化后的分类合并行数据
    formatProductArr = [];
    formatRegionArr = [];
    // 格式化后tbody的innerHTML
    var monthSale = '';
    // 控制thed类名显示顺序
    var firstCol = '';
    var secondCol = '';
    queryData();
    $("main input").on('click', function() {
        productSelected = [];
        $('.product input').each(function() {
            if ($(this).prop("checked")) {
                productSelected.push($(this).next().text());
            }
        })

        regionSelected = [];
        $('.region input').each(function() {
            if ($(this).prop("checked")) {
                regionSelected.push($(this).next().text());
            }
        })
        regionLen = regionSelected.length;
        productLen = productSelected.length;
        queryData();
    })   

    function queryData() {
        data = [];
        if ($('#all_area').prop("checked") && $('#all_product').prop("checked")) {
            data = sourceData;
        } else if ($('#all_area').prop("checked")) {
            if ($('#mobilePhone').prop("checked")) {
                sourceData.forEach(item => {
                    if (item.product === "手机") {
                        data.push(item);
                    }
                })
            }
            if ($('#toptip').prop("checked")) {
                sourceData.forEach(item => {
                    if (item.product === "笔记本") {
                        data.push(item);
                    }
                })
            }
            if ($('#intelligenceSoundBox').prop("checked")) {
                sourceData.forEach(item => {
                    if (item.product === "智能音箱") {
                        data.push(item);
                    }
                })
            }
        } else if ($('#all_product').prop("checked")) {
            if ($('#north').prop("checked")) {
                sourceData.forEach(item => {
                    if (item.region === "华北") {
                        data.push(item);
                    }
                })
            }
            if ($('#south').prop("checked")) {
                sourceData.forEach(item => {
                    if (item.region === "华南") {
                        data.push(item);
                    }
                })
            }
            if ($('#east').prop("checked")) {
                sourceData.forEach(item => {
                    if (item.region === "华东") {
                        data.push(item);
                    }
                })
            }
        } else {
            var tempData = [];
            $('.region input').each(function() {
                if ($(this).prop("checked")) {
                    sourceData.forEach(item => {
                        if (item.region === $(this).next().text()) {
                            tempData.push(item);
                        }
                    }) 
                }
            })
            $('.product input').each(function() {
                if ($(this).prop("checked")) {
                    tempData.forEach(item => {
                        if (item.product === $(this).next().text()) {
                            data.push(item);
                        }
                    }) 
                }
            })
        }
        formatData(data);
        monthSale = '';
        // 生成tbody表格的innerHTML
        data.forEach((item, index) => {
            var region = '', product = '', sales = '';
            item.sale.forEach(month => {
                sales+='<td>'+month+'</td>';
            })
            if (formatProductArr.length) {
                for (let i = 0, countNum = formatProductArr.length; i < countNum; i++) {
                    for (let j = 0,rowspanNum = formatProductArr[i].rowspan; j < rowspanNum; j++) {
                        if (countNum === 1) {
                            if(index === 0) {
                                monthSale += '<tr><td rowspan='+formatProductArr[i]["rowspan"]+'>'+item.product+'</td><td>'+item.region+'</td>'+sales+'</tr>';
                                break;
                            } else {
                                monthSale += '<tr><td>'+item.region+'</td>'+sales+'</tr>';
                                break;
                            }
                        } else if (countNum > 1) {
                            if((index%rowspanNum) === 0) {
                                monthSale += '<tr><td rowspan='+formatProductArr[i]["rowspan"]+'>'+item.product+'</td><td>'+item.region+'</td>'+sales+'</tr>';
                                break;
                            } else {
                                monthSale += '<tr><td>'+item.region+'</td>'+sales+'</tr>';
                                break;
                            }
                        }
                    }
                    break;
                }
            } else {
                for (let i = 0, countNum = formatRegionArr.length; i < countNum; i++) {
                    for (let j = 0,rowspanNum = formatRegionArr[i].rowspan; j < rowspanNum; j++) {
                        if (countNum === 1) {
                            if(index === 0) {
                                monthSale += '<tr><td rowspan='+formatRegionArr[i]["rowspan"]+'>'+item.region+'</td><td>'+item.product+'</td>'+sales+'</tr>';
                                break;
                            } else {
                                monthSale += '<tr><td>'+item.product+'</td>'+sales+'</tr>';
                                break;
                            }
                        } else if (countNum > 1) {
                            if((index%rowspanNum) === 0) {
                                monthSale += '<tr><td rowspan='+formatRegionArr[i]["rowspan"]+'>'+item.region+'</td><td>'+item.product+'</td>'+sales+'</tr>';
                                break;
                            } else {
                                monthSale += '<tr><td>'+item.product+'</td>'+sales+'</tr>';
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        })
        createTable(monthSale);
    }


    // 渲染表格
    function createTable(monthSale) {
        if (monthSale) {
            var table = `<table class="saleTable"><thead><tr><th rowspan="2">${firstCol}</th><th rowspan="2">${secondCol}</th><th colspan="12">单月销量</th></tr><tr><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr></thead><tbody>${monthSale}</tbody></table>`;
        } else {
            var table = `<table class="saleTable"><thead><tr><th rowspan="2">${firstCol}</th><th rowspan="2">${secondCol}</th><th colspan="12">单月销量</th></tr><tr><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr></thead><tbody><tr><td colspan="14">选择选项查看销售情况</td></tr></tbody></table>`;
        }
        $('#tableWrapper').html(table);
    }
    
    // 返回谁应该做第一列和控制单元行合并的规则
    function formatData(data) {
        if (regionLen === productLen) {
            firstCol = '产品';
            secondCol = '地区';
        } else if (regionLen > productLen) {
            firstCol = '产品';
            secondCol = '地区';
        } else {
            firstCol = '地区';
            secondCol = '产品';
        }
        var tbodyInnerHTML = '';
        // 记录哪个类该合并行的信息
        var regionArr = [];
        var productArr = [];
        data.forEach(function(item, index) {
            var monthSale = '';
            var region = '';
            var product = '';
            if (regionLen >= productLen) {
                if (index === 0) {
                    productArr.push({name: item.product, rowspan: 0}); 
                }
                var num = -1;
                for (let i = 0; i < productArr.length; i++) {
                    if (productArr[i].name === item.product) {   
                        num = i;
                    } else {
                        num = -1;
                    }
                }
                if ( num === -1) {
                    productArr.push({name: item.product, rowspan: 1});
                } else {
                    productArr[num]["rowspan"]++;
                }
            } else {
                if (index === 0) {
                    regionArr.push({name: item.region, rowspan: 0}); 
                }
                var num = -1;
                for (let i = 0; i < regionArr.length; i++) {
                    if (regionArr[i].name === item.region) {   
                        num = i;
                    } else {
                        num = -1;
                    }
                }
                if ( num === -1) {
                    regionArr.push({name: item.region, rowspan: 1});
                } else {
                    regionArr[num]["rowspan"]++;
                }
            }
        })
        // 输出格式化后的合并行规则
        formatProductArr = productArr;
        formatRegionArr = regionArr;
        productArr = [];
        regionArr = [];
    }



    
