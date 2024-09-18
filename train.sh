#!/bin/bash

# parameters
BATCH_SIZE=640
EPOCHS=16
MODEL_SIZE="ViT-L/14"
SAVE_MODEL="garbage_classification_model1.pth"

# run
python base_main.py \
  --batch_size $BATCH_SIZE \
  --epochs $EPOCHS \
  --model_size $MODEL_SIZE \
  --save_model $SAVE_MODEL