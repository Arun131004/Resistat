document.addEventListener("DOMContentLoaded", function () {
    /* ---------- DARK MODE TOGGLE ---------- */
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;
    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
    }
    darkModeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  
    /* ---------- RESISTOR CALCULATOR LOGIC ---------- */
    const band1 = document.getElementById("band1");
    const band2 = document.getElementById("band2");
    const band3 = document.getElementById("band3");
    const band3Label = document.getElementById("band3-label");
    const multiplier = document.getElementById("multiplier");
    const tolerance = document.getElementById("tolerance");
    const bandsSelect = document.getElementById("bands");
    const calculateButton = document.getElementById("calculate");
    const resultSpan = document.getElementById("result");
  
    /* ---------- RESISTOR PREVIEW ELEMENTS ---------- */
    const previewBand1 = document.getElementById("preview-band1");
    const previewBand2 = document.getElementById("preview-band2");
    const previewBand3 = document.getElementById("preview-band3");
    const previewMultiplier = document.getElementById("preview-multiplier");
    const previewTolerance = document.getElementById("preview-tolerance");
  
    /* ---------- COLOR DEFINITIONS (with HEX codes) ---------- */
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
    function populateSelect(select, filter) {
      select.innerHTML = "";
      colors.forEach(color => {
        if (filter(color)) {
          let option = document.createElement("option");
          option.value = color.value !== null ? color.value : color.multiplier;
          option.textContent = color.name;
          select.appendChild(option);
        }
      });
    }
  
    populateSelect(band1, c => c.value !== null);
    populateSelect(band2, c => c.value !== null);
    populateSelect(multiplier, c => c.multiplier !== null);
    populateSelect(tolerance, c => c.tolerance !== null);
  
    /* ---------- UPDATE BAND VISIBILITY & PREVIEW ---------- */
    function updateBands() {
      if (bandsSelect.value === "5") {
        band3.style.display = "inline-block";
        band3Label.style.display = "inline-block";
        populateSelect(band3, c => c.value !== null);
        previewBand3.style.display = "block";
      } else {
        band3.style.display = "none";
        band3Label.style.display = "none";
        previewBand3.style.display = "none";
      }
      updateResistorPreview();
    }
  
    function updateResistorPreview() {
      function getHex(selectedText) {
        let colorObj = colors.find(c => c.name.toLowerCase() === selectedText.toLowerCase());
        return colorObj ? colorObj.hex : "transparent";
      }
      const selBand1 = band1.options[band1.selectedIndex]?.textContent || "";
      const selBand2 = band2.options[band2.selectedIndex]?.textContent || "";
      const selBand3 = bandsSelect.value === "5" ? band3.options[band3.selectedIndex]?.textContent || "" : "";
      const selMultiplier = multiplier.options[multiplier.selectedIndex]?.textContent || "";
      const selTolerance = tolerance.options[tolerance.selectedIndex]?.textContent || "";
  
      previewBand1.style.backgroundColor = getHex(selBand1);
      previewBand2.style.backgroundColor = getHex(selBand2);
      if (bandsSelect.value === "5") {
        previewBand3.style.backgroundColor = getHex(selBand3);
      }
      previewMultiplier.style.backgroundColor = getHex(selMultiplier);
      previewTolerance.style.backgroundColor = getHex(selTolerance);
    }
  
    /* ---------- CALCULATE RESISTANCE ---------- */
    function calculateResistance() {
      let multiplierValue = parseFloat(multiplier.value);
      let toleranceValue = tolerance.value ? `±${tolerance.value}%` : "";
      let resistance;
      if (bandsSelect.value === "4") {
        let digit1 = parseInt(band1.value);
        let digit2 = parseInt(band2.value);
        resistance = (digit1 * 10 + digit2) * multiplierValue;
      } else {
        let digit1 = parseInt(band1.value);
        let digit2 = parseInt(band2.value);
        let digit3 = parseInt(band3.value);
        resistance = (digit1 * 100 + digit2 * 10 + digit3) * multiplierValue;
      }
      resultSpan.textContent = `${resistance}Ω ${toleranceValue}`;
    }
  
    /* ---------- EVENT LISTENERS ---------- */
    bandsSelect.addEventListener("change", updateBands);
    document.querySelectorAll(".color-select").forEach(select => {
      select.addEventListener("change", updateResistorPreview);
    });
    calculateButton.addEventListener("click", calculateResistance);
  
    // Initialize preview and bands
    updateBands();
    updateResistorPreview();
  });
  