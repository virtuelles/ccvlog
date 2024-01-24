import pandas as pd
import json

# 讀取Excel檔案
file_name = input("請輸入檔名和路徑：")
df = pd.read_excel(file_name+'.xlsx')

# 獲取第一行的名稱並轉換為列表
names_list = df.columns.tolist()

# 將名稱列表保存為json檔
json_file_path = file_name + '_name_list.json'
with open(json_file_path, 'w', encoding='utf-8') as f:
    json.dump(names_list, f, ensure_ascii=False, indent=4)

print(f"Names list has been saved to {json_file_path}")
