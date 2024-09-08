from flask import Flask, request, send_file
import os

app = Flask(__name__)

# Directory to save uploaded images
UPLOAD_FOLDER = '/Users/ethanburgess/Desktop/UTS/sem22024/sis/SIS15/backend/flaskAPI/testFileDir'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']

    if file.filename == '':
        return 'No selected file', 400

    if file:
        # Save the file
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        return f"File {file.filename} uploaded successfully.", 200

@app.route('/get_image/<filename>', methods=['GET'])
def get_image(filename):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        return send_file(file_path, mimetype='image/png')
    except FileNotFoundError:
        return 'File not found', 404

if __name__ == '__main__':
    app.run(debug=True)
