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
    return preprocess(image).unsqueeze(0)


# load model
def load_model(model_path):

    model, _ = clip.load("ViT-B/32", device=device, jit=False)


    checkpoint = torch.load(model_path, map_location=device, weights_only=True)
    model.load_state_dict(checkpoint['clip_model_state_dict'])

    model.to(device)
    model.eval()
    return model



# classification
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



def main():

    parser = argparse.ArgumentParser(description="Evaluate a trained model on new images.")
    parser.add_argument('--model_path', type=str, required=True, help='Path to the trained model file')
    parser.add_argument('--image_path', type=str, required=True, help='Path to the image file to classify')
    # parser.add_argument('--num_classes', type=int, required=True, help='Number of classes in the classification task')
    parser.add_argument('--class_names', type=str, nargs='+', required=True, help='List of class names for the dataset')
    args = parser.parse_args()


    # model, classifier = load_model(args.model_path, args.num_classes)
    model = load_model(args.model_path)

    image_tensor = preprocess_image(args.image_path)


    predicted_class = classify_image(model,  image_tensor, args.class_names)


    print(f"Predicted class for the image: {predicted_class}")


if __name__ == '__main__':
    main()