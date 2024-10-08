import argparse
import os
import torch
from torchvision import transforms
from PIL import Image
import torch.nn.functional as F
import clip

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


def preprocess_image(image_path, image_size=224):
    preprocess = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize((0.48145466, 0.4578275, 0.40821073), (0.26862954, 0.26130258, 0.27577711)),
    ])
    image = Image.open(image_path).convert('RGB')
    return preprocess(image).unsqueeze(0)


def load_model(model_path):
    model, _ = clip.load("ViT-B/32", device=device, jit=False)
    checkpoint = torch.load(model_path, map_location=device)
    model.load_state_dict(checkpoint['clip_model_state_dict'])
    model.to(device)
    model.eval()
    return model


def classify_image(model, image_tensor, classes):
    text_inputs = torch.cat([clip.tokenize(f"a photo of a {c}") for c in classes]).to(device)
    with torch.no_grad():
        image_encoding = model.encode_image(image_tensor)
        image_encoding = F.normalize(image_encoding)
        text_encoding = model.encode_text(text_inputs)
        text_encoding = F.normalize(text_encoding)
        similarity = (100.0 * image_encoding @ text_encoding.T).softmax(dim=-1)
    predicted_class = similarity.argmax(dim=-1).item()
    return classes[predicted_class]


def evaluate_folder(folder_path, model, class_names):
    correct = 0
    total = 0
    for image_filename in os.listdir(folder_path):
        image_path = os.path.join(folder_path, image_filename)
        if os.path.isfile(image_path) and (image_filename.endswith('.jpg') or image_filename.endswith('.png')):
            image_tensor = preprocess_image(image_path)
            predicted_class = classify_image(model, image_tensor, class_names)
            true_class = os.path.basename(image_filename).split('_')[0]  # Assuming class is part of the file name

            print(f"Processing {image_filename}")
            print(f"Predicted: {predicted_class}, True: {true_class}")

            total += 1
            if predicted_class == true_class:
                correct += 1

    accuracy = 100 * correct / total if total > 0 else 0
    print(f"\nFinal Accuracy: {accuracy:.2f}% (Correct: {correct}/{total})")


def main():
    parser = argparse.ArgumentParser(description="Evaluate a trained model on a folder of images.")
    parser.add_argument('--model_path', type=str, required=True, help='Path to the trained model file')
    parser.add_argument('--folder_path', type=str, required=True, help='Path to the folder containing images')
    parser.add_argument('--class_names', type=str, nargs='+', required=True, help='List of class names for the dataset')
    args = parser.parse_args()

    # Load model
    model = load_model(args.model_path)

    # Evaluate all images in the folder
    evaluate_folder(args.folder_path, model, args.class_names)


if __name__ == '__main__':
    main()
