const config = {
    year: "2024", // 可以是 "2022" 或 "2023"
    dataType: "nijisanjiJP", // 可以是 "hololive"、"holostars"、"vspo" 等
};

// 在這裡初始化 title、nameListUrl 和 jsonDataUrl
config.title = `${config.dataType} ${config.year} Median CCV Log`; // 標題
config.nameListUrl = `${config.year}_${config.dataType}_name_list.json`; // 名稱列表 JSON 的 URL
config.jsonDataUrl = `${config.year}_${config.dataType}.json`; // 數據 JSON 的 URL
// config.jsonDataUrl = `${config.year}_${config.dataType}.json`; // 數據 JSON 的 URL

config.chartTitle = `Combined ${config.dataType} ${config.year} Median Data Line Chart`; // 圖表標題

// 將 config 物件匯出
export default config;