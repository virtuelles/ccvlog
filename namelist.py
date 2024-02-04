import pandas as pd
import json

# List of file names
file_names = [
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

for file_name in file_names:
    # Construct the full file path
    file_path = file_name + '.xlsx'

    # Read Excel file
    df = pd.read_excel(file_path, sheet_name=0)

    # Get column names and save as JSON
    names_list = df.columns.tolist()
    json_file_path = file_name + '_name_list.json'

    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(names_list, f, ensure_ascii=False, indent=4)

    print(f"Names list for {file_name} has been saved to {json_file_path}")
