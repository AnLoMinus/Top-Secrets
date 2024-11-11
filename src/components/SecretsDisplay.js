import { useState, useEffect } from "react";
import { getSecrets } from "../services/secrets";

export function SecretsDisplay() {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSecret, setSelectedSecret] = useState(null);

  useEffect(() => {
    async function loadSecrets() {
      const secretsData = await getSecrets();
      setSecrets(secretsData);
      setLoading(false);
    }

    loadSecrets();
  }, []);

  if (loading) {
    return <div className="loading">טוען סודות...</div>;
  }

  const handleSecretClick = (secret) => {
    setSelectedSecret(secret);
  };

  const closeModal = () => {
    setSelectedSecret(null);
  };

  return (
    <>
      <div className="secrets-container">
        {secrets.map((secret) => (
          <div
            key={secret.id}
            className="secret-card"
            onClick={() => handleSecretClick(secret)}
          >
            <div className="card-emoji">{secret.emoji}</div>
            <div className="card-background-emoji">{secret.emoji}</div>
            <div className="secret-card-content">
              <h2>{secret.title}</h2>
              <p>{secret.mainContent}</p>
              <button className="reveal-btn">גלה את הסוד 🔍</button>
            </div>
          </div>
        ))}
      </div>

      {selectedSecret && (
        <div className="secret-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>
            <div className="secret-header">
              <h2>
                {selectedSecret.emoji} {selectedSecret.title}
              </h2>
            </div>
            <div className="secret-main">
              <p className="main-content">{selectedSecret.mainContent}</p>
            </div>
            <div className="secret-details">
              <p>{selectedSecret.details}</p>
            </div>
            <div className="secret-extra">
              <p>{selectedSecret.extraInfo}</p>
            </div>
            <div className="secret-conclusion">
              <p>{selectedSecret.conclusion}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
