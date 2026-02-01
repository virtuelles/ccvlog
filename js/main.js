var config = window.CCVLOG_CONFIG
    ? {
        year: window.CCVLOG_CONFIG.year,
        dataType: window.CCVLOG_CONFIG.dataType,
        title: window.CCVLOG_CONFIG.dataType + " " + window.CCVLOG_CONFIG.year + " Median CCV Log",
        nameListUrl: window.CCVLOG_CONFIG.year + "_" + window.CCVLOG_CONFIG.dataType + "_name_list.json",
        chartTitle: "Combined " + window.CCVLOG_CONFIG.dataType + " " + window.CCVLOG_CONFIG.year + " Median Data Line Chart"
    }
    : {};

async function fetchNames() {
    try {
        var response = await fetch(config.nameListUrl);
        var names = await response.json();
        return names;
    } catch (error) {
        console.error("錯誤:", error);
        throw error;
    }
}
async function transformNamesToIds(names) {
    return names.map(function (name, index) {
        return { id: index + 1, name: name };
    });
}

function loadScript(url) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function doExportDataTableAsJpg(tableElement) {
    html2canvas(tableElement, {
        useCORS: true,
        scale: 1,
        backgroundColor: "#ffffff",
        logging: false
    }).then(function (canvas) {
        var maxWidth = 1200;
        var ratio = canvas.width > maxWidth ? maxWidth / canvas.width : 1;
        var w = Math.round(canvas.width * ratio);
        var h = Math.round(canvas.height * ratio);
        if (ratio < 1) {
            var small = document.createElement("canvas");
            small.width = w;
            small.height = h;
            var ctx = small.getContext("2d");
            ctx.drawImage(canvas, 0, 0, w, h);
            canvas = small;
        }
        var link = document.createElement("a");
        link.download = (config.dataType || "dataTable") + "_" + (config.year || "") + "_table.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.8);
        link.click();
    }).catch(function (err) {
        console.error("匯出 JPG 失敗:", err);
    });
}

function exportDataTableAsJpg() {
    var table = document.getElementById("dataTable");
    if (!table) return;
    if (typeof html2canvas === "undefined") {
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js")
            .then(function () { doExportDataTableAsJpg(table); })
            .catch(function (err) { console.error("無法載入 html2canvas:", err); });
    } else {
        doExportDataTableAsJpg(table);
    }
}

function addDataTableExportJpgButton() {
    var mainEl = document.getElementById("main");
    if (!mainEl) return;
    var btn = document.createElement("button");
    btn.id = "exportTableJpg";
    btn.type = "button";
    btn.innerHTML = "<i class=\"fa-solid fa-image\"></i><span class=\"toggle-text\">匯出表格為 JPG</span>";
    btn.addEventListener("click", exportDataTableAsJpg);
    mainEl.appendChild(btn);
}

