import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
import Toast from "react-native-easy-toast";
import ListTopRestaurants from "../components/Ranking/ListTopRestaurants";
const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      db.collection("restaurants")
        .orderBy("riting", "desc")
        .limit(5)
        .get()
        .then((response) => {
          const restaurantsArray = [];
          response.forEach((doc) => {
            let restaurants = doc.data();
            restaurants.id = doc.id;
            restaurantsArray.push(restaurants);
          });
          setRestaurants(restaurantsArray);
        })
        .catch(() => {
          toastRef.current.show("Error al cargar el ranking", 3000);
        });
    })();
  }, []);
  return (
    <View>
      <ListTopRestaurants
        restaurants={restaurants}
        navigation={navigation}
      ></ListTopRestaurants>
      <Toast ref={toastRef} position="center" opacity={0.7}></Toast>
    </View>
  );
}
