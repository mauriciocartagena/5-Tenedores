import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import * as firebase from "firebase";
// import Restaurants from "../../screens/Restaurants/Restaurants";

export default function ListRestaurant(props) {
  const { restaurants, isLoading, handleLoadMore } = props;
  return (
    <View>
      {restaurants ? (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => <Restaurant restaurant={restaurant} />}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={<FooterList isLoading={isLoading}></FooterList>}
        />
      ) : (
        <View styles={styles.loaderRestaurants}>
          <ActivityIndicator size="large">
            <Text>Cargando Contenido</Text>
          </ActivityIndicator>
        </View>
      )}
    </View>
  );
}
function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loadingRestaurants}>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundRestaurants}>
        <Text>No quedan restaurant por cargar</Text>
      </View>
    );
  }
}
function Restaurant(props) {
  const { restaurant } = props;
  const { name, address, description, images } = restaurant.item.restaurant;
  const [imageRestaurant, setImageRestaurant] = useState(null);

  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`restaurant-images/${image}`)
      .getDownloadURL()
      .then((result) => {
        setImageRestaurant(result);
      })
      .catch((err) => console.log(err));
  });

  return (
    <TouchableOpacity onPress={() => console.log("Ir al restaurante.")}>
      <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
          <Image
            resizeMode="cover"
            source={{ uri: imageRestaurant }}
            style={styles.imageRestaurant}
            PlaceholderContent={
              <ActivityIndicator color="#fff"></ActivityIndicator>
            }
          ></Image>
        </View>
        <View>
          <Text style={styles.restaurantName}> {name} </Text>
          <Text style={styles.restaurantAddress}> {address} </Text>
          <Text styles={styles.restaurantDescription}>
            {description.substr(0, 60)}...{" "}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingRestaurants: {
    marginTop: 20,
    alignItems: "center",
  },
  viewRestaurant: {
    flexDirection: "row",
    margin: 10,
  },
  viewRestaurantImage: {
    marginRight: 15,
  },
  imageRestaurant: {
    width: 80,
    height: 80,
  },
  restaurantName: {
    fontWeight: "bold",
  },
  restaurantAddress: {
    paddingTop: 2,
    color: "grey",
  },
  restaurantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
  },
  notFoundRestaurants: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
