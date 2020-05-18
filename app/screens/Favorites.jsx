import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { fireabseApp, firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
import Restaurants from "./Restaurants";
const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [restaurants, setResturants] = useState([]);

  useEffect(() => {
    const idUser = firebase.auth().currentUser.uid;
    db.collection("favorites")
      .where("idUser", "==", idUser)
      .get()
      .then((response) => {
        const idResraurantsArray = [];

        response.forEach((doc) => {
          idResraurantsArray.push(doc.data().idRestaurant);
        });
        getDataRestaurants(idResraurantsArray).then((response) => {
          const restaurants = [];

          response.forEach((doc) => {
            let restaurant = doc.data();
            restaurant.id = doc.id;
            restaurants.push(restaurant);
          });
          setResturants(restaurants);
        });
      });
  }, []);

  const getDataRestaurants = (idRestaurantArray) => {
    const arrayRestaurants = [];

    idRestaurantArray.forEach((idRestaurant) => {
      const result = db.collection("restaurants").doc(idRestaurant).get();
      arrayRestaurants.push(result);
    });
    return Promise.all(arrayRestaurants);
  };

  return (
    <View>
      {restaurants ? (
        <FlatList
          data={restaurants}
          renderItem={(restaurants) => (
            <Restaurant
              restaurant={restaurants}
              navigation={navigation}
            ></Restaurant>
          )}
          keyExtractor={(item, index) => index.toString()}
        ></FlatList>
      ) : (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large">
            <Text>Cargando restaurantes</Text>
          </ActivityIndicator>
        </View>
      )}
    </View>
  );
}

function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { name } = restaurant.item;
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
  },
});
