import * as ImagePicker from "expo-image-picker";
import { S3 } from "aws-sdk";
  

export async function pickImageAndUploadToS3(onImageUploaded: (imageUrl: string) => void) {
  const hasPermission = await checkPermission();

  if (hasPermission) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = await uploadImageToS3(result.assets[0].uri);
      if (imageUrl) {
        onImageUploaded(imageUrl);
      } else {
        console.log("Error al subir la imagen a S3.");
      }
    }
  } else {
    console.log("No tienes permisos para acceder a la galería");
  }
}

async function checkPermission() {
  const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return galleryStatus.status === "granted";
}

async function uploadImageToS3(imageUri: string) {
  const s3 = new S3({
    accessKeyId: "AKIAQU52JXFMQTHX5TR7",
    secretAccessKey: "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",
    region: "eu-north-1",
    signatureVersion: "v4"
  });

  const key = `imagenes/${Date.now()}1.jpg`;

  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
  
    const params = {
      Bucket: "homeplannerimages",
      Key: key,
      Body: blob,
      ContentType: "image/jpeg",
      ACL: "public-read",
    };
  
    const result = await s3.upload(params).promise();
    console.log("Imagen cargada en S3:", result.Location);
    return result.Location;
  } catch (error) {
    console.error("Error al cargar la imagen en S3:", error);
    return null;
  }
}



