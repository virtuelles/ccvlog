import pandas as pd
import json

# List of file names
file_names = [
    "2026/hololiveEN/2026_hololiveEN",
    "2026/hololiveID/2026_hololiveID",
    "2026/hololiveJP/2026_hololiveJP",
    "2026/holostarsEN/2026_holostarsEN",
    "2026/holostarsJP/2026_holostarsJP",
    "2026/NeoPorte/2026_NeoPorte",
    "2026/nijisanjiEN/2026_nijisanjiEN",
    "2026/nijisanjiID/2026_nijisanjiID",
    "2026/nijisanjiJP/2026_nijisanjiJP",
    "2026/nijisanjiKR/2026_nijisanjiKR",
    "2026/vspo/2026_vspo",
    "2026/vspoEN/2026_vspoEN"
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