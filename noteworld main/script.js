"use strict";

// const nav = document.querySelector(".navigation");
// if (getComputedStyle(nav).backgroundColor === "rgb(0, 0, 0)") {
//   document.querySelector(".navigation__logo").src =
//     "assets/logo/logo-white.png";
// } else {
//   document.querySelector(".navigation__logo").src = "assets/logo/logo-dark.png";
// }

// REVEAL SECTION
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.toggle("section-hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section-hidden");
});

// SMOOTH SCROLL
const btnLearn = document.querySelector(".learn");
btnLearn.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
});
