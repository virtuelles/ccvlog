# -*- coding: utf-8 -*-
"""Generate minimal YYYY_groupName.html from sidebar-config.json."""
import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

def main():
    with open(os.path.join(ROOT, "sidebar-config.json"), "r", encoding="utf-8") as f:
        config = json.load(f)
    base_path = "../../"
    for year, groups in config.items():
        for group in groups:
            filename = "{}_{}.html".format(year, group)
            dirpath = os.path.join(ROOT, year, group)
            filepath = os.path.join(dirpath, filename)
            if not os.path.isdir(dirpath):
                continue
            html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/1.13.8/css/dataTables.bootstrap5.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/fixedcolumns/4.3.0/css/fixedColumns.dataTables.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/fixedheader/3.4.0/css/fixedHeader.dataTables.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.dataTables.min.css" rel="stylesheet">
    <link href="../../styles.css" rel="stylesheet">
</head>
<body>
<script>window.CCVLOG_CONFIG = {{ year: "{year}", dataType: "{group}" }};</script>
    <div id="mySidebar" class="sidebar" data-base-path="../../" data-current-year="{year}" data-current-group="{group}"></div>
    <div class="overlay" onclick="closeSidebar()"></div>
    <div id="main">
        <button class="open-sidebar-btn" onclick="openSidebar()">
            <i class="fas fa-bars"></i>
            <span class="toggle-text">頁面切換</span>
        </button>
        <button id="toggle">
            <i class="fa-solid fa-filter"></i>
            <span class="toggle-text">反向選取</span>
        </button>
    </div>
    <canvas id="container" style="width: 100%; height: 700px; border: 1px solid #000;"></canvas>
    <div class="container mt-5">
        <table id="dataTable" class="table table-hover table-bordered" style="width:100%">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.8/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
<script src="https://cdn.datatables.net/fixedcolumns/4.3.0/js/dataTables.fixedColumns.min.js"></script>
<script src="https://cdn.datatables.net/fixedheader/3.4.0/js/dataTables.fixedHeader.min.js"></script>
<script src="../../js/common.js"></script>
<script src="../../js/sidebar.js"></script>
<script src="../../js/main.js"></script>
<footer>
    <p>本資料來源: <a href="https://vrabi.net">vrabi.net</a>，僅供參考。如發現資料錯誤或 Bug 請至 Github 發 issue : <a href="https://github.com/virtuelles/ccvlog">github.com/virtuelles/ccvlog</a></p>
</footer>
</body>
</html>
""".format(year=year, group=group)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(html)
            print("Wrote " + filepath)

if __name__ == "__main__":
    main()
