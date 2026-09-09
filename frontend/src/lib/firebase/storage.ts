import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export type StorageCategory = 'original' | 'processed' | 'overlays' | 'reports';

export const uploadFundusArtifact = async (
  screeningId: string,
  file: File | Blob,
  category: StorageCategory,
  fileName?: string
): Promise<string> => {
  const targetName = fileName || `${Date.now()}_scan.png`;
  let path = `screenings/${screeningId}/${category}/${targetName}`;
  if (category === 'reports') {
    path = `reports/${screeningId}/${targetName}`;
  }

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, {
    customMetadata: {
      screeningId,
      uploadedAt: new Date().toISOString(),
      category,
    },
  });

  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};
