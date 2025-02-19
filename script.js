document.addEventListener("DOMContentLoaded", function () {
  /* ---------- DARK MODE TOGGLE ---------- */
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
  }
  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
  });

  /* ---------- RESISTOR CALCULATOR LOGIC ---------- */
  const band1 = document.getElementById("band1");
  const band2 = document.getElementById("band2");
  const band3 = document.getElementById("band3");
  const band3Label = document.getElementById("band3-label");
  const multiplier = document.getElementById("multiplier");
  const tolerance = document.getElementById("tolerance");
  const bandsSelect = document.getElementById("bands");
  const resultSpan = document.getElementById("result");

  /* ---------- RESISTOR PREVIEW ELEMENTS ---------- */
  const previewElements = {
    band1: document.getElementById("preview-band1"),
    band2: document.getElementById("preview-band2"),
    band3: document.getElementById("preview-band3"),
    multiplier: document.getElementById("preview-multiplier"),
    tolerance: document.getElementById("preview-tolerance")
  };

  /* ---------- COLOR DEFINITIONS ---------- */
  const colors = [
    { name: "Black", value: 0, multiplier: 1, tolerance: null, hex: "#000000" },
    { name: "Brown", value: 1, multiplier: 10, tolerance: 1, hex: "#964B00" },
    { name: "Red", value: 2, multiplier: 100, tolerance: 2, hex: "#FF0000" },
    { name: "Orange", value: 3, multiplier: 1000, tolerance: null, hex: "#FFA500" },
    { name: "Yellow", value: 4, multiplier: 10000, tolerance: null, hex: "#FFFF00" },
    { name: "Green", value: 5, multiplier: 100000, tolerance: 0.5, hex: "#008000" },
    { name: "Blue", value: 6, multiplier: 1000000, tolerance: 0.25, hex: "#0000FF" },
    { name: "Violet", value: 7, multiplier: 10000000, tolerance: 0.1, hex: "#8A2BE2" },
    { name: "Gray", value: 8, multiplier: null, tolerance: 0.05, hex: "#808080" },
    { name: "White", value: 9, multiplier: null, tolerance: null, hex: "#FFFFFF" },
    { name: "Gold", value: null, multiplier: 0.1, tolerance: 5, hex: "#FFD700" },
    { name: "Silver", value: null, multiplier: 0.01, tolerance: 10, hex: "#C0C0C0" }
  ];

  /* ---------- POPULATE DROPDOWNS ---------- */
  function populateSelect(select, filter, propName) {
    select.innerHTML = "";
    colors.filter(filter).forEach(color => {
      let option = document.createElement("option");
      option.value = color[propName];
      option.textContent = color.name;
      select.appendChild(option);
    });
  }

  populateSelect(band1, c => c.value !== null, "value");
  populateSelect(band2, c => c.value !== null, "value");
  populateSelect(multiplier, c => c.multiplier !== null, "multiplier");
  populateSelect(tolerance, c => c.tolerance !== null, "tolerance");

  function updateBands() {
    const isFiveBand = bandsSelect.value === "5";
    band3.style.display = isFiveBand ? "inline-block" : "none";
    band3Label.style.display = isFiveBand ? "inline-block" : "none";
    previewElements.band3.style.display = isFiveBand ? "block" : "none";
    if (isFiveBand) populateSelect(band3, c => c.value !== null, "value");
    updateResistorPreview();
    calculateResistance();
  }

  function updateResistorPreview() {
    function getHex(name) {
      let color = colors.find(c => c.name === name);
      return color ? color.hex : "transparent";
    }
    ["band1", "band2", "band3", "multiplier", "tolerance"].forEach(key => {
      if (previewElements[key]) {
        previewElements[key].style.backgroundColor = getHex(
          document.getElementById(key).selectedOptions[0]?.textContent || ""
        );
      }
    });
  }

  function formatResistance(value) {
    if (value >= 1e6) return (value / 1e6).toFixed(2) + " MΩ";
    if (value >= 1e3) return (value / 1e3).toFixed(2) + " kΩ";
    return value + " Ω";
  }

  function calculateResistance() {
    let multiplierValue = parseFloat(multiplier.value);
    let toleranceValue = tolerance.value ? `±${tolerance.value}%` : "";
    let resistance;
    if (bandsSelect.value === "4") {
      resistance = (parseInt(band1.value) * 10 + parseInt(band2.value)) * multiplierValue;
    } else {
      resistance = (parseInt(band1.value) * 100 + parseInt(band2.value) * 10 + parseInt(band3.value)) * multiplierValue;
    }
    resultSpan.textContent = `${formatResistance(resistance)} ${toleranceValue}`;
  }

  bandsSelect.addEventListener("change", updateBands);
  document.querySelectorAll(".color-select").forEach(select => {
    select.addEventListener("change", () => {
      updateResistorPreview();
      calculateResistance();
    });
  });

  updateBands();
  updateResistorPreview();
  calculateResistance();
});
