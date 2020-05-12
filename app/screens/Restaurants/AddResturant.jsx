import React, { useState, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddResturantForm from "../../components/Restaurants/AddRestaurantForm";

export default function AddResturants(props) {
  const { navigation } = props;
  const { setIsReloadRestaurants } = navigation.state.params;
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  console.log(navigation.state.params);
  return (
    <View>
      <AddResturantForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
        setIsReloadRestaurants={setIsReloadRestaurants}
      ></AddResturantForm>
      <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
      <Loading isVisible={isLoading} text="Creando Restaurante"></Loading>
    </View>
  );
}
