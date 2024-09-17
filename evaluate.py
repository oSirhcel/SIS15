import torch
import clip
import torch.nn.functional as F
from PIL import Image
import argparse
from torchvision import transforms
import os


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')



def preprocess_image(image_path, image_size=224):
    preprocess = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize((0.48145466, 0.4578275, 0.40821073), (0.26862954, 0.26130258, 0.27577711)),
    ])
    image = Image.open(image_path).convert('RGB')
    return preprocess(image).unsqueeze(0)  # 返回的是一个 4D tensor


# load model
def load_model(model_path, num_classes):

    checkpoint = torch.load(model_path)

    model, _ = clip.load("ViT-B/32", device=device, jit=False)

    # define and load classifier
    classifier = torch.nn.Linear(512, num_classes)
    classifier.load_state_dict(checkpoint['classifier_state_dict'])


    model.to(device)
    classifier.to(device)


    model.eval()
    classifier.eval()

    return model, classifier


# classification
def classify_image(model, classifier, image_tensor, classes):
    # img_emb
    with torch.no_grad():
        image_encoding = model.encode_image(image_tensor.to(device))
        image_encoding = F.normalize(image_encoding)  # 标准化

    # predict
    with torch.no_grad():
        output = classifier(image_encoding)
        predicted_class = torch.argmax(output, dim=1).item()

    # result
    return classes[predicted_class]



def main():

    parser = argparse.ArgumentParser(description="Evaluate a trained model on new images.")
    parser.add_argument('--model_path', type=str, required=True, help='Path to the trained model file')
    parser.add_argument('--image_path', type=str, required=True, help='Path to the image file to classify')
    parser.add_argument('--num_classes', type=int, required=True, help='Number of classes in the classification task')
    parser.add_argument('--class_names', type=str, nargs='+', required=True, help='List of class names for the dataset')
    args = parser.parse_args()


    model, classifier = load_model(args.model_path, args.num_classes)


    image_tensor = preprocess_image(args.image_path)


    predicted_class = classify_image(model, classifier, image_tensor, args.class_names)


    print(f"Predicted class for the image: {predicted_class}")


if __name__ == '__main__':
    main()