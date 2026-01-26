export default ({config}) => {
  return {
    ...config,
    expo: {
      ...config.expo,
      android: {
        package: 'com.snapandgo',
        permissions: [
          'android.permission.CAMERA',
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.INTERNET',
        ],
        config: {
          googleMaps: {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          },
        },
      },
      ios: {
        config: {
          googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
        },
        bundleIdentifier: 'com.snapandgo',
      },
      extra: {
        eas: {
          projectId: 'a48402b3-e093-4edc-813f-8bf1b5a4fc29',
        },
      },
    },
  };
};
