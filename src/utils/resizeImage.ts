import ImageResizer from '@bam.tech/react-native-image-resizer';
import {PhotoResizeResult} from '@/types/photo';

export default async function ResizeImage(
  imageUri: string,
): Promise<PhotoResizeResult | undefined> {
  try {
    const result = await ImageResizer.createResizedImage(
      imageUri,
      1280,
      1280,
      'JPEG',
      95,
      0,
      undefined,
      false,
      {
        mode: 'contain',
      },
    );
    return result;
  } catch (error) {
    console.error(error);
    // throw new Error(error);
  }
}
