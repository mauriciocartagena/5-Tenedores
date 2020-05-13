import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Text, Dimensions } from "react-native";
import { Rating } from "react-native-elements";
import * as firebase from "firebase";
import CarouselImages from "../../components/Carousel";

const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation } = props;
  const { restaurant } = navigation.state.params.restaurant.item;
  const [imagesRestaurant, setImagesRestaurant] = useState([]);
  console.log(restaurant);

  useEffect(() => {
    const arrayUrls = [];
    (async () => {
      await Promise.all(
        restaurant.images.map(async (idImage) => {
          await firebase
            .storage()
            .ref(`restaurant-images/${idImage}`)
            .getDownloadURL()
            .then((imageUrl) => {
              arrayUrls.push(imageUrl);
            });
        })
      );
      setImagesRestaurant(arrayUrls);
    })();
  }, []);
  return (
    <ScrollView style={StyleSheet.viewBody}>
      <Text>PAGINA DE RESTAURANTE</Text>
      <CarouselImages
        arrayImages={imagesRestaurant}
        width={screenWidth}
        height={200}
      ></CarouselImages>
      <TittleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={restaurant.riting}
      ></TittleRestaurant>
    </ScrollView>
  );
}

function TittleRestaurant(props) {
  const { name, description, riting } = props;

  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(riting)}
        ></Rating>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRestaurantTitle: {
    margin: 15,
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
});
