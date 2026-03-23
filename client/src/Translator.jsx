import { useState } from "react";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  const changeLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
    setOpen(false);
  };

  const languages = [
    { code: "en", label: "English 🇺🇸" },
    { code: "hi", label: "Hindi 🇮🇳" },
    { code: "fr", label: "French 🇫🇷" },
    { code: "de", label: "German 🇩🇪" },
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#e0f2fe",
          border: "1px solid #bae6fd",
          padding: "6px 12px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        🌐 Language
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f1f5f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}