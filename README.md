# Software Information Studio Team 15

## Group Members

| Name            | Student Number |
| --------------- | -------------- |
| Christopher Le  | 13915285       |
| Cameron Merrick | 24575007       |
| Ethan Burgess   | 13934500       |
| Ramon Tovar     | 12918761       |
| Kuan Wang       |                |
| Zheyu Huang     |                |

## Dependencies and Setting Up

- [Bun](https://bun.sh/docs/installation)
- [Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/getting-started.html) (you can boostrap a `conda` installation using the minimal installer such as [Miniconda](https://docs.anaconda.com/miniconda/)
- `best.pth` which is the trained model. This can be found [here](https://github.com/HZYSDS/classification_part). Once downloaded, place it into `SIS15/backend/app/model/` or set the default model path in `SIS15/backend/.env`

### Frontend
```bash
cd frontend
bun install
```

### Backend
```bash
cd backend

# Create a new Python v3.10 environment and install dependencies
conda env create -f environment.yaml
conda activate garbage

# Run the development server
python app
```
**OpenAI access key**

- Refer to our project discord text channel: `apis-datasets-sdk` find the pinned message for the secret key value
- Directory: `backend/openAIAPI.py`; Variable: `client = OpenAI(api_key="dummy key")` (line 3)
- Replace `dummy key` with the secret key found in discord

### Setup environment variables

Prior to setting up environment variables, it is important that you install [Microsoft Devtunnel](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started). This will allow you to open up a port that will later be utilised to pass captured image data through our established API endpoint and to the model and back with a classification.

Upon installing `Microsoft Devtunnel`, you will need to login;

```bash
devtunnel user login --github # This will take you to login on GitHub
```

and then generate a **tunneled URL**. Keep in mind that a new URL will be generated every time you start `Microsoft Devtunnel` and you will need to update your environment variables accordingly.

```bash
devtunnel host -p 5001 --allow-anonymous

# It should generate a tunneled URL like: https://qw5dpd7j.aue.devtunnels.ms:5001"
```

Then create a `.env` file in `frontend/` and copy the contents of `.env.example`, replacing the example variables with proper values:

```# .env
EXPO_PUBLIC_API_URL="YOUR_TUNNELED_URL_GOES_HERE"
```

## Running the Project
### Frontend

Run the following code snippet in the command line will in the `frontend/` directory and then with your camera, scan the generated QR code to open the application in `Expo Go`. If you need help setting up `Expo Go`, try this [getting started tutorial](https://docs.expo.dev/tutorial/create-your-first-app/).
```bash
cd frontend
bun expo start -c
```

### Backend

Run the following code snippet in the command line while in the `backend/` directory:
```bash
cd backend
python app
```

And then in another terminal instance, spin up your `Microsoft Devtunnel` with (remember to update your environment variables in `frontend/.env` with the newly generated URL):
```bash
devtunnel host -p 5001 --allow-anonymous
```
