import React, { useEffect, useState } from "react";
import { View, Button, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { S3 } from "aws-sdk";

const ImagePickerC = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const uploadImageToS3 = async (imageUri: string) => {
    const s3 = new S3({
      accessKeyId: "AKIAQU52JXFMQTHX5TR7",
      secretAccessKey: "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",
      region: "eu-north-1", // Cambia esto a la identificación de la región correcta
    });

    const key = `imagenes/${Date.now()}_${Math.random()}.jpg`;

    const params = {
      Bucket: "homeplannerimages",
      Key: key,
      Body: imageUri,
      ContentType: "image/jpg",
      ACL: "public-read",
    };

    try {
      const result = await s3.upload(params).promise();
      console.log("Imagen cargada en S3:", result.Location);
      return result.Location; // Devolver la URL de la imagen en S3
    } catch (error) {
      console.error("Error al cargar la imagen en S3:", error);
      return null;
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) { // Cambio "canceled" a "cancelled"
      setSelectedImage(result.assets[0].uri);

      // Subir la imagen a S3 y obtener la URL
      const imageUrl = await uploadImageToS3(result.assets[0].uri);
      if (imageUrl) {
        console.log("URL de imagen en S3:", imageUrl);
      } else {
        console.log("Error al subir la imagen a S3.");
      }
    }
  };

  return (
    <View className="flex">
      <Button title="Seleccionar imagen" onPress={pickImage} />
      {selectedImage && (
        <Image source={{ uri: selectedImage }} className="felx-1" />
      )}
      {hasPermission === false && (
        <Text>No tienes permisos para acceder a la galería</Text>
      )}
    </View>
  );
};

export default ImagePickerC;
