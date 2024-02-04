import pandas as pd
import json
import os
import math

def process_excel_file(file_path, namelist_path):
    # Read the name list from namelist.json
    with open(namelist_path, 'r', encoding='utf-8') as namelist_file:
        namelist = json.load(namelist_file)
    
    # 讀取Excel檔案
    xls = pd.ExcelFile(file_path + '.xlsx')
    
    # 取得檔案名稱（不包括路徑和擴展名）
    group = os.path.basename(file_path).split('/')[-1].split('_')[1]
    
    # 初始化一個空的字典來存放結果
    results = {}
    
    # 初始化results字典的結構，使用namelist作為基礎
    for name in namelist:
        results[name] = {
            "Name": name,
            "Group": group,
            "medianData": [None] * 12,  # 12 months initialized with None
            "averageData": [None] * 12,  # 12 months initialized with None
            "streams": [None] * 12  # 12 months initialized with None
        }
    
    # 逐一處理01至12的分頁
    for month in range(1, 13):
        sheet_name = f"{month:02}"  # 格式化月份，例如01, 02, ..., 12
        df = pd.read_excel(xls, sheet_name=sheet_name)
        
        # 如果分頁名稱是 "com"，則跳過該分頁
        if 'com' in df.columns:
            continue
        
        # 逐一處理每一個name
        for name in df.columns:
            # 檢查該name是否在namelist中，如果不在，則跳過
            if name not in namelist:
                continue
            
            # 確認該name是否存在於結果字典中，如果不存在，則初始化
            if name not in results:
                results[name] = {
                    "Name": name,
                    "Group": group,
                    "medianData": [None] * 12,
                    "averageData": [None] * 12,
                    "streams": [None] * 12
                }
            
            # 計算中位數和平均數
            median_value = df[name].median()
            average_value = df[name].mean()
            
            # 處理 NaN 值
            median_value = int(median_value) if not math.isnan(median_value) else None
            average_value = int(average_value) if not math.isnan(average_value) else None
            
            # 計算streams數量
            streams_count = len(df[name].dropna())
            
            # 將中位數、平均數和streams數量加入到結果字典中的該name下
            results[name]["medianData"][month - 1] = median_value
            results[name]["averageData"][month - 1] = average_value
            results[name]["streams"][month - 1] = streams_count
    
    # 將結果字典存為新的JSON檔案結構
    for name, data in results.items():
        json_data = {
            "Name": data["Name"],
            "Group": group,
            "data": {}
        }
        
        # 添加每個月份的數據
        for month in range(1, 13):
            month_key = f"{month:02}"  # 格式化月份，例如01, 02, ..., 12
            json_data["data"][month_key] = {
                "median": data["medianData"][month - 1],
                "average": data["averageData"][month - 1],
                "streams": data["streams"][month - 1]
            }
        
        json_file_name = f"{file_path}_{name}.json"
        with open(json_file_name, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=4)
    
    return results

# List of file paths
file_paths = [
    "2024/hololiveEN/2024_hololiveEN",
    "2024/hololiveID/2024_hololiveID",
    "2024/hololiveJP/2024_hololiveJP",
    "2024/holostarsEN/2024_holostarsEN",
    "2024/holostarsJP/2024_holostarsJP",
    "2024/NeoPorte/2024_NeoPorte",
    "2024/nijisanjiEN/2024_nijisanjiEN",
    "2024/nijisanjiID/2024_nijisanjiID",
    "2024/nijisanjiJP/2024_nijisanjiJP",
    "2024/nijisanjiKR/2024_nijisanjiKR",
    "2024/vspo/2024_vspo"
]

# Process each file path
for path in file_paths:
    namelist_path = path + "_name_list.json"
    process_excel_file(path, namelist_path)
