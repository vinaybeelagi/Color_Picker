const browseBtn = document.querySelector('.browse-button');
const uploadedImage = document.getElementById('selectedImage');
const addBtn = document.getElementById('add');
const removeBtn = document.getElementById('remove');
const paletteContainer = document.querySelector('.color-palette');
const exportBtn =document.querySelector('.export-button');
const image = document.getElementById('selectedImage');
let palette = ['#ff0000', '#00ff00'];
const eyeDropper = new EyeDropper();

browseBtn.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        const imgURL = URL.createObjectURL(file);
        uploadedImage.src = imgURL;
    };

    fileInput.click();
});

function renderColorPalette() {
    paletteContainer.innerHTML = ''; 

       for (const color of palette) {
        const picker = document.createElement('div');
        picker.classList.add('color-picker');
        picker.style.backgroundColor = color;
        paletteContainer.appendChild(picker);
    }
}
renderColorPalette();
addBtn.addEventListener('click', async () => {
    if (palette.length >= 10) {
        addBtn.disabled = true;
        return;
    }
    const { sRGBHex } = await eyeDropper.open();
    palette.push(sRGBHex);
    renderColorPalette();

    if (palette.length < 10) {
        addBtn.disabled = false;
    }
});

removeBtn.addEventListener('click', () => {
    if (palette.length > 2) { 
        palette.pop();
        renderColorPalette();
    }

    if (palette.length < 10) {
        addBtn.disabled = false;
    }
});
function generateCSV() {
    const capitalizedPalette = palette.map(color => color.toUpperCase().replace('#', ''));
    return capitalizedPalette.join(',');
}
function generateWithHash() {
    return palette.map(color => color.toUpperCase()).join(',');
}

function generateArray() {
    return "[" + palette.map(color => "'" + color.toUpperCase().replace('#', '') + "'").join(', ') + "]";
}

exportBtn.addEventListener('click', () => {
    const csvContent = generateCSV();
    const withHashContent = generateWithHash();
    const arrayContent = generateArray();
  
    const popup = document.getElementById("myPopup");
    popup.style.display = "block";
  
    const popupContent = document.querySelector(".popup-content");
    popupContent.innerHTML = `
      <span class="close">&times;</span>
      <h2>Export Palette</h2>
      <div id="csvFormat">- CSV<br>${csvContent}</div>
      <div id="withHashFormat">- With #<br>${withHashContent}</div>
      <div id="arrayFormat">- Array<br>${arrayContent}</div>
    `;
  
    const closeBtn = document.querySelector(".close");
    closeBtn.addEventListener("click", () => {
      popup.style.display = "none";
    });
});





