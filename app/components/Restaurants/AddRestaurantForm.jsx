import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const WidthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [imagesSelected, setImagesSelected] = useState([]);

  return (
    <ScrollView>
      <ImageRestaurant imageRestaurant={imagesSelected[0]}></ImageRestaurant>
      <UploadImagen
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
        toastRef={toastRef}
      ></UploadImagen>
    </ScrollView>
  );
}
function ImageRestaurant(props) {
  const { imageRestaurant } = props;
  return (
    <View style={styles.viewPhoto}>
      {imageRestaurant ? (
        <Image
          source={{ uri: imageRestaurant }}
          style={{ width: WidthScreen, height: 200 }}
        ></Image>
      ) : (
        <Image
          source={require("../../../assets/img/no-image.png")}
          style={{ width: WidthScreen, height: 200 }}
        ></Image>
      )}
    </View>
  );
}
function UploadImagen(props) {
  const { imagesSelected, setImagesSelected, toastRef } = props;
  //permisos para dar acceso a nuestro telefono
  const imageSelect = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;
    if (resultPermissionCamera === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la galeria, si lo haz rechazao tienes que activarlo manulmente ",
        5000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galeria sin seleccionar niguna imagen",
          3000
        );
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };
  const removeImage = (image) => {
    const arrayImages = imagesSelected;
    Alert.alert(
      "Eliminar Imagen",
      "Estas seguro que quieres eliminar la Imagen ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () =>
            setImagesSelected(
              //filter sirve para comparar un array y recorrer y para eliminar
              arrayImages.filter((imageUrl) => imageUrl !== image)
            ),
        },
      ],
      {
        cancelable: false,
      }
    );
  };
  return (
    <View style={styles.viewImages}>
      {imagesSelected.length < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        ></Icon>
      )}

      {imagesSelected.map((imageRestaurant) => (
        <Avatar
          key={imageRestaurant}
          onPress={() => removeImage(imageRestaurant)}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
        ></Avatar>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 30,
    marginRight: 20,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: WidthScreen,
    height: 70,
    marginRight: 1,
    flex: 1, 
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
});
