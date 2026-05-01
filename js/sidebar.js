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
            var html = '<div class="sidebar-header">';
            html += '<span class="sidebar-title">頁面切換</span>';
            html += '<button class="close-btn" onclick="closeSidebar()"><i class="fas fa-times"></i></button>';
            html += '</div>';
            html += '<div class="sidebar-nav">';
            html += '<a class="menu__item home-link" href="' + (basePath || "./") + 'home.html"><i class="fas fa-home"></i> 回到首頁</a>';
            years.forEach(function (y) {
                var groups = data[y];
                var subId = "submenu" + y;
                html += '<a href="#" id="year-' + subId + '" class="year-toggle" onclick="toggleSubmenu(\'' + subId + '\')">';
                html += '<span>' + y + '</span><span class="year-arrow"><i class="fas fa-chevron-right"></i></span>';
                html += '</a>';
                html += '<ul id="' + subId + '" class="sidebar-ul">';
                groups.forEach(function (g) {
                    var isCurrent = currentYear === y && currentGroup === g;
                    if (isCurrent) {
                        html += '<li><a class="menu__item current-page">' + g + '</a></li>';
                    } else {
                        var href = y === currentYear
                            ? "../" + g + "/" + y + "_" + g + ".html"
                            : basePath + y + "/" + g + "/" + y + "_" + g + ".html";
                        html += '<li><a class="menu__item" href="' + href + '">' + g + '</a></li>';
                    }
                });
                html += '</ul>';
            });
            html += '</div>';
            el.innerHTML = html;

            if (currentYear) {
                var currentSubId = "submenu" + currentYear;
                var currentSubmenu = document.getElementById(currentSubId);
                if (currentSubmenu) {
                    currentSubmenu.style.maxHeight = currentSubmenu.scrollHeight + "px";
                    var yearLink = document.getElementById("year-" + currentSubId);
                    if (yearLink) yearLink.classList.add("open");
                }
            }
        })
        .catch(function (err) { console.error("Sidebar config load failed:", err); });
})();
