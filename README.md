# Chatdrop

Social media web app developed by Nitish Kumar & Sumit Kumar.

### Features

- Authentication

- OAuth (with google sign in)

- Profile 

- Post

- Stories

- Reels

- Friends

- Fan Following

- Chats (with single layer encryption)

- Secret Chats (with end-to-end encryption using signal-protocol)

- Olivia Ai (powered with chatgpt)

- Search

- Notifications

- Privacy and Blocking System

- Security (using AES-256 bit encryption)

### Getting Started

- Create .env.local file with the following code in it.

```
REACT_APP_FIREBASE_API_KEY="REACT_APP_FIREBASE_API_KEY"
REACT_APP_FIREBASE_AUTH_DOMAIN="REACT_APP_FIREBASE_AUTH_DOMAIN"
REACT_APP_FIREBASE_PROJECT_ID="REACT_APP_FIREBASE_PROJECT_ID"
REACT_APP_FIREBASE_STORAGE_BUCKET="REACT_APP_FIREBASE_STORAGE_BUCKET"
REACT_APP_FIREBASE_MESSAGE_SENDER_ID="REACT_APP_FIREBASE_MESSAGE_SENDER_ID"
REACT_APP_FIREBASE_APP_ID="REACT_APP_FIREBASE_APP_ID"
REACT_APP_FIREBASE_MEASUREMENT_ID="REACT_APP_FIREBASE_MEASUREMENT_ID"
REACT_APP_FIREBASE_VAPID_KEY="REACT_APP_FIREBASE_VAPID_KEY"
```

- This web app requires firebase connectivity.

- Also this project has a proxy in package.json at http://127.0.0.1:8000 on which [chatdrop server](https://github.com/Nitish987/chatdrop-django) is running. Visit [chatdrop server](https://github.com/Nitish987/chatdrop-django) repository to setup server.

- Some features of this project are not fully completed yet.

### Related Repositories

- [Chatdrop Mobile App](https://github.com/Nitish987/chatdrop-flutter)

- [Chatdrop Server](https://github.com/Nitish987/chatdrop-django)