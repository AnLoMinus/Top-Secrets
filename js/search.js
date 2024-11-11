// מחלקה לניהול החיפוש
class SearchManager {
  constructor() {
    this.searchInput = document.querySelector(".search-input");
    this.searchResults = document.querySelector(".secrets-grid");
    this.allSecrets = [];
    this.debounceTimeout = null;

    this.initialize();
  }

  initialize() {
    // טעינת כל הסודות בעת האתחול
    this.loadSecrets();

    // הוספת מאזין לאירועי הקלדה
    this.searchInput.addEventListener("input", (e) => {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, 300);
    });

    // הוספת אנימציה לפוקוס
    this.searchInput.addEventListener("focus", () => {
      this.searchInput.parentElement.classList.add("focused");
    });

    this.searchInput.addEventListener("blur", () => {
      this.searchInput.parentElement.classList.remove("focused");
    });
  }

  async loadSecrets() {
    try {
      const response = await fetch("/secrets.json");
      const data = await response.json();
      this.allSecrets = data.secrets;
    } catch (error) {
      console.error("Error loading secrets:", error);
    }
  }

  handleSearch(searchTerm) {
    if (!searchTerm.trim()) {
      // אם החיפוש ריק, הצג את כל הסודות
      renderSecrets(this.allSecrets);
      return;
    }

    // סינון הסודות לפי מילת החיפוש
    const filteredSecrets = this.allSecrets.filter((secret) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        secret.title.toLowerCase().includes(searchTermLower) ||
        secret.mainContent.toLowerCase().includes(searchTermLower) ||
        secret.details.toLowerCase().includes(searchTermLower)
      );
    });

    // הצגת התוצאות המסוננות
    renderSecrets(filteredSecrets);
  }
}

// פונקציה להצגת הסודות (משתמשת בפונקציה הקיימת מ-main.js)
function renderSecrets(secrets) {
  const secretsGrid = document.querySelector(".secrets-grid");

  if (!secrets.length) {
    secretsGrid.innerHTML = `
      <div class="no-results">
        <p>לא נמצאו סודות מתאימים לחיפוש שלך 🔍</p>
        <p>נסו לחפש משהו אחר</p>
      </div>
    `;
    return;
  }

  secretsGrid.innerHTML = "";

  secrets.forEach((secret) => {
    const card = document.createElement("div");
    card.className = "secret-card";
    card.innerHTML = `
      <div class="card-emoji">${secret.emoji}</div>
      <div class="card-background-emoji">${secret.emoji}</div>
      <div class="secret-card-content">
        <h2>${secret.title}</h2>
        <p>${secret.mainContent}</p>
        <a href="#" class="reveal-btn" data-id="${secret.id}">גלה את הסוד 🔍</a>
      </div>
    `;
    secretsGrid.appendChild(card);
  });

  // הוספת מאזיני לחיצה לכפתורי הגילוי
  document.querySelectorAll(".reveal-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const secretId = parseInt(btn.dataset.id);
      showSecretDetails(secretId);
    });
  });
}

// יצירת מופע של מנהל החיפוש כשהדף נטען
document.addEventListener("DOMContentLoaded", () => {
  new SearchManager();
});
