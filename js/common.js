function openSidebar() {
    document.getElementById("mySidebar").style.transform = "translateX(250px)";
    document.querySelector(".overlay").classList.add("active");
}

function closeSidebar() {
    document.getElementById("mySidebar").style.transform = "translateX(0px)";
    document.querySelector(".overlay").classList.remove("active");
}

function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    if (submenu.style.maxHeight) {
        submenu.style.maxHeight = null;
    } else {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
    }
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
