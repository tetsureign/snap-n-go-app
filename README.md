# Snap & Go

A Google Lens-like mobile app that detects objects in images and searches for shops that sell them. This is a personal project built with React Native, object detection powered by YOLOv5 and shop search on Google Maps.

This is a university project. Originally a two-person project. You can view it at the branch [uni-project-finalver](https://github.com/tetsureign/SnapAndGo/tree/uni-project-finalver). I mostly did the React Native app and detection integration. History was saved to a Firebase instance, done by [@SwankyOrcc](https://github.com/SwankyOrcc). I've decided to iterate through this project from time to time and build a separate backend to study.

## Project History and Decisions

### Initial Development (University Project - late 2022)

- Originally a two-person university project where I focused on the React Native mobile app and object detection integration
- Search history was saved to Firebase (handled by [@SwankyOrcc](https://github.com/SwankyOrcc))
- Initially I only wanted to use bare-metal React Native, as I thought maybe it would be easier to integrate native modules that way. Well, not using Expo from the get-go introduced many problems, and I had to wrestle with RN and native modules for quite a bit
- I introduced the core Expo package anyway, since I needed to use `expo-camera`, because I encountered some odd issues that I can't recall at the time of writing this readme from `react-native-vision-camera`
- Initial MVP was developed in about one and a half week. Turns out, learning React, React Native, JavaScript, their ecosystem and mobile at the same time in a short amount of time was quite taxing
- Object detection powered by YOLOv5 through direct API calls to the FastAPI Microservice. Originally planned to run the model locally using ONNX, but turns out I didn't have the skills to do that, and the speed should vary greatly depends on which device it runs on. Doing and running ML in Python is still easier, so my friend [@HoangLongHotarou](https://github.com/HoangLongHotarou) drafted a very simple FastAPI project that could run the base YOLOv5s model. Had the experience of trying to deploy the Docker image of it on AWS EC2 also. Still using it as a microservice for now
- No UI styling library used
- Received 8.7/10 for this project

### Structural Refactor (late 2024)

- The project structure was too messy at the time of MVP and university-presentable state, as one file could handle multiple things at once. Since I also wanted to add more functionalities to the project, I've decided to make it at least maintainable first
- Done some misc fixes around that time as well. In the end, the project was definitely more maintainable, but there are still works to be done...
- The new backend wasn't done at the time, and the new features depends on the new backend, so the project is on hiatus yet again

### Backend Refactor (late 2024 - early 2025)

- Built a custom Express backend that tried to run a ML service in Node with TensorFlow.js, based on the Coco-SSD model as a temporary step towards fully implementing back YOLOv5 in Node

### TypeScript Refactor and Expo upgrades (early 2025)

- Learned first-hand with this project that using JavaScript is a bit of a pain. No IntelliSense, no type safety. So, I've decided to refactor the project to fully use TypeScript as I'm learning it along the way
- Upgraded Expo by incrementally bumping versions and fixing package conflicts along the way. Also adopted Expo Prebuild. I'm done wrestling with native `android/` and `ios/` folders
- Did some additional structural refactor this time as well, to better align with conventions and improve maintainability. Most notable: extracted styles to component-aligned style files, and reusable styles to `src/styles/theme.ts`

### Final Backend Architecture (early 2025)

- In the end, running ML in Python is still easier, so I scrapped running it on Node and decided to use the microservice architecture (still barebone API calling for now, no message queue for more reliabitity yet)
- Built a proper backend architecture with user accounts handling with OAuth and search history saving. Also upgraded from Express to Fastify because I wanted a bit more toys and less pain DIY-ing everything
- Separated concerns: Fastify backend handles API routing and business logic, while YOLOv5 runs as an independent FastAPI microservice
- This was also primarily for learning purposes

### Current Iteration

- Planning to add user authentication and search history features, as they have already been finished on the backend
- Maybe explore better state management patterns and performance optimizations

## Features

- Camera capture using expo-camera
- Image picker support for selecting existing photos
- Object detection via YOLOv5 API
- Detection results with bounding boxes visualization
- Google Maps search integration for detected objects
- Action sheet UI for results interaction

## UI Design

[Figma Prototype](https://www.figma.com/proto/TVJnAe6SNH8h2RSS8qGMgz/Snap-Go?node-id=1-3&t=gihwzmkpijuaxpk4-1&starting-point-node-id=1%3A3)

## Demo

- TODO: Videos and pictures

## Tech Stack

- **Frontend**: React Native (0.76.9), Expo (~52.0.42)
- **Navigation**: React Navigation (native-stack, bottom-tabs)
- **Camera**: expo-camera
- **Image Processing**: @bam.tech/react-native-image-resizer
- **State Management**: React hooks (useReducer, useState)
- **HTTP Client**: Axios
- **UI**: react-native-actions-sheet
- **Maps**: react-native-maps (with Google Maps integration - not currently using, resdirects to Google's main app for now)
- **Backend**: Fastify ([Repo](https://github.com/tetsureign/snap-n-go-apiv2))
- **ML Service**: YOLOv5 microservice on FastAPI ([Repo](https://github.com/tetsureign/SnapAndGo-microsvc-objdetect))
- **Language**: TypeScript
- **Tooling**: ESLint, Jest

## Architecture

The app follows a microservices architecture:

```
Mobile App → Fastify Backend → YOLOv5 FastAPI Microservice
```

1. **Mobile App**: Captures or selects an image, sends it to the Fastify backend
2. **Fastify Backend**: Receives the image and forwards it to the YOLOv5 service
3. **YOLOv5 Microservice**: Processes the image and returns detected objects with coordinates and confidence scores
4. **Results Display**: The app visualizes detected objects with bounding boxes and allows users to search for shops selling those items on Google Maps

## Requirements

- Node.js
- pnpm (package manager)
- Expo CLI
- Android Studio / Xcode for local development
- Backend services running (Fastify + YOLOv5 FastAPI)

## Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and use your own values.

3. **Start backend services**:
   Ensure your Fastify backend and YOLOv5 FastAPI microservice are running.

4. **Run the app**:

   ```bash
   # Start Expo dev client
   pnpm start

   # Or run on specific platform
   pnpm run android
   pnpm run ios
   ```

## Environment Variables

- `EXPO_PUBLIC_API_URL` - Fastify backend base URL (e.g., http://localhost:3000)
- `EXPO_PUBLIC_GOOGLE_API_KEY` - Google Maps API key for map integration (not required yet)

## Available Scripts

- `pnpm start` - Start Expo dev client
- `pnpm run android` - Run on Android
- `pnpm run ios` - Run on iOS
- `pnpm run prebuild` - Generate native code
- `pnpm test` - Run Jest tests
- `pnpm run lint` - Run ESLint

## Development Notes

- Uses Expo dev client (not Expo Go)
- EAS Build configured (eas.json present)
- TypeScript path aliases: `@/*` maps to `src/*`
- Detection response format: `{ success: boolean, data: DetectionResultType[] }`
- Images are sent as multipart/form-data with key 'image'
