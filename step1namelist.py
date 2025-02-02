import pandas as pd
import json

# List of file names
file_names = [
    "2025/hololiveEN/2025_hololiveEN",
    "2025/hololiveID/2025_hololiveID",
    "2025/hololiveJP/2025_hololiveJP",
    "2025/holostarsEN/2025_holostarsEN",
    "2025/holostarsJP/2025_holostarsJP",
    "2025/NeoPorte/2025_NeoPorte",
    "2025/nijisanjiEN/2025_nijisanjiEN",
    "2025/nijisanjiID/2025_nijisanjiID",
    "2025/nijisanjiJP/2025_nijisanjiJP",
    "2025/nijisanjiKR/2025_nijisanjiKR",
    "2025/vspo/2025_vspo",
    "2025/vspoEN/2025_vspoEN"
]

selected_sheet = input("選擇月份01~12(有新人時注意要用最新的月份): ")

for file_name in file_names:
    # Construct the full file path for Excel file
    file_path = file_name + '.xlsx'

    # Read Excel file
    xl = pd.ExcelFile(file_path)

    # Let the user choose the sheet

    # Check if the selected sheet exists in the Excel file
    if selected_sheet in xl.sheet_names:
        # Read the selected sheet
        df = pd.read_excel(file_path, sheet_name=selected_sheet)

        # Get column names and save as JSON
        names_list = df.columns.tolist()
        json_file_path = file_name + '_name_list.json'

        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(names_list, f, ensure_ascii=False, indent=4)

        print(f"Names list for {file_name} ({selected_sheet}) has been saved to {json_file_path}")
    else:
        print(f"The selected sheet '{selected_sheet}' does not exist in {file_path}. Skipping...")