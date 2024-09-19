# Software Information Studio Team 15

### Group Members

| Name | Student Number |
| --- | --- |
| Christopher Le | 13915285 |
| Cameron Merrick | 24575007 |
| Ethan Burgess |  |
| Ramon Tovar |  |
| Kuan Wang |  |
| Zheyu Huang |  |


### Dependencies
- [Bun](https://bun.sh/docs/installation)

### Testing

**Running the app:**
```bash
cd frontend
bun install

# Running on Android:
bun run android

# Running on IOS:
bun run ios
```

**Running the API:**
```bash
cd backend
python -m venv venv
source venv/bin/activate

# Install dependencies using pip:
pip install -r requirements.txt

# Create and edit .env template
cp .env.example .env
nano .env

# Execute app.py
python app.py
```

**Microsoft Devtunnel Setup**
- It is also recommended to setup `devtunnel` to access the API from your device
- https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started
```bash
devtunnel user login --github
devtunnel host -p 5000 --allow-anonymous
```
- Then change the hardcoded URL in `frontend/api/history/use-get-user-history.ts` and `frontend/api/scan/use-scan-item.ts`.