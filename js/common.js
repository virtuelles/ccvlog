function openSidebar() {
    document.getElementById("mySidebar").style.transform = "translateX(260px)";
    document.querySelector(".overlay").classList.add("active");
}

function closeSidebar() {
    document.getElementById("mySidebar").style.transform = "translateX(0px)";
    document.querySelector(".overlay").classList.remove("active");
}

function toggleSubmenu(id) {
    var submenu = document.getElementById(id);
    var isOpen = !!submenu.style.maxHeight;
    submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + "px";
    var yearLink = document.getElementById("year-" + id);
    if (yearLink) yearLink.classList.toggle("open", !isOpen);
}

async function updateMainContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("資料讀取失敗: " + response.statusText);
        }
        const data = await response.text();
        document.getElementById("main").innerHTML = data;
    } catch (error) {
        console.error(error);
    }
}
