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
      // טעינת הסודות ישירות מהאובייקט המוגדר
      this.allSecrets = this.getLocalSecrets();
      window.cachedSecrets = this.allSecrets;

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

  // במקום לטעון מקובץ חיצוני, הנתונים מוגדרים ישירות בקוד
  getLocalSecrets() {
    return [
      {
        id: 1,
        title: "שמורות טבע נסתרות",
        mainContent: "יש בעולם שמורות טבע נסתרות, שלא נמצאות במפות התיירים 🗺️",
        details:
          "לפעמים, מטיילים מנוסים מוצאים פינות טבע מופלאות ששומרות על עצמן בזכות זה שאין להן פרסום המוני. זה כמו יערות גשם עם מפלים חבויים, חופים מבודדים עם מים צלולים, ומערות נטיפים קסומות שרק המקומיים מכירים 🌊🦋",
        extraInfo:
          "יש אנשים ששומרים על המקומות האלו בסוד, כדי להגן עליהם מההמונים ולשמור עליהם טבעיים, נקיים ושלווים 🌿💚",
        conclusion:
          "אז בפעם הבאה כשאתם בטיול, אולי תגלו פינה סודית כזו בעצמכם! 😉",
        emoji: "🗺️",
      },
      {
        id: 2,
        title: "נַסָּיִי ריחות",
        mainContent:
          "ידעת שיש מקצועות שממש סודיים עד כדי כך שמעטים בעולם יודעים עליהם? 🤫",
        details:
          "למשל, יש אנשים שעובדים בתור נַסָּיִי ריחות – מומחים לזיהוי ורקיחת ניחוחות בבשמים יוקרתיים או במזון. הנַסָּיִים האלה מאומנים שנים כדי לזהות כל ריח ברמת דיוק מטורפת. לעיתים הם אפילו עובדים בחדרים סודיים, כדי שלא ייחשף מה הם מרכיבים",
        extraInfo:
          "חברות בושם עולמיות שומרות את המתכונים שלהן בסוד כמעט כמו מתכון של קסם. חלק מהן מחזיקות בנוסחאות סודיות ששמורות בכספות מאובטחות 🔒",
        conclusion:
          "אז בפעם הבאה שתבחרו בושם, תדעו שיש מאחורי הריח הזה עולם סודי ומיוחד! 🕵️‍♀️💐",
        emoji: "🌹",
      },
      {
        id: 3,
        title: "הקטקומבות של פריז",
        mainContent:
          "שמעת פעם על המנהרות התת-קרקעיות הסודיות שנמצאות מתחת לערים מפורסמות בעולם? 🌍",
        details:
          "בעיר פריז יש רשת מסובכת של מנהרות שנקראת הקטקומבות של פריז. המנהרות האלה מלאות בשלדים של מיליוני אנשים שנקברו שם לפני מאות שנים, וכמה מהן עדיין סגורות ומסתוריות לחלוטין",
        extraInfo:
          "יש קבוצות סודיות של אנשים, שנקראים קטאופילים, שנכנסים לשם בחשאי ועורכים מסיבות וסיורים במעמקי המנהרות",
        conclusion:
          "אז מתחת לרחובות הרגילים של פריז, יש עיר נסתרת ומסתורית לחלוטין, שמחכה להיחשף 🕯️🌫️",
        emoji: "🏰",
      },
      {
        id: 4,
        title: "אגם הילייר הוורוד",
        mainContent:
          "שמעת על כך שיש אגם מסתורי בשם אגם הילייר באוסטרליה שצבעו ורוד? כן, ממש ורוד כמו מסטיק! 💖",
        details:
          "האגם מוקף בנוף ירוק, והמים הוורודים שלו נוצצים בצורה מדהימה. המדענים לא הצליחו למצוא תשובה חד-משמעית לסיבה לכך שהאגם ורוד",
        extraInfo:
          "ההשערה היא שזה קשור לסוג מסוים של אצות שחיות במים או לתגובה כימית בין המלח למינרלים באגם, אבל זה עדיין בגדר תעלומה",
        conclusion:
          "והכי מעניין? גם אם תיקחו בקבוק מים מהאגם ותביאו אותו הביתה, המים יישארו ורודים! 🎨💧",
        emoji: "💖",
      },
      {
        id: 5,
        title: "הספרייה הסודית של הוותיקן",
        mainContent:
          "מתחת לקרקע, במעמקי הוותיקן, מסתתרת הספרייה הסודית של הוותיקן 📜",
        details:
          "מדובר באחד האוספים הסודיים והמוגנים ביותר בעולם, והכניסה אליו מותרת רק לחוקרים בודדים שנבחרו בקפידה על ידי הכנסייה",
        extraInfo:
          "בין המסמכים האלה יש גם כתבים שאף אחד מחוץ לכנסייה לא זכה לראות, ואומרים שאולי יש שם אפילו מסמכים מתקופת ישו, גילויים מדעיים עתיקים, ומכתבים סודיים",
        conclusion:
          "הרבה מהספרייה עדיין לא נחשף, וזה אולי אחד הסודות השמורים ביותר בעולם",
        emoji: "📜",
      },
      {
        id: 6,
        title: "הפירמידות של יונאגוני",
        mainContent:
          "במעמקי הים, ליד איי יפן, קיים מבנה סודי ומסתורי שנקרא הפירמידות של יונאגוני 🌊",
        details:
          "מדובר במבנה סלעי ענק שנראה כמו חורבות עיר קדומה, עם מדרגות, קירות, ועמודים סימטריים שמזכירים מאוד מבנים אנושיים",
        extraInfo:
          "חלק מהמדענים מאמינים שהמבנה הזה הוא תופעת טבע נדירה, בעוד אחרים משערים שמדובר בעיר עתיקה שאולי נבנתה לפני עשרות אלפי שנים",
        conclusion:
          "המקום הזה כל כך מסתורי, שמעטים מצליחים לצלול לשם ולראות אותו מקרוב",
        emoji: "🌊",
      },
      {
        id: 7,
        title: "חדר הענבר האבוד",
        mainContent: "יש שמועה עתיקה על כך שקיים חדר מסתורי שנקרא חדר הענבר 💎",
        details:
          "החדר הזה היה מצופה כולו בלוחות ענבר מוזהבים, משובצים אבני חן, מראות ועיטורים מהממים. הוא נבנה במאה ה-18 והיה נחשב ל'פלא השמיני של העולם'",
        extraInfo:
          "במהלך מלחמת העולם השנייה, החדר נעלם באופן מסתורי לחלוטין ומאז נעלמו עקבותיו",
        conclusion:
          "אז מי יודע? אולי יום אחד ימצאו אותו, וייחשף בפנינו היופי האבוד של חדר הענבר! 🏰✨",
        emoji: "💎",
      },
      {
        id: 8,
        title: "המבוך של טירת וורוויק",
        mainContent: "שמעת פעם על המבוך הסודי מתחת לטירת וורוויק באנגליה? 🏰",
        details:
          "מתחת לטירה העתיקה הזו מסתתרת רשת תעלות ומנהרות מסועפת שנחפרה בימי הביניים. המבוך מלא במלכודות מתוחכמות, דלתות סודיות, ומדרגות שמובילות למבוי סתום",
        extraInfo:
          "לפי הסיפורים, המבוך נועד לשמש כנתיב מילוט עבור האבירים ובני האצולה במקרה של מתקפה על הטירה. רק חלק קטן מהמבוך פתוח כיום למבקרים",
        conclusion: "מי יודע אילו סודות עוד מסתתרים במעמקי המבוך העתיק הזה? 🕯️",
        emoji: "🏰",
      },
      {
        id: 9,
        title: "קווי נאסקה",
        mainContent: "האם שמעת על הציורים המסתוריים במדבר נאסקה? 🌵",
        details:
          "בתוך מדבר נאסקה בפרו קיימים קווים עצומים וצורות גיאומטריות שמשתרעות לאורך קילומטרים רבים. הקווים האלה יוצרים צורות של בעלי חיים וצמחים שניתן לראות רק מהאוויר",
        extraInfo:
          "איש אינו יודע בוודאות למה הם נוצרו או איך יוצריהם יכלו לעצב אותן בדיוק כה מרשים בלי אפשרות לצפות בהן מלמעלה",
        conclusion:
          "האם קווי נאסקה הם מסר מהעבר? או אולי מפת דרכים עתיקה שטרם פוענחה? 🛸",
        emoji: "🌵",
      },
      {
        id: 10,
        title: "העיר פומפיי",
        mainContent: "הייתם מאמינים שיש עיר שלמה שנעלמה תוך יום? 🌋",
        details:
          "העיר פומפיי נחרבה בהתפרצות הר הגעש וזוב בשנת 79 לספירה. הלבה והאפר חנקו את העיר בצורה שהרבה מבנים ופריטים נשמרו בצורה מושלמת, כולל גופות שהפכו לפסלי אפר",
        extraInfo:
          "כשהארכיאולוגים חפרו בעיי החורבות, הם גילו את העיר כמעט כפי שהייתה לפני אלפי שנים, עם חפצים, ציורים ופסלים שמציינים את התרבות הרומית העתיקה",
        conclusion:
          "פומפיי היא חלון נדיר לחיים ברומא העתיקה, שנשמר בזכות אסון טבע מחריד 🏛️",
        emoji: "🌋",
      },
      {
        id: 11,
        title: "קרחון פדרל",
        mainContent: "מה מסתתר בתוך הקרחון העתיק? ❄️",
        details:
          "בקרחון פדרל שבארץ האש התגלו שרידים של פולחנים עתיקים של ציוויליזציה אינדיאנית. נמצאו קמעות, תכשיטים, כלים וגופות קפואות עם עיוותים מסתוריים",
        extraInfo:
          "יש תיאוריות על פולחנים וקרבנות שנעשו שם, והקרחון שימר את כל הממצאים בצורה מושלמת",
        conclusion:
          "הקרחון ממשיך לשמור על סודותיו העתיקים, וכל שנה מתגלים בו ממצאים חדשים 🏔️",
        emoji: "❄️",
      },
      {
        id: 12,
        title: "הכחולים האבודים של גנואה",
        mainContent: "האם שמעת על הצבע שנעלם? 🔵",
        details:
          "צבע כחול ייחודי שיוצר ממינרל נדיר שנמצא רק באי קטן בים התיכון. הצבע היה יקר יותר מזהב בימי הביניים, אך נעלם במסתורין במאה ה-16",
        extraInfo:
          "ייתכן שמסיבה כלשהי, מאגרי הצבע נגמרו או שהמינרל שהיה דרוש ליצירתו נשכח או אבד, והידע כיצד להפיק אותו אבד לעד",
        conclusion:
          "עד היום, הסוד של הצבע האבוד לא התגלה, ובחלק מהיצירות הישנות ביותר שהשתמשו בו, הצבע נראה יותר כהה ומעורפל 🎨",
        emoji: "🔵",
      },
      {
        id: 13,
        title: "המדרגות הסודיות של אושימאדה",
        mainContent: "גילית פעם מדרגות מסתוריות ביער? 🌲",
        details:
          "ביער אושימאדה ביפן נמצאות מדרגות אבן עתיקות ומסתוריות. איש לא יודע מי בנה אותן או מה מטרתן",
        extraInfo:
          "התיאוריה המרכזית טוענת שהן נבנו על ידי תרבות עתיקה לצורכי פולחן, ויש המאמינים שמי שמצליח לטפס עליהן עד הסוף, יגלה את סודן",
        conclusion:
          "היער הזה נשאר אחד המקומות המסתוריים ביותר ביפן, והכוח המיסטי שממנו נובעת האווירה שם הוא כל כך חזק 🌿",
        emoji: "🌲",
      },
    ];
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
