import { useEffect } from "react";

export default function GoogleTranslateLoader() {
  useEffect(() => {
    if (window.google && window.google.translate) return;

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    document.body.appendChild(script);
  }, []);

  return (
    // 👇 hidden container (UI dosen't show )
    <div id="google_translate_element" style={{ display: "none" }}></div>
  );
}