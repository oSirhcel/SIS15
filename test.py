from ultralytics import YOLO

model = YOLO('yolov8n.pt')

source = 'images/British-shorthaired.jpeg'

model.predict(source, save = True, imgsz=640, conf=0.2)
