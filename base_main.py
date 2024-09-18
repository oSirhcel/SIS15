import os
import warnings
import argparse
import clip
import numpy as np
import pickle
from termcolor import colored
import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader
import tqdm
import tools

warnings.filterwarnings("ignore")

# Argument parsing
parser = argparse.ArgumentParser()
parser.add_argument('--batch_size', type=int, default=640, help='Batch size for training')
parser.add_argument('--dataset', type=str, default='garbage', help='Dataset to use')
parser.add_argument('--model_size', type=str, default='ViT-B/32', choices=tools.BACKBONES, help='Pretrained CLIP model to use')
parser.add_argument('--epochs', type=int, default=16, help='Number of training epochs')
parser.add_argument('--save_model', type=str, default='', help='Filename to save the trained model')
opt = parser.parse_args()

if __name__ == '__main__':
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Set seed and load dataset
    tools.seed_everything(42)
    opt, dataset = tools.setup(opt)
    dataloader = DataLoader(dataset, batch_size=opt.batch_size, shuffle=True, num_workers=8)

    # Load CLIP model
    print(colored(f"\nLoading CLIP model [{opt.model_size}] ...", "yellow", attrs=["bold"]))
    model, preprocess = clip.load(opt.model_size, device=device, jit=False)

    # Freeze the backbone (image encoder)
    for param in model.visual.parameters():  # 'model.visual' is the image encoder part of CLIP
        param.requires_grad = False  # Freezing the image encoder

    # Add classifier head
    if opt.model_size == 'ViT-L/14':
        classifier_input_dim = 768
    elif opt.model_size == 'ViT-B/32':
        classifier_input_dim = 512

    classifier = torch.nn.Linear(classifier_input_dim, len(dataset.classes))  # Use correct input dimension
    classifier.to(device)

    # Set optimizer and loss
    # optimizer = torch.optim.Adam(list(model.parameters()) + list(classifier.parameters()), lr=1e-5)
    # criterion = torch.nn.CrossEntropyLoss()

    optimizer = torch.optim.Adam(classifier.parameters(), lr=1e-5)  # Only optimize classifier head

    # Fine-tuning loop
    model.train()
    for epoch in range(opt.epochs):
        running_loss = 0.0
        correct, total = 0, 0
        for images, labels in tqdm.tqdm(dataloader, desc=f"Epoch {epoch+1}/{opt.epochs}"):
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()

            # Forward pass
            with torch.no_grad():  # Freeze the base model
                image_encodings = model.encode_image(images)
                image_encodings = F.normalize(image_encodings)

            image_encodings =image_encodings.float()
            outputs = classifier(image_encodings)
            loss = criterion(outputs, labels)

            # Backward pass
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

        print(f"Epoch [{epoch + 1}/{opt.epochs}], Loss: {running_loss / len(dataloader)}, Accuracy: {100. * correct / total}%")

    # Save the model
    if opt.save_model:
        os.makedirs('models', exist_ok=True)
        torch.save({
            'model_state_dict': model.state_dict(),
            'classifier_state_dict': classifier.state_dict(),
        }, f"models/{opt.save_model}")
        print(f"Model saved to models/{opt.save_model}")