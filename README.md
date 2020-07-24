## Application Setup

### Prerequiste

To install Ionic, you need npm(node package manager). By using npm only, you can install the Ionic and Cordova/Capacitor. The npm comes from the Node.js. So download and install the Node.js.
[Node] (https://nodejs.org/en/download/)

- Now you can install the Ionic latest version using the npm. Open your command prompt and type the below command.

    npm install -g ionic@latest
The -g means it is a global install. For Window’s, it's recommended to open an Admin command prompt. For Mac/Linux, run the command with sudo

- You can get the Ionic information using the below command.
    ionic info

### Clone the repository.
    git clone https://github.com/social-experiments/educatic.git

### Change into project directory.
    cd educatic

### Install required global packages.
    npm install -g @ionic/cli

### Install required packages.
    npm install

### Prepare the `www` directory and launch a local HTTP server.
- view in the browser.
    ionic serve

### iOS relies on Xcode to do the final app compile:
    npm run ios
- Once Xcode launches, you can build your app binary through the standard Xcode workflow.
   (https://developer.apple.com/xcode/resources/)

### Android relies on Android Studio (or, optionally, the Android CLI tools) to build the app:
    npm run android
- Once Android Studio launches, you can build your app through the standard Android Studio workflow.
     (https://developer.android.com/studio)