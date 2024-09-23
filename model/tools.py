import os
import random
import pathlib
import torch
import numpy as np
from torchvision import transforms
from torch.utils.data import Dataset
from PIL import Image

# Model backbones supported by CLIP
BACKBONES = [
    'RN50',
    'ViT-B/32',
    'ViT-L/14',
]

# Seed for reproducibility
def seed_everything(seed: int):
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

# Dataset setup
def setup(opt):
    opt.image_size = 224  # Default size for ViT-B/32
    transform = _transform(opt.image_size)

    if opt.dataset == 'garbage':
        dataset = CustomGarbageDataset('/Users/ethanburgess/Desktop/UTS/sem22024/sis/SIS15/model/datasets/garbage_classification', transform)
        opt.classes_to_load = None

    return opt, dataset

# Image transformation for CLIP models
def _transform(image_size):
    return transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize((0.48145466, 0.4578275, 0.40821073), (0.26862954, 0.26130258, 0.27577711)),
    ])

# Custom Garbage Dataset
class CustomGarbageDataset(Dataset):
    def __init__(self, data_dir, transform=None):
        self.data_dir = pathlib.Path(data_dir)
        self.transform = transform
        self.image_paths = []
        self.labels = []
        self.label_to_idx = {}

        # Iterate over folders for each class (assumes folder names are class labels)
        for idx, label in enumerate(sorted(os.listdir(self.data_dir))):
            label_dir = self.data_dir / label
            if label_dir.is_dir():
                for img_file in os.listdir(label_dir):
                    if img_file.endswith('.jpg') or img_file.endswith('.png'):
                        self.image_paths.append(label_dir / img_file)
                        self.labels.append(idx)
                self.label_to_idx[label] = idx

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        image_path = self.image_paths[idx]
        image = Image.open(image_path).convert('RGB')
        if self.transform:
            image = self.transform(image)
        label = self.labels[idx]
        return image, label