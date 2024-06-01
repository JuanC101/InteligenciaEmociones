// Obtiene referencias a los elementos del DOM necesarios
const imageContainerJpg = document.querySelector('#foto-jpg');
const imageContainerPng = document.querySelector('#foto-png');
const titulopredictJpg = document.getElementById('prediction-text-jpg');
const titulopredictPng = document.getElementById('prediction-text-png');
const fileInputJpg = document.getElementById('file-upload-jpg');
const fileInputPng = document.getElementById('file-upload-png');
const detectButtonJpg = document.getElementById('detectButtonJpg');
const detectButtonPng = document.getElementById('detectButtonPng');

// Función para manejar la carga de imágenes
function handleFileUpload(fileInput, imageElement, titulopredict) {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageElement.src = e.target.result;
            imageElement.style.display = 'block';
            titulopredict.textContent = '';
        };
        reader.readAsDataURL(file);
    }
}

// Agrega un evento cambio a los inputs de archivos
fileInputJpg.addEventListener('change', function () {
    handleFileUpload(fileInputJpg, imageContainerJpg, titulopredictJpg);
});

fileInputPng.addEventListener('change', function () {
    handleFileUpload(fileInputPng, imageContainerPng, titulopredictPng);
});

// Función para detectar emoción
function detectEmotion(fileInput, titulopredict) {
    const file = fileInput.files[0];
    if (file) {
        var formData = new FormData();
        formData.append('file', file);

        fetch('http://127.0.0.1:8000/analizar', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al subir el Archivo.');
                }
                return response.json();
            })
            .then(data => {
                switch (data) {
                    case 0:
                        titulopredict.textContent = 'estresado';
                        break;
                    case 1:
                        titulopredict.textContent = 'llorando';
                        break;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

// Agrega un evento click a los botones para manejar el envío de la imagen al servidor
detectButtonJpg.addEventListener('click', function () {
    detectEmotion(fileInputJpg, titulopredictJpg);
});

detectButtonPng.addEventListener('click', function () {
    detectEmotion(fileInputPng, titulopredictPng);
});
