import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import { isPlatform } from '@ionic/vue';     // ✅ ตรวจว่าเป็น web หรือ mobile
import { Capacitor } from '@capacitor/core'; // ✅ แปลง path สำหรับ mobile


const PHOTO_STORAGE = 'photos';

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

export const usePhotoGallery = () => {


    const photos = ref<UserPhoto[]>([]);
    

    const addNewToGallery = async () => {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = Date.now() + '.jpeg';

        // 👉 บันทึกรูปลง filesystem
        const savedImageFile = await savePicture(capturedPhoto, fileName);

        photos.value = [savedImageFile, ...photos.value];

        // 👉 บันทึกรายการรูปลง storage
        Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(photos.value),
        });

    };

    // 👉 ฟังก์ชันบันทึกรูป
    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
        let base64Data: string | Blob;

        // 📱 Android / iOS
        if (isPlatform('hybrid')) {
            const readFile = await Filesystem.readFile({
                path: photo.path!,
            });
            base64Data = readFile.data;
        }
        // 🌐 Web
        else {
            const response = await fetch(photo.webPath!);
            const blob = await response.blob();
            base64Data = (await convertBlobToBase64(blob)) as string;
        }

        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        // 📱 Mobile
        if (isPlatform('hybrid')) {
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
            };
        }
        // 🌐 Web
        else {
            return {
                filepath: fileName,
                webviewPath: photo.webPath,
            };
        }
    };


    // 👉 helper แปลง blob → base64 (สำหรับ web)
    const convertBlobToBase64 = (blob: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });

    const loadSaved = async () => {
        const { value } = await Preferences.get({ key: PHOTO_STORAGE });
        const savedPhotos: UserPhoto[] = value ? JSON.parse(value) : [];

        // 🌐 Web ต้องแปลง base64
        if (!isPlatform('hybrid')) {
            for (const photo of savedPhotos) {
                const file = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                });
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
            }
        }

        photos.value = savedPhotos;
    };
    onMounted(loadSaved);
    watch(photos, () => {
        Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(photos.value),
        });
    });



    return {
        photos,
        addNewToGallery,
        loadSaved,
    };



};
