from ultralytics import YOLO

model = YOLO('best2.pt')

source = 'images/360_F_498362712_7sJRmv7sOsfCtqieE0wtIjUpdUBvF4PY.jpg', 'images/Battery.jpg', 'images/food-waste.jpg'

model.predict(source, save = True, imgsz=640, conf=0.2)
