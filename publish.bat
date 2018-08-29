ionic cordova build --release android
cd C:/Users/roger/GIT/appControleFinanceiro/platforms/android/build/outputs/apk/
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name
rm ctrlfin.apk
zipalign -v 4 android-release-unsigned.apk ctrlfin.apk
mv ctrlfin.apk C:/Users/roger/Desktop
cmd