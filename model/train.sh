#!/bin/bash

# parameters
BATCH_SIZE=640
EPOCHS=30
MODEL_SIZE="ViT-L/14"
SAVE_MODEL="garbage_classification_model2.pth"

# run
python base_main.py \
  --batch_size $BATCH_SIZE \
  --epochs $EPOCHS \
  --model_size $MODEL_SIZE \
  --save_model $SAVE_MODEL