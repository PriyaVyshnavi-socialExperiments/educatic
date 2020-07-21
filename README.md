# Clone the repository.
git clone https://github.com/social-experiments/educatic.git

# Change into project directory.
cd educatic

# Install required global packages.
npm install -g @ionic/cli


# Install required packages.
npm install

# Prepare the `www` directory and launch a local HTTP server.
# view in the browser.
ionic serve


# iOS relies on Xcode to do the final app compile:
npm run ios
# Once Xcode launches, you can build your app binary through the standard Xcode workflow.


# Android relies on Android Studio (or, optionally, the Android CLI tools) to build the app:
npm run android
# Once Android Studio launches, you can build your app through the standard Android Studio workflow.