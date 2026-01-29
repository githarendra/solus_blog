function renderNavbar() {
    const token = localStorage.getItem("token");
    const nav = document.getElementById("navbar");

    // 1. Sync Theme State (Class is already added by HEAD script, just checking here)
    const isDark = document.documentElement.classList.contains("dark-mode");
    const themeIcon = isDark ? "☀️" : "🌙"; 

    // 2. Define Links
    let linksHtml = '';
    const themeBtn = `<button onclick="toggleTheme()" id="theme-btn" style="font-size: 1.2rem;" title="Toggle Theme">${themeIcon}</button>`;

    if (token) {
        linksHtml = `
            ${themeBtn}
            <a href="editor.html">Write</a>
            <a href="profile.html">Profile</a>
            <button onclick="logout()">Logout</button>
        `;
    } else {
        linksHtml = `
            ${themeBtn}
            <a href="login.html">Login</a>
        `;
    }

    // 3. Render Navbar with Logo
    nav.innerHTML = `
        <a href="index.html" class="logo">
            <img src="logo.png" alt="S">
            Solus
        </a>
        <div class="links">
            ${linksHtml}
        </div>
    `;
}

function toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle("dark-mode");
    
    const isDark = root.classList.contains("dark-mode");
    
    // Update Icon
    const btn = document.getElementById("theme-btn");
    if(btn) btn.innerText = isDark ? "☀️" : "🌙";

    // Save Preference
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
}

document.addEventListener("DOMContentLoaded", renderNavbar);