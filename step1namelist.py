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
    "2024/vspo/2024_vspo",
    "2024/vspoEN/2024_vspoEN"
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