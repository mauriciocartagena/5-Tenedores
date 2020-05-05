import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
// import AddResturantForm from "../../components/Restaurants/AddRestaurantForm";

export default function AddResturants(props) {
  const { navigation } = props;
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View>
      <Text>Add restaurants</Text>
      {/* <AddResturantForm navigation={navigation}></AddResturantForm> */}
      <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
      <Loading isVisible={isLoading} text="Creando Restaurante"></Loading>
    </View>
  );
}
