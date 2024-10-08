import clip
import torch
from torchvision import transforms
from torch.utils.data import DataLoader
from tqdm import tqdm
import os
from PIL import Image
import argparse


class CustomDataset(torch.utils.data.Dataset):
    def __init__(self, root_dir, preprocess):
        self.root_dir = root_dir
        self.preprocess = preprocess
        self.image_paths = []
        self.labels = []
        self.class_names = sorted(os.listdir(root_dir))
        for class_name in self.class_names:
            class_dir = os.path.join(root_dir, class_name)
            if os.path.isdir(class_dir):
                for img_name in os.listdir(class_dir):
                    img_path = os.path.join(class_dir, img_name)
                    if img_path.endswith(('png', 'jpg', 'jpeg')):
                        self.image_paths.append(img_path)
                        self.labels.append(class_name)

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        image = Image.open(img_path).convert("RGB")
        image = self.preprocess(image)
        label = self.class_names.index(self.labels[idx])
        return image, label, img_path  # Include img_path for debugging purposes


def calculate_accuracy(predictions, labels):
    correct = 0
    total = len(labels)
    for pred, label in zip(predictions, labels):
        if pred == label:
            correct += 1
    return correct / total


def main(dataset_dir, model_size, batch_size, pth_file):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = clip.load(model_size, device)

    checkpoint = torch.load(pth_file)
    model.load_state_dict(checkpoint['clip_model_state_dict'])

    model.eval()

    dataset = CustomDataset(dataset_dir, preprocess)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=False)

    class_names = dataset.class_names
    text_inputs = torch.cat([clip.tokenize(f"a photo of a {c}") for c in class_names]).to(device)

    all_preds, all_labels = [], []
    incorrect_images = []  # List to store the paths of misclassified images

    with torch.no_grad():
        for images, labels, img_paths in tqdm(dataloader, desc="Evaluating"):  # Unpack three values now
            images = images.to(device)

            image_features = model.encode_image(images)
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)

            text_features = model.encode_text(text_inputs)
            text_features = text_features / text_features.norm(dim=-1, keepdim=True)

            similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)

            predicted_class_indices = similarity.argmax(dim=-1)

            all_preds.extend(predicted_class_indices.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

            # Print out the prediction and correct class for each image in the batch
            for i, pred_idx in enumerate(predicted_class_indices):
                pred_class = class_names[pred_idx]
                true_class = class_names[labels[i]]
                img_path = img_paths[i]

                if pred_class != true_class:
                    incorrect_images.append(img_path)  # Track misclassified images

                print(f"Image: {img_path} | Predicted: {pred_class} | Correct: {true_class}")

    accuracy = calculate_accuracy(all_preds, all_labels)
    print(f"Zero-shot classification accuracy: {accuracy * 100:.2f}%")

    # Output the paths of misclassified images
    if incorrect_images:
        print("\nMisclassified Images:")
        for img in incorrect_images:
            print(img)
    else:
        print("\nNo misclassified images found.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset_dir', type=str, required=True, help='Path to the root directory of the dataset')
    parser.add_argument('--model_size', type=str, default="ViT-B/32", help='CLIP model size to use, e.g. ViT-B/32')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size for testing')
    parser.add_argument('--pth_file', type=str, required=True, help='Path to the pretrained .pth file')
    args = parser.parse_args()

    main(args.dataset_dir, args.model_size, args.batch_size, args.pth_file)
    # command： python test_accuracy.py --dataset_dir ./datasets/garbage_classification --model_size ViT-B/32 --batch_size 32 --pth_file models/best.pth