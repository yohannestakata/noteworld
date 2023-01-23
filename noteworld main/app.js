const form = document.querySelector(".form");
const formContainer = document.querySelector(".form-container");
const message = document.querySelector(".message");
const title = document.querySelector("#input");
const textarea = document.querySelector("#textarea");
const open = document.querySelector(".open");
const layer = document.querySelector(".layer");
const userArea = document.querySelector(".user-area");
const exit = document.querySelector(".exit");
const circle = document.querySelector(".circle");

let memo;

const sat = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);
const def = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
  }
);
const dark = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }
);
userArea.classList.toggle("transform");
let themeTracker = 0;
let lat,
  lng = 0;
let map;
let notesArr = [];
let coords;
const storedData = JSON.parse(localStorage.getItem("note"));
if (storedData) {
  notesArr = [...storedData];
}
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      coords = [latitude, longitude];
      map = L.map("map").setView(coords, 13);

      map.addLayer(def);

      if (storedData && storedData.length > 0) {
        message.style.display = "none";
        notesArr.forEach((e) => {
          document.querySelector(".memos").insertAdjacentHTML(
            "afterBegin",
            `
            <li class="memo" data-lat=${e.coords[0]} data-lng=${e.coords[1]}>
              <h3 class="heading-tertiary" data-lat=${e.coords[0]} data-lng=${e.coords[1]}>${e.title}</h3>
              <p class="text" data-lat=${e.coords[0]} data-lng=${e.coords[1]}>${e.note}</p>
              <p class="text location" data-lat=${e.coords[0]} data-lng=${e.coords[1]}>Location: ${e.coords[0]}, ${e.coords[1]}.</p>
            </li>`
          );
          L.marker([e.coords[0], e.coords[1]])
            .addTo(map)
            .bindPopup(
              L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: "popup",
              })
            )
            .setPopupContent(
              `<div style='font-weight:700'>${e.title}</div>${e.note}`
            )
            .openPopup();
        });
      }

      memo = document.querySelectorAll(".memo");
      memo.forEach((m) => {
        m.addEventListener("click", (e) => {
          map.setView([e.target.dataset.lat * 1, e.target.dataset.lng * 1], 13);
        });
      });

      const addMarker = function (title, note, lat, lng) {
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: "popup",
            })
          )
          .setPopupContent(`<div style='font-weight:700'>${title}</div>${note}`)
          .openPopup();
        message.style.display = "none";
        document.querySelector(".memos").insertAdjacentHTML(
          "afterBegin",
          `
            <li class="memo" data-lat=${lat} data-lng=${lng}>
              <h3 class="heading-tertiary" data-lat=${lat} data-lng=${lng}>${title}</h3>
              <p class="text" data-lat=${lat} data-lng=${lng}>${note}</p>
              <p class="text location" data-lat=${lat} data-lng=${lng}>Location: ${lat}, ${lng}.</p>
            </li>`
        );
        memo = document.querySelectorAll(".memo");
        memo.forEach((m) => {
          m.addEventListener("click", (e) => {
            map.setView(
              [e.target.dataset.lat * 1, e.target.dataset.lng * 1],
              13
            );
          });
        });

        notesArr.push({ coords: [lat, lng], title, note });

        console.log(notesArr);
        localStorage.setItem("note", JSON.stringify(notesArr));
      };
      document.querySelector("#map").addEventListener("dblclick", function (e) {
        let x = e.clientX;
        let y = e.clientY;
        formContainer.style.display = `flex`;
        form.style.display = "flex";
        formContainer.style.transform = `translate(-50%,0)`;
        formContainer.style.top = `${y}px`;
        formContainer.style.left = `${x}px`;
        circle.style.display = "block";
        circle.style.top = `${y}px`;
        circle.style.left = `${x}px`;
        title.value = textarea.value = "";
        title.focus();
      });
      map.on("click", function (mapEvent) {
        lat = mapEvent.latlng.lat;
        lng = mapEvent.latlng.lng;
      });

      document.querySelector(".submit").addEventListener("click", function (e) {
        e.preventDefault();
        userArea.classList.remove("transform");
        const t = title.value;
        const n = textarea.value;
        formContainer.style.display = "none";
        circle.style.display = "none";
        form.style.display = "none";

        addMarker(t, n, lat, lng);
      });
    },
    function () {
      alert("Couldn't get your position.");
    }
  );

open.addEventListener("click", function (e) {
  e.preventDefault();
  userArea.classList.toggle("transform");
});

document.addEventListener("keydown", function (e) {
  if (e.key === "PageUp" || e.key === "PageDown") {
    e.preventDefault();
    userArea.classList.toggle("transform");
  } else if (e.key === "Alt") {
    e.preventDefault();
    if (themeTracker == 0) {
      map.removeLayer(def);
      map.addLayer(dark);
      themeTracker = 1;
    } else if (themeTracker == 1) {
      map.removeLayer(dark);
      map.addLayer(def);
      themeTracker = 0;
    } else {
      map.removeLayer(sat);
      map.addLayer(def);
      themeTracker = 0;
    }
  } else if (e.ctrlKey === true && e.key === "c") {
    map.setView(coords, 13);
  }
});

layer.addEventListener("click", function (e) {
  e.preventDefault();
  if (themeTracker == 0) {
    map.removeLayer(def);
    map.addLayer(dark);
    themeTracker = 1;
  } else if (themeTracker == 1) {
    map.removeLayer(dark);
    map.addLayer(def);
    themeTracker = 0;
  } else {
    map.removeLayer(sat);
    map.addLayer(def);
    themeTracker = 0;
  }
});

exit.addEventListener("click", function (e) {
  e.preventDefault();
  formContainer.style.display = "none";
  circle.style.display = "none";
});
