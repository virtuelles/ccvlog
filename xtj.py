import pandas as pd
import json
import os
import math

def process_excel_file(file_path):
    # 讀取Excel檔案
    xls = pd.ExcelFile(file_path + '.xlsx')
    
    # 取得檔案名稱（不包括路徑和擴展名）
    group = os.path.basename(file_path).split('/')[-1].split('_')[1]
    
    # 初始化一個空的字典來存放結果
    results = {}
    
    # 逐一處理01至12的分頁
    for month in range(1, 13):
        sheet_name = f"{month:02}"  # 格式化月份，例如01, 02, ..., 12
        df = pd.read_excel(xls, sheet_name=sheet_name)
        
        # 如果分頁名稱是 "com"，則跳過該分頁
        if 'com' in df.columns:
            continue
        
        # 逐一處理每一個name
        for name in df.columns:
            # 確認該name是否存在於結果字典中，如果不存在，則初始化
            if name not in results:
                results[name] = {
                    "Name": name,
                    "Group": group,
                    "medianData": [],
                    "averageData": [],
                    "streams": []  # 新增 streams 欄位
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
            results[name]["medianData"].append(median_value)
            results[name]["averageData"].append(average_value)
            results[name]["streams"].append(streams_count)  # 新增 streams 資料
            
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
            if len(data["medianData"]) >= month and len(data["averageData"]) >= month and len(data["streams"]) >= month:
                json_data["data"][month_key] = {
                    "median": data["medianData"][month - 1],
                    "average": data["averageData"][month - 1],
                    "streams": data["streams"][month - 1]  # 新增 streams 欄位
                }
        
        json_file_name = f"{file_path}_{name}.json"
        with open(json_file_name, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=4)
    
    return results

# 假設您有一個名為"hololive.xlsx"的檔案
file_path = input("請輸入檔名路徑(不要副檔名)：")
process_excel_file(file_path)
