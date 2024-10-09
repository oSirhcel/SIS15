import torch
import clip
import torch.nn.functional as F
from PIL import Image
import argparse
import os

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Use the CLIP-provided preprocessing function for consistency
def preprocess_image(image_path, preprocess):
    image = Image.open(image_path).convert('RGB')
    return preprocess(image).unsqueeze(0)

# Load the CLIP model and classifier
def load_model(model_path, num_classes):
    checkpoint = torch.load(model_path)
    model, preprocess = clip.load("ViT-B/32", device=device, jit=False)

    # define and load classifier
    classifier = torch.nn.Linear(512, num_classes)
    classifier.load_state_dict(checkpoint['classifier_state_dict'])

    model.to(device)
    classifier.to(device)

    model.eval()
    classifier.eval()

    return model, classifier, preprocess

# Classification function
def classify_image(model, classifier, image_tensor, classes):
    with torch.no_grad():
        image_encoding = model.encode_image(image_tensor.to(device))
        image_encoding = F.normalize(image_encoding)  # Normalize image encoding

    with torch.no_grad():
        output = classifier(image_encoding)
        predicted_class = torch.argmax(output, dim=1).item()

    return classes[predicted_class]

def main():
    parser = argparse.ArgumentParser(description="Evaluate a trained model on new images.")
    parser.add_argument('--model_path', type=str, required=True, help='Path to the trained model file')
    parser.add_argument('--image_path', type=str, required=True, help='Path to the image file to classify')
    parser.add_argument('--num_classes', type=int, required=True, help='Number of classes in the classification task')
    parser.add_argument('--class_names', type=str, nargs='+', required=True, help='List of class names for the dataset')
    args = parser.parse_args()

    model, classifier, preprocess = load_model(args.model_path, args.num_classes)

    image_tensor = preprocess_image(args.image_path, preprocess)

    predicted_class = classify_image(model, classifier, image_tensor, args.class_names)

    print(f"Predicted class for the image: {predicted_class}")

if __name__ == '__main__':
    main()
