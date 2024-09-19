# Software Information Studio Team 15

### Group Members

| Name            | Student Number |
| --------------- | -------------- |
| Christopher Le  | 13915285       |
| Cameron Merrick | 24575007       |
| Ethan Burgess   |                |
| Ramon Tovar     |                |
| Kuan Wang       |                |
| Zheyu Huang     |                |

### Dependencies

- [Bun](https://bun.sh/docs/installation)

### Testing

**Running the app:**

```bash
cd frontend
bun install
```

# Setup environment variables
create a .env file and copy the contents of .env.example, replacing the example variables with proper values:
```# .env
EXPO_PUBLIC_API_URL="YOUR_TUNNELED_URL_GOES_HERE"
```

# Running on Android:
```
bun run android
```

# Running on IOS:
```
bun run ios
```

**Running the API:**

```bash
cd backend
python -m venv venv
source venv/bin/activate

# Install dependencies using pip:
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
nano .env

# Execute app.py
python app.py
```

**Microsoft Devtunnel Setup**

- It is also recommended to setup `devtunnel` to access the API from your device
- https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started

(If you are using vscode you can just forward port 5000, and set the tunnel to be public)

```bash
devtunnel user login --github
devtunnel host -p 5000 --allow-anonymous
```

- Then change the EXPO_PUBLIC_API_URL in the frontend .env
