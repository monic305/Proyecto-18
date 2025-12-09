const API_URL = "https://api.github.com/search/repositories";
const languageSelect = document.getElementById("languageSelect");
const stateContainer = document.getElementById("stateContainer");
const refreshBtn = document.getElementById("refreshBtn");

const LANGUAGES = [
    "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "Go",
    "Rust", "PHP", "Swift", "Kotlin", "TypeScript"
];

// RELLENA SELECTOR
LANGUAGES.forEach(lang => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang;
    languageSelect.appendChild(option);
});

// EVENTO CAMBIO DE LENGUAJE
languageSelect.addEventListener("change", () => {
    if (!languageSelect.value) {
        renderEmpty();
        return;
    }
    fetchRandomRepo();
});

// BOTÓN REFRESH
refreshBtn.addEventListener("click", fetchRandomRepo);

async function fetchRandomRepo() {
    const lang = languageSelect.value;
    if (!lang) return;

    renderLoading();

    try {
        const response = await fetch(`${API_URL}?q=language:${lang}&sort=stars&order=desc&per_page=50`);

        if (!response.ok) throw new Error("Error en API");

        const data = await response.json();
        if (!data.items.length) throw new Error("No repos found");

        const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];

        renderRepo(randomRepo);
    } catch (err) {
        renderError();
    }
}

/* ---------- ESTADOS DE LA UI ---------- */

function renderEmpty() {
    refreshBtn.classList.add("hidden");
    stateContainer.className = "state empty";
    stateContainer.innerHTML = `<p>Please select a language</p>`;
}

function renderLoading() {
    refreshBtn.classList.add("hidden");
    stateContainer.className = "state loading";
    stateContainer.innerHTML = `<p>Loading, please wait...</p>`;
}

function renderError() {
    refreshBtn.classList.add("hidden");
    stateContainer.className = "state error";
    stateContainer.innerHTML = `
        <p>Error fetching repositories</p>
        <button onclick="fetchRandomRepo()">Click to retry</button>
    `;
}

function renderRepo(repo) {
    stateContainer.className = "state repo-card";
    refreshBtn.classList.remove("hidden");

    stateContainer.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description available."}</p>

        <div class="repo-meta">
            ⭐ ${repo.stargazers_count}
            🍴 ${repo.forks}
            🐞 ${repo.open_issues}
        </div>
    `;
}
