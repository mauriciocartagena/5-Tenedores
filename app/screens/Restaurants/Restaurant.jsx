import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Text, Dimensions } from "react-native";
import { Rating, ListItem } from "react-native-elements";
import * as firebase from "firebase";
import CarouselImages from "../../components/Carousel";
import Map from "../../components/Map";
import ListReviews from "../../components/Restaurants/ListReviews";

const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation } = props;
  const { restaurant } = navigation.state.params.restaurant.item;
  const [imagesRestaurant, setImagesRestaurant] = useState([]);

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
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      ></RestaurantInfo>
      <ListReviews
        navigation={navigation}
        idRestaurant={restaurant.id}
      ></ListReviews>
    </ScrollView>
  );
}

function TittleRestaurant(props) {
  const { name, description, rating } = props;
  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        ></Rating>
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
}
function RestaurantInfo(props) {
  const { location, name, address } = props;

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
    },
    {
      text: "111 222 333",
      iconName: "phone",
      iconType: "material-community",
      action: null,
    },
    {
      text: "mc@gmail.com",
      iconName: "at",
      iconType: "material-community",
      action: null,
    },
  ];
  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Informacion sobre el restaurante
      </Text>
      <Map location={location} name={name} height={100}></Map>
      {listInfo.map((item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680",
          }}
          containerStyle={styles.containerListItem}
        ></ListItem>
      ))}
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
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey",
  },
  viewRestaurantInfo: {
    marginTop: 25,
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
});
