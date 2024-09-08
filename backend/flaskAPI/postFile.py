import requests

# Define the API endpoint
url = "http://127.0.0.1:5000/upload"  # Replace this with the actual API endpoint

# Path to the file you want to upload
file_path = "/Users/ethanburgess/Desktop/Screenshot 2024-07-04 at 3.07.30 pm.png"

# Open the file in binary mode
with open(file_path, 'rb') as file:
    # Define the file as a multipart/form-data dictionary
    files = {'file': file}

    # Send a POST request to upload the file
    response = requests.post(url, files=files)

# Check the response from the server
if response.status_code == 200:
    print("File uploaded successfully!")
else:
    print(f"Failed to upload file. Status code: {response.status_code}")
    print(response.text)
