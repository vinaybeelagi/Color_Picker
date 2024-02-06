const imageCanvas = document.getElementById("imageCanvas");
const colorPaletteContainer = document.getElementById("colorPalette");
const imageInput = document.getElementById("imageInput");
let colorPickers = [];
let hexValues = [];
imageInput.addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();

      if (!e.target.result) {
        img.src = "/default_image.jpg";
      } else {
        img.src = e.target.result;
      }

      img.onload = function () {
        imageCanvas
          .getContext("2d")
          .drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
        addColorPicker();
        addColorPicker();
      };
    };

    reader.readAsDataURL(file);
  }
}

function addColorPicker() {
  if (colorPickers.length < 10) {
    const colorPicker = document.createElement("div");
    colorPicker.classList.add("colorPicker");
    colorPicker.style.top = getRandomPosition() + "px";
    colorPicker.style.left = getRandomPosition() + "px";

    colorPicker.addEventListener("mousedown", startDrag);
    colorPickers.push(colorPicker);
    updateColorPalette();
    document.getElementById("canvasContainer").appendChild(colorPicker);
    addActivePicker(colorPicker);

    if (colorPickers.length === 10) {
      document.getElementById("addColorPickerButton").disabled = true;
    }
  } else {
    // Show a message indicating that the maximum number of color pickers has been reached
  }
}

function removeColorPicker() {
  if (colorPickers.length > 2) {
    const removedPicker = colorPickers.pop();
    removedPicker.remove();
    hexValues.pop();
    updateColorPalette();
    document.getElementById("addColorPickerButton").disabled = false;
  } else {
    // Disable the button or show a message indicating that at least two color pickers must be present
  }
}

function startDrag(event) {
  const colorPicker = event.target;
  addActivePicker(colorPicker);
  const offsetX = event.clientX - parseInt(colorPicker.style.left);
  const offsetY = event.clientY - parseInt(colorPicker.style.top);

  function handleDragMove(moveEvent) {
    const x = moveEvent.clientX - offsetX;
    const y = moveEvent.clientY - offsetY;
    const colorPickerLeft =
      constrainValue(x, 0, imageCanvas.width - colorPicker.offsetWidth) + "px";
    const colorPickerTop =
      constrainValue(y, 0, imageCanvas.height - colorPicker.offsetHeight) + "px";
    const color = getColorAtPosition(colorPickerLeft, colorPickerTop);
    colorPicker.style.left = colorPickerLeft;
    colorPicker.style.top = colorPickerTop;
    colorPicker.style.backgroundColor = color;
    updateColorPalette();
  }

  function handleDragEnd() {
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
  }

  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("mouseup", handleDragEnd);
}

function updateColorPalette() {
  colorPaletteContainer.innerHTML = "";
  hexValues = [];
  hexValues.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    colorPaletteContainer.appendChild(colorDiv);
  });

  colorPickers.forEach((colorPicker) => {
    const color = getColorAtPosition(
      colorPicker.style.left,
      colorPicker.style.top
    );
    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    colorPaletteContainer.appendChild(colorDiv);
    hexValues.push(color);
  });
}

function getColorAtPosition(x, y) {
  const imageData = imageCanvas
    .getContext("2d")
    .getImageData(parseInt(x), parseInt(y), 1, 1).data;
  const hexColor = rgbToHex(imageData[0], imageData[1], imageData[2]);
  return hexColor;
}

function exportPalette() {
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  const csvFormat = generateCSV();
  document.getElementById("csvFormat").innerText = "CSV\n" + csvFormat;

  const withHashFormat = generateWithHash();
  document.getElementById("withHashFormat").innerText = "With #\n" + withHashFormat;

  const arrayFormat = generateArray();
  document.getElementById("arrayFormat").innerText = "Array\n" + arrayFormat;

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function generateCSV() {
  const capitalizedPalette = hexValues.map((color) =>
    color.toUpperCase().replace("#", "")
  );
  return capitalizedPalette.join(",");
}

function generateWithHash() {
  return hexValues.map((color) => color.toUpperCase()).join(", ");
}

function generateArray() {
  return (
    "[" +
    hexValues
      .map((color) => "'" + color.toUpperCase().replace("#", "") + "'")
      .join(", ") +
    "]"
  );
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function getRandomPosition() {
  return Math.floor(Math.random() * 300);
}

function constrainValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function addActivePicker(colorPicker) {
  const pickers = document.querySelectorAll(".colorPicker");
  pickers.forEach((picker) => {
    picker.classList.remove("activePicker");
  });
  colorPicker.classList.add("activePicker");
  const color = getColorAtPosition(
    colorPicker.style.left,
    colorPicker.style.top
  );
  colorPicker.style.backgroundColor = color;
}
