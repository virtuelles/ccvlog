(function () {
    var el = document.getElementById("mySidebar");
    if (!el) return;
    var basePath = el.getAttribute("data-base-path") || ".";
    basePath = basePath.replace(/\/?$/, "") ? basePath.replace(/\/?$/, "") + "/" : "";
    var currentYear = el.getAttribute("data-current-year") || "";
    var currentGroup = el.getAttribute("data-current-group") || "";
    var configUrl = (basePath || "") + "sidebar-config.json";

    fetch(configUrl)
        .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error("sidebar-config")); })
        .then(function (data) {
            var years = Object.keys(data).sort();
            var html = '<a class="menu__item" href="' + (basePath || "./") + 'home.html">回到首頁</a>';
            years.forEach(function (y) {
                var groups = data[y];
                var subId = "submenu" + y;
                html += '<a href="#" onclick="toggleSubmenu(\'' + subId + '\')">' + y + "</a>";
                html += '<ul id="' + subId + '" class="sidebar-ul">';
                groups.forEach(function (g) {
                    var isCurrent = currentYear === y && currentGroup === g;
                    if (isCurrent) {
                        html += '<li><a class="menu__item">' + g + "</a></li>";
                    } else {
                        var href = y === currentYear
                            ? "../" + g + "/" + y + "_" + g + ".html"
                            : basePath + y + "/" + g + "/" + y + "_" + g + ".html";
                        html += '<li><a class="menu__item" href="' + href + '">' + g + "</a></li>";
                    }
                });
                html += "</ul>";
            });
            html += '<a href="javascript:void(0)" class="close-btn" onclick="closeSidebar()">×</a>';
            el.innerHTML = html;
        })
        .catch(function (err) { console.error("Sidebar config load failed:", err); });
})();
