import config from './config.js';

async function fetchNames() {
    try {
        const response = await fetch(config.nameListUrl);
        const names = await response.json();
        return names;
    } catch (error) {
        console.error('錯誤:', error);
        throw error; // 重新拋出錯誤以便其他部分可以捕獲它
    }
}
async function transformNamesToIds(names) {
    return names.map((name, index) => {
        return { id: index + 1, name: name };
    });
}

// 主函數用於加載數據和繪製圖表
async function main() {
    try {
        const names = await fetchNames(); // 等待 name_list.json 的讀取
        // console.log(names); // 打印 names 陣列
        const namesWithId = await transformNamesToIds(names); // 轉換 names 為 namesWithId
        // console.log(namesWithId); // 打印轉換後的 namesWithId
        // 定義一個空的數據系列列表
        let seriesData = [];

        function populateDataTable() {
            const firstSeriesData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const months = Object.keys(firstSeriesData);

            // 填充月份到表頭
            const tableHeadRow = document.querySelector('#dataTable thead tr');
            firstSeriesData.forEach(month => {
                const th = document.createElement('th');
                th.textContent = month;
                tableHeadRow.appendChild(th);
            });

            // 填充名稱和相應的數據到表格
            seriesData.forEach(series => {
                const newRow = document.createElement('tr');
                const idCell = document.createElement('td');
                idCell.textContent = series.id;
                newRow.appendChild(idCell);
                const nameCell = document.createElement('td');
                nameCell.textContent = series.name;
                newRow.appendChild(nameCell);

                let previousValue = null; // 用於保存前一個月的數據值

                months.forEach(month => {
                    const dataValue = series.data[month];
                    const streamsValue = series.streams[month];
                    const dataCell = document.createElement('td');
                    const streamsSpan = document.createElement('span');
                    if (dataValue !== null) {
                        streamsSpan.textContent = `Streams: ${streamsValue}`; // 在 dataCell 中顯示 streams 數據
                        if (streamsValue <= 5) {
                            streamsSpan.style.color = 'blue';
                        }
                        if (previousValue !== null) {
                            const growthRate = ((dataValue - previousValue) / previousValue) * 100; // 計算成長率

                            const triangle = document.createElement('span');
                            triangle.className = 'triangle'; // 添加一個類名稱用於樣式

                            if (growthRate > 0) {
                                triangle.textContent = '▲'; // 正三角形
                                triangle.style.color = 'red'; // 紅色
                            } else if (growthRate < 0) {
                                triangle.textContent = '▼'; // 倒三角形
                                triangle.style.color = 'green'; // 綠色
                            }
                            dataCell.appendChild(document.createTextNode(dataValue));
                            dataCell.appendChild(document.createElement('br'));
                            dataCell.appendChild(triangle);
                            dataCell.appendChild(document.createTextNode(`(${growthRate.toFixed(2)}%)`));
                            dataCell.appendChild(document.createElement('br')); // 插入一個斷行
                            dataCell.appendChild(streamsSpan); // 附加 streams 數據
                        } else {
                            dataCell.textContent = dataValue; // 如果是第一個月，僅顯示數據值
                            dataCell.appendChild(document.createElement('br'));
                            streamsSpan.style.whiteSpace = 'nowrap';
                            dataCell.appendChild(streamsSpan);
                        }
                    }
                    previousValue = dataValue;

                    // 使用 switch 語句來根據數值範圍設定背景顏色
                    switch (true) {
                        case dataValue >= 0 && dataValue <= 500:
                            dataCell.style.backgroundColor = '#d0cece';
                            break;
                        case dataValue >= 501 && dataValue <= 1000:
                            dataCell.style.backgroundColor = '#d9e1f2';
                            break;
                        case dataValue >= 1001 && dataValue <= 5000:
                            dataCell.style.backgroundColor = '#ddebf7';
                            break;
                        case dataValue >= 5001 && dataValue <= 10000:
                            dataCell.style.backgroundColor = '#e2efda';
                            break;
                        case dataValue >= 10001 && dataValue <= 20000:
                            dataCell.style.backgroundColor = '#c6e0b4';
                            break;
                        case dataValue >= 20001 && dataValue <= 30000:
                            dataCell.style.backgroundColor = '#fff2cc';
                            break;
                        case dataValue >= 30001 && dataValue <= 40000:
                            dataCell.style.backgroundColor = '#fce4d6';
                            break;
                        case dataValue >= 40001 && dataValue <= 50000:
                            dataCell.style.backgroundColor = '#f8cbad';
                            break;
                        case dataValue >= 50001:
                            dataCell.style.backgroundColor = '#f4b084';
                            break;
                        default:
                            dataCell.style.backgroundColor = '#fafafa';
                            dataCell.textContent = '';
                            // 如果沒有匹配的情況，您可以選擇不設置背景顏色或者設置一個默認值
                            break;
                    }

                    newRow.appendChild(dataCell);
                });

                document.querySelector('#dataTable tbody').appendChild(newRow);
            });
        }
        //在修改的loadAndDrawChart函数中，对seriesDataForMonths数组进行了修改，以确保按月份键的顺序进行排序，从"01"开始。具体修正如下：
        // 使用Object.entries(data.data)获取一个包含[month, values]键值对的数组。
        // 使用.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))根据月份键的整数值进行排序，以确保按照月份的顺序排列。
        // 使用.map(([month, values]) => ({ month, median: values.median, streams: values.streams }))从排序后的数组中提取出median和streams值，形成新的数组seriesDataForMonths。
        // 定義一個函數來加載並繪製每個JSON文件
        function loadAndDrawChart(name) {
            const matchedName = namesWithId.find(item => item.name === name);
            const id = matchedName ? matchedName.id : null;

            return fetch(`${config.year}_${config.dataType}_${name}.json`)
                .then(response => response.json())
                .then(data => {
                    const seriesDataForMonths = Object.entries(data.data)
                        .sort((a, b) => parseInt(a[0]) - parseInt(b[0])) // Sort based on month keys
                        .map(([month, values]) => ({
                            month: month,
                            median: values.median,
                            streams: values.streams
                        }));

                    // console.log(`Data for ${name}:`, seriesDataForMonths);

                    const medianData = seriesDataForMonths.map(item => item.median);
                    const streamsData = seriesDataForMonths.map(item => item.streams);

                    const series = {
                        id: id,
                        name: name,
                        data: medianData,
                        streams: streamsData
                    };

                    seriesData.push(series);
                })
                .catch(error => {
                    console.error(`Error fetching ${name} data:`, error);
                });
        }
        async function getBaseColors() {
            const response = await fetch('baseColors.json');
            const colors = await response.json();
            return colors;
        }
        async function getSubColors() {
            const response = await fetch('subColors.json');
            const colors = await response.json();
            return colors;
        }

        // 在创建 Line Chart 时使用 colors.json 中的颜色
        const baseColors = await getBaseColors(); // 获取颜色映射
        const subColors = await getSubColors(); // 获取颜色映射

        const monthAbbreviations = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        // 使用 Promise.all 來確保所有數據都被加載
        Promise.all(names.map(name => loadAndDrawChart(name)))
            .then(() => {

                // Assuming that seriesData[0].data has all the months, get labels directly
                const labels = Object.keys(seriesData[0].data).map(month => {
                    const monthNumber = parseInt(month, 10);
                    return monthAbbreviations[monthNumber];
                });
                // console.log(labels)
                let delayed;
                // 创建一个 Line Chart
                const ctx = document.getElementById('container').getContext('2d');
                const container = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: seriesData.map(series => ({
                            label: series.name,
                            data: series.data,
                            backgroundColor: baseColors[series.name] || '#000000', // 如果找不到颜色，默认使用黑色
                            borderColor: subColors[series.name] || '#000000', // 如果找不到颜色，默认使用黑色
                            fill: false,
                        }))
                    },
                    options: {
                        plugins: {
                            title: {
                                display: true,
                                text: config.title
                            },
                            legend: {
                                position: 'bottom',
                            }
                        },
                        animation: {
                            onComplete: () => {
                                delayed = true;
                            },
                            delay: (context) => {
                                let delay = 0;
                                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                    delay = context.dataIndex * 200 + context.datasetIndex * 1;
                                }
                                return delay;
                            },
                        },
                    },
                });
                $("#toggle").click(function () {
                    container.data.datasets.forEach(function (ds) {
                        ds.hidden = !ds.hidden;
                    });
                    container.update();
                });
                // 填充 DataTable
                populateDataTable();
                // 定義自訂排序方法
                $.fn.dataTable.ext.order['data-value'] = function (settings, col) {
                    return this.api().column(col, { order: 'index' }).nodes().map(td => {
                        const text = $(td).text();
                        // 從"6883▲(62.11%)Streams: 17"中獲取6883
                        const match = text.match(/^\d+/);
                        // 確保匹配到了值，然後轉換為浮點數
                        const value = match ? parseInt(match[0], 10) : 0;
                        // console.log(value); // 打印提取的數字值以進行檢查
                        return value; // 返回提取的數字值
                    });
                };
                // 初始化 DataTable
                $('#dataTable').DataTable({
                    fixedHeader: true,
                    paging: false,
                    // responsive: true, // Enable responsiveness
                    scrollX: true,
                    fixedColumns: {  // Add fixedColumns option
                        leftColumns: 2,  // Number of columns to fix on the left (0-based index)
                    },
                    info: false, // 移除資訊列
                    columnDefs: [{
                        targets: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // 假設你有12個月份的列，從索引3開始
                        orderDataType: 'data-value', // 使用自訂排序類型
                        type: 'numeric' // 確保該列的數據類型為數字
                    }]
                });
                // new $.fn.dataTable.FixedHeader(dataTable);
            });

    } catch (error) {
        console.error('發生錯誤:', error);
    }
}

main();