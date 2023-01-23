const num = document.querySelectorAll(".guide__no");

const changeColor = function (entries, observer) {
  if (entries[0].isIntersecting) {
    num.forEach((num) => num.classList.remove("change-color"));
    entries[0].target.classList.add("change-color");
  }
};
numObserver = new IntersectionObserver(changeColor, {
  root: null,
  threshold: 1,
});

num.forEach((num) => numObserver.observe(num));
