from fastapi import FastAPI, File, UploadFile, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from PIL import Image
import io
from fastapi.templating import Jinja2Templates


app = FastAPI()

with tf.keras.utils.custom_object_scope({'KerasLayer': hub.KerasLayer}):
    model = tf.keras.models.load_model('mm/modelo_entrenado.h5')


# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analizar")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((224, 224)) 
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0) 
    prediction = model.predict(image_array)
    print(prediction)
    predicted_class = np.argmax(prediction) 
    print(predicted_class) 
    return int(predicted_class)
