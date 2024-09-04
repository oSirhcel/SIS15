from ultralytics import YOLO

model = YOLO('best.pt')

source = 'images/paper-bag.jpg', 'images/Beer_bottles_2018_G1.jpg', 'images/food-waste.jpg'

model.predict(source, save = True, imgsz=640, conf=0.2)
