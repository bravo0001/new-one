import base64
import io
import cv2
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO

app = FastAPI()

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained YOLOv8 nano model. It will download the weights automatically.
model = YOLO('yolov8n.pt')

class AnalyzeRequest(BaseModel):
    image: str  # Base64 encoded image (e.g., "data:image/jpeg;base64,...")

@app.post("/analyze")
async def analyze_image(request: AnalyzeRequest):
    try:
        # 1. Parse base64 string
        base64_str = request.image
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
            
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Could not decode image")

        # 2. Run YOLOv8 inference
        results = model(img)[0]
        
        # 3. Extract detected classes and draw bounding boxes
        detected_items = {}
        for box in results.boxes:
            # Get class name
            cls_id = int(box.cls[0])
            class_name = model.names[cls_id]
            conf = float(box.conf[0])
            
            # Count items and save highest confidence
            if class_name not in detected_items:
                detected_items[class_name] = {"count": 1, "confidence": conf}
            else:
                detected_items[class_name]["count"] += 1
                detected_items[class_name]["confidence"] = max(detected_items[class_name]["confidence"], conf)
                
            # Draw bounding box and label
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            
            # Draw rectangle (Green - #00FF00)
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            # Draw label background and text
            label = f"{class_name} {conf:.2f}"
            (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
            cv2.rectangle(img, (x1, y1 - 20), (x1 + w, y1), (0, 255, 0), -1)
            cv2.putText(img, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)

        # 4. Encode the annotated image back to base64
        _, buffer = cv2.imencode('.jpg', img)
        annotated_base64 = base64.b64encode(buffer).decode('utf-8')
        annotated_image_url = f"data:image/jpeg;base64,{annotated_base64}"
        
        # 5. Format results for frontend
        materials = []
        for name, data in detected_items.items():
            materials.append({
                "name": name.capitalize(),
                "percentage": int(data["confidence"] * 100),
                "count": data["count"]
            })
            
        # Default response if nothing found
        if not materials:
            materials = [{"name": "Unknown Area", "percentage": 0, "count": 0}]
            title = "No distinct waste objects detected"
        else:
            # Simple logic to determine title based on objects
            title = f"{materials[0]['name']} Waste"
            if len(materials) > 1:
                title += " & Mixed Objects"

        return {
            "success": True,
            "annotated_image": annotated_image_url,
            "title": title,
            "materials": materials,
            "estimated_kg": round(sum(m["count"] for m in materials) * 1.5, 1), # Rough mock estimation based on object count
            "severity": "HIGH PRIORITY" if len(materials) > 2 else "MODERATE",
            "confidence_avg": round(sum(m["percentage"] for m in materials) / len(materials), 1) if materials else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
