from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import io
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/heatmap")
async def generate_heatmap(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file, index_col=0)
        plt.figure(figsize=(10, 8))
        sns.heatmap(df, cmap="viridis")
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        plt.close()
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode("utf-8")
        return JSONResponse(content={"image": image_base64})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
