class SecretsManager {
  constructor() {
    this.searchInput = document.querySelector(".search-input");
    this.secretsGrid = document.querySelector(".secrets-grid");
    this.allSecrets = [];
    this.debounceTimeout = null;

    this.initialize();
  }

  async initialize() {
    // הצגת אנימציית טעינה
    this.secretsGrid.innerHTML = '<div class="loading">טוען סודות...</div>';

    try {
      // טעינת הסודות
      await this.loadSecrets();

      // הצגת כל הסודות
      this.renderSecrets(this.allSecrets);

      // עדכון התאריך והשעה
      this.updateDateTime();

      // הוספת מאזיני אירועים לחיפוש
      this.setupSearchListeners();

      // עדכון השעה כל דקה
      setInterval(() => this.updateDateTime(), 60000);
    } catch (error) {
      this.handleError(error);
    }
  }

  async loadSecrets() {
    try {
      const response = await fetch("/secrets.json");
      const data = await response.json();
      this.allSecrets = data.secrets;
      window.cachedSecrets = this.allSecrets; // שמירה בזיכרון המטמון
    } catch (error) {
      console.error("Error loading secrets:", error);
      throw error;
    }
  }

  setupSearchListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          this.handleSearch(e.target.value);
        }, 300);
      });

      this.searchInput.addEventListener("focus", () => {
        this.searchInput.parentElement.classList.add("focused");
      });

      this.searchInput.addEventListener("blur", () => {
        this.searchInput.parentElement.classList.remove("focused");
      });
    }
  }

  handleSearch(searchTerm) {
    if (!searchTerm.trim()) {
      this.renderSecrets(this.allSecrets);
      return;
    }

    const filteredSecrets = this.allSecrets.filter((secret) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        secret.title.toLowerCase().includes(searchTermLower) ||
        secret.mainContent.toLowerCase().includes(searchTermLower) ||
        secret.details.toLowerCase().includes(searchTermLower)
      );
    });

    this.renderSecrets(filteredSecrets);
  }

  renderSecrets(secrets) {
    if (!secrets.length) {
      this.secretsGrid.innerHTML = `
        <div class="no-results">
          <p>לא נמצאו סודות מתאימים לחיפוש שלך 🔍</p>
          <p>נסו לחפש משהו אחר</p>
        </div>
      `;
      return;
    }

    this.secretsGrid.innerHTML = "";

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
      this.secretsGrid.appendChild(card);
    });

    // הוספת מאזיני לחיצה לכפתורי הגילוי
    this.secretsGrid.querySelectorAll(".reveal-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const secretId = parseInt(btn.dataset.id);
        this.showSecretDetails(secretId);
      });
    });
  }

  showSecretDetails(secretId) {
    const secret = this.allSecrets.find((s) => s.id === secretId);
    if (!secret) return;

    const modal = document.createElement("div");
    modal.className = "secret-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        
        <div class="secret-header">
          <h2>${secret.emoji} ${secret.title}</h2>
        </div>
        
        <div class="secret-main">
          <p class="main-content">${secret.mainContent}</p>
        </div>
        
        <div class="secret-details">
          <p>${secret.details}</p>
        </div>
        
        <div class="secret-extra">
          <p>${secret.extraInfo}</p>
        </div>
        
        <div class="secret-conclusion">
          <p>${secret.conclusion}</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // מאזיני סגירה למודל
    const closeBtn = modal.querySelector(".close-modal");
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  }

  updateDateTime() {
    const timeElement = document.getElementById("current-time");
    const dateElement = document.getElementById("current-date");

    if (!timeElement || !dateElement) return;

    const now = new Date();

    try {
      const timeString = now.toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const dateString = now.toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      timeElement.textContent = timeString;
      dateElement.textContent = dateString;
    } catch (error) {
      console.error("Error updating date/time:", error);
    }
  }

  handleError(error) {
    console.error("Error:", error);
    this.secretsGrid.innerHTML = `
      <div class="error-message">
        <p>מצטערים, משהו השתבש. נסו לרענן את העמוד.</p>
        <button onclick="location.reload()">טען מחדש</button>
      </div>
    `;
  }
}

// יצירת מופע של מנהל הסודות כשהדף נטען
document.addEventListener("DOMContentLoaded", () => {
  new SecretsManager();
});
