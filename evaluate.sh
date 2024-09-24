#!/bin/bash

# img path
if [ $# -eq 0 ]; then
    echo "Usage: ./evaluate.sh <image_path>"
    exit 1
fi

# parameters
MODEL_PATH="best.pth"   # model path
IMAGE_PATH="$1"
#NUM_CLASSES=12
CLASS_NAMES="battery biological brown-glass cardboard clothes green-glass metal paper plastic shoes trash white-glass"

# evaluate
python evaluate.py \
    --model_path $MODEL_PATH \
    --image_path $IMAGE_PATH \
    --class_names $CLASS
    _NAMES