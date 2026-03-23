
import { useEffect } from "react";

function Translator() {
  useEffect(() => {
    // Prevent script from loading multiple times
    if (window.google && window.google.translate) return;

    // Create script
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    // Define global function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,fr,de",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 9999,
        // backgroundColor: "white",
        // padding: "10px",
        width:"auto",
        // minWidth:"160px",
        height:"auto",
        borderRadius: "5px",
      }}
    ></div>
  );
}

export default Translator;