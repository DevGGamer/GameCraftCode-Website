// src/pages/Settings/SettingsPage.jsx
import React, { useContext } from "react";
import { SettingsContext } from "./SettingsContext";
import "./SettingsPage.css";

export default function SettingsPage() {
  const { theme, setTheme } = useContext(SettingsContext);

  return (
    <div className="settings-page">
      <h2>Настройки</h2>

      <div className="setting-item">
        <label>🎨 Тема:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
          <option value="system">Системная</option>
        </select>
      </div>

      <div className="setting-item">
        <button
          className="reset-button"
          onClick={() => {
            setTheme("system");
          }}
        >
          🔄 Сбросить настройки
        </button>
      </div>
    </div>
  );
}
