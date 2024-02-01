const browseButton = document.querySelector(".browse-button");
const selectedImage = document.getElementById("selectedImage");
const fileInput = document.getElementById("fileInput");

browseButton.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", handleImage);

function handleImage() {
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            selectedImage.src = e.target.result;
            extractPalette(selectedImage);
        };

        reader.readAsDataURL(file);
    }
}
