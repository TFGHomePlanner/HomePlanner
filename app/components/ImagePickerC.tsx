import React, { useEffect, useState } from "react";
import { View, Button, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

export function ImagePickerC() {

  const [selectedImage, setSelectedImage] = useState("");
  const [haspermission, setHaspermission] = useState(false);

  useEffect(() => { 
    (async() => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHaspermission(galleryStatus.status === "granted");
    })();
  }, []);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if(!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
    const pickImageAsync = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      } else {
        alert("You did not select any image.");
      }
      if(haspermission === false) {
        return <Text> No tienes permisos para acceder a la galería </Text>;
      }
    };
  };

  return (
    <View className="flex">
      <Button title="Seleccionar imagen" onPress={pickImage} />
      {selectedImage && <Image source={{uri: selectedImage}} className="felx-1"></Image> }
    </View>
    
  );
}
export default ImagePickerC;