async function main() {
    try {
        var names = await fetchNames();
        var namesWithId = await transformNamesToIds(names);
        var seriesData = [];

        function populateDataTable() {
            var firstSeriesData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var months = Object.keys(firstSeriesData);

            var tableHeadRow = document.querySelector("#dataTable thead tr");
            firstSeriesData.forEach(function (month) {
                var th = document.createElement("th");
                th.textContent = month;
                tableHeadRow.appendChild(th);
            });

            seriesData.forEach(function (series) {
                var newRow = document.createElement("tr");
                var idCell = document.createElement("td");
                idCell.textContent = series.id;
                newRow.appendChild(idCell);
                var nameCell = document.createElement("td");
                nameCell.textContent = series.name;
                newRow.appendChild(nameCell);

                var previousValue = null;

                months.forEach(function (month) {
                    var dataValue = series.data[month];
                    var streamsValue = series.streams[month];
                    var dataCell = document.createElement("td");
                    var streamsSpan = document.createElement("span");
                    if (dataValue !== null) {
                        streamsSpan.textContent = "Streams: " + streamsValue;
                        if (streamsValue <= 5) {
                            streamsSpan.style.color = "blue";
                        }
                        if (previousValue !== null) {
                            var growthRate = ((dataValue - previousValue) / previousValue) * 100;
                            var triangle = document.createElement("span");
                            triangle.className = "triangle";
                            if (growthRate > 0) {
                                triangle.textContent = "▲";
                                triangle.style.color = "red";
                            } else if (growthRate < 0) {
                                triangle.textContent = "▼";
                                triangle.style.color = "green";
                            }
                            dataCell.appendChild(document.createTextNode(dataValue));
                            dataCell.appendChild(document.createElement("br"));
                            dataCell.appendChild(triangle);
                            dataCell.appendChild(document.createTextNode("(" + growthRate.toFixed(2) + "%)"));
                            dataCell.appendChild(document.createElement("br"));
                            dataCell.appendChild(streamsSpan);
                        } else {
                            dataCell.textContent = dataValue;
                            dataCell.appendChild(document.createElement("br"));
                            streamsSpan.style.whiteSpace = "nowrap";
                            dataCell.appendChild(streamsSpan);
                        }
                    }
                    previousValue = dataValue;

                    switch (true) {
                        case dataValue >= 1 && dataValue <= 499:
                            dataCell.style.backgroundColor = "#d0cece";
                            break;
                        case dataValue >= 500 && dataValue <= 999:
                            dataCell.style.backgroundColor = "#d9e1f2";
                            break;
                        case dataValue >= 1000 && dataValue <= 4999:
                            dataCell.style.backgroundColor = "#ddebf7";
                            break;
                        case dataValue >= 5000 && dataValue <= 9999:
                            dataCell.style.backgroundColor = "#e2efda";
                            break;
                        case dataValue >= 10000 && dataValue <= 19999:
                            dataCell.style.backgroundColor = "#c6e0b4";
                            break;
                        case dataValue >= 20000 && dataValue <= 29999:
                            dataCell.style.backgroundColor = "#fff2cc";
                            break;
                        case dataValue >= 30000 && dataValue <= 39999:
                            dataCell.style.backgroundColor = "#fce4d6";
                            break;
                        case dataValue >= 40000 && dataValue <= 49999:
                            dataCell.style.backgroundColor = "#f8cbad";
                            break;
                        case dataValue >= 50000:
                            dataCell.style.backgroundColor = "#f4b084";
                            break;
                        default:
                            dataCell.style.backgroundColor = "#e6e6e6";
                            dataCell.textContent = "";
                            break;
                    }

                    newRow.appendChild(dataCell);
                });

                document.querySelector("#dataTable tbody").appendChild(newRow);
            });
        }

        function loadAndDrawChart(name) {
            var matchedName = namesWithId.find(function (item) { return item.name === name; });
            var id = matchedName ? matchedName.id : null;

            return fetch(config.year + "_" + config.dataType + "_" + name + ".json")
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    var seriesDataForMonths = Object.entries(data.data)
                        .sort(function (a, b) { return parseInt(a[0], 10) - parseInt(b[0], 10); })
                        .map(function (entry) {
                            var month = entry[0];
                            var values = entry[1];
                            return { month: month, median: values.median, streams: values.streams };
                        });

                    var medianData = seriesDataForMonths.map(function (item) { return item.median; });
                    var streamsData = seriesDataForMonths.map(function (item) { return item.streams; });

                    var series = {
                        id: id,
                        name: name,
                        data: medianData,
                        streams: streamsData
                    };

                    seriesData.push(series);
                })
                .catch(function (error) {
                    console.error("Error fetching " + name + " data:", error);
                });
        }

        function getBaseColors() {
            return fetch("baseColors.json").then(function (res) { return res.json(); });
        }
        function getSubColors() {
            return fetch("subColors.json").then(function (res) { return res.json(); });
        }

        var baseColors = await getBaseColors();
        var subColors = await getSubColors();

        var monthAbbreviations = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        Promise.all(names.map(function (name) { return loadAndDrawChart(name); }))
            .then(function () {
                if (seriesData.length === 0) return;
                var labels = Object.keys(seriesData[0].data).map(function (month) {
                    var monthNumber = parseInt(month, 10);
                    return monthAbbreviations[monthNumber];
                });
                var delayed;
                var ctx = document.getElementById("container").getContext("2d");
                var container = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: seriesData.map(function (series) {
                            return {
                                label: series.name,
                                data: series.data,
                                backgroundColor: baseColors[series.name] || "#000000",
                                borderColor: subColors[series.name] || "#000000",
                                fill: false
                            };
                        })
                    },
                    options: {
                        plugins: {
                            title: { display: true, text: config.title },
                            legend: { position: "bottom" }
                        },
                        animation: {
                            onComplete: function () { delayed = true; },
                            delay: function (context) {
                                var delay = 0;
                                if (context.type === "data" && context.mode === "default" && !delayed) {
                                    delay = context.dataIndex * 200 + context.datasetIndex * 1;
                                }
                                return delay;
                            }
                        }
                    }
                });
                document.getElementById("toggle").addEventListener("click", function () {
                    container.data.datasets.forEach(function (ds) {
                        ds.hidden = !ds.hidden;
                    });
                    container.update();
                });
                populateDataTable();
                if (typeof $ !== "undefined" && $.fn.dataTable) {
                    $.fn.dataTable.ext.order["data-value"] = function (settings, col) {
                        return this.api().column(col, { order: "index" }).nodes().map(function (td) {
                            var text = $(td).text();
                            var match = text.match(/^\d+/);
                            return match ? parseInt(match[0], 10) : 0;
                        });
                    };
                    $("#dataTable").DataTable({
                        fixedHeader: false,
                        paging: false,
                        info: false,
                        columnDefs: [{
                            targets: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            orderDataType: "data-value",
                            type: "numeric"
                        }]
                    });
                }
                addDataTableExportJpgButton();
            });
    } catch (error) {
        console.error("發生錯誤:", error);
    }
}

if (config.year && config.dataType) {
    document.title = config.title;
    main();
}
