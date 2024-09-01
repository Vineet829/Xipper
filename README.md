# XIPPER React Native App

XIPPER is a React Native application that allows users to sign up or log in using their phone number and OTP verification. The app also includes a home screen with location-based recommendations.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication via phone number and OTP
- Location-based recommendations
- Categories and recommendations display
- Logout functionality

## Installation

### Prerequisites

- Node.js and npm (Node Package Manager)
- Expo CLI
- MongoDB

### Frontend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/xipper.git
   cd xipper
   ```  

2. Install dependencies:
```bash
npm install
```
3. Start development server

```bash
expo start
```
### Backend Setup

1. Go to the backend directory:

```bash
cd backend
Installing dependencies:
```
2. Install dependencies:


```bash
npm install
```


3 .Create a .env file in the backend directory and add the following environment variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_SERVICE_SID=your_twilio_service_sid


4. Start the backend server:

```bash
npm start
```
## Usage

### Frontend

- **Login Screen**: Enter your phone number and select your country code to receive an OTP.

<img src="https://github.com/Vineet829/Xipper/blob/main/assets/images/Xipper1.jpeg" alt="Login Screen" width="300" height="500">




- **OTP Authentication Screen**: Enter the OTP received via phone number to authenticate your account.

<img src="https://github.com/Vineet829/Xipper/blob/main/assets/images/Xipper2.jpeg" alt="Login Screen" width="300" height="500">

<img src="https://github.com/Vineet829/Xipper/blob/main/assets/images/Xipper3.jpeg" alt="Login Screen" width="300" height="500">

- **Home Screen**: View location-based recommendations and categories.

<img src="https://github.com/Vineet829/Xipper/blob/main/assets/images/Xipper4.jpeg" alt="Login Screen" width="300" height="500">

<img src="https://github.com/Vineet829/Xipper/blob/main/assets/images/Xipper5.jpeg" alt="Login Screen" width="300" height="500">

### Backend

- **Send OTP**: `POST /api/auth/send-otp`
  - Request Body:
    ```json
    {
      "phoneNumber": "+1234567890"
    }
    ```

- **OTP Authentication**: `POST /api/auth/verify-otp`
  - Request Body:
    ```json
    {
      "phoneNumber": "+1234567890",
      "otp": "123456"
    }
    ```
