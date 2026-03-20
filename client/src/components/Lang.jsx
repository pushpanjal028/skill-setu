import React from "react";

const changeLanguage = (lang) => {
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  }

  // Save language
  localStorage.setItem("lang", lang);
};

export default function LanguageSwitcher() {
  return (
    <div className="flex gap-2 bg-gray-800 p-2 rounded-xl">
      <button className="px-3 py-1 bg-white text-black hover:bg-white  rounded" onClick={() => changeLanguage("en")}>EN</button>
      <button className="px-3 py-1 bg-white text-black hover:bg-white rounded" onClick={() => changeLanguage("hi")}>हिं</button>
      <button className="px-3 py-1 bg-white text-black hover:bg-white rounded" onClick={() => changeLanguage("bn")}>বাংলা</button>
      <button className="px-3 py-1 bg-white text-black hover:bg-white rounded" onClick={() => changeLanguage("ta")}>தமிழ்</button>
      <button className="px-3 py-1 bg-white text-black hover:bg-white rounded" onClick={() => changeLanguage("mr")}>मराठी</button>
    </div>
  );
}