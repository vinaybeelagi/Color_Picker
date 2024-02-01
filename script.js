const browseBtn = document.querySelector('.browse-button');
const uploadedImage = document.getElementById('selectedImage');
const addBtn = document.getElementById('add');
const removeBtn = document.getElementById('remove');
const paletteContainer = document.querySelector('.color-palette');
const image = document.getElementById('selectedImage');
let palette = [];
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

addBtn.addEventListener('click', async () => {
    if (palette.length >= 10) {
        addBtn.disabled = true;
        return;
    }

    const { sRGBHex } = await eyeDropper.open();
    palette.push(sRGBHex);
    const picker = document.createElement('div');
    picker.classList.add('color-picker');
    picker.style.backgroundColor = sRGBHex;
    paletteContainer.appendChild(picker);

    if (palette.length < 10) {
        addBtn.disabled = false;
    }
});

removeBtn.addEventListener('click', () => {
    palette.pop();
    paletteContainer.lastChild.remove();

    if (palette.length < 10) {
        addBtn.disabled = false;
    }
});
