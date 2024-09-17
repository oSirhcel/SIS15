#!/bin/bash

# parameters
BATCH_SIZE=64
EPOCHS=10
MODEL_SIZE="ViT-B/32"
SAVE_MODEL="garbage_classification_model.pth"

# run
python base_main.py \
  --batch_size $BATCH_SIZE \
  --epochs $EPOCHS \
  --model_size $MODEL_SIZE \
  --save_model $SAVE_MODEL