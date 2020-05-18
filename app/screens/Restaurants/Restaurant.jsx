import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, View, Text, Dimensions } from "react-native";
import { Rating, ListItem, Icon } from "react-native-elements";
import CarouselImages from "../../components/Carousel";
import Map from "../../components/Map";
import ListReviews from "../../components/Restaurants/ListReviews";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../../utils/FireBase";
import firebase, { auth } from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation } = props;
  const { restaurant } = navigation.state.params.restaurant.item;
  const [imagesRestaurant, setImagesRestaurant] = useState([]);
  const [rating, setRating] = useState(restaurant.riting);
  const [isFavorite, setIsFavorite] = useState(false);
  const toastRef = useRef();

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

  useEffect(() => {
    db.collection("favorites")
      .where("idRestaurant", "==", restaurant.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        if (response.docs.length === 1) {
          setIsFavorite(true);
        }
      });
  }, []);

  const addFavorite = () => {
    const payload = {
      idUser: firebase.auth().currentUser.uid,
      idRestaurant: restaurant.id,
    };
    db.collection("favorites")
      .add(payload)
      .then(() => {
        setIsFavorite(true);
        toastRef.current.show("Restaurante añadido a la lista de favoritos");
      })
      .catch(() => {
        toastRef.current.show(
          "Error al añadir el restaurante a la lista de favoritos, intentelo mas tarde"
        );
      });
  };
  const removeFavorite = () => {
    db.collection("favorites")
      .where("idRestaurant", "==", restaurant.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show(
                "Restaurante eliminado de la lista de favoritos correctamente"
              );
            })
            .catch(() => {
              toastRef.current.show(
                "No se pudo eliminar el restaurante de la lista de favoritos intentelo mas tarde"
              );
            });
        });
      });
  };
  return (
    <ScrollView style={StyleSheet.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#00a680" : "#000"}
          size={35}
          underlayColor="transparent"
        ></Icon>
      </View>
      <Text>PAGINA DE RESTAURANTE</Text>
      <CarouselImages
        arrayImages={imagesRestaurant}
        width={screenWidth}
        height={200}
      ></CarouselImages>
      <TittleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={rating}
      ></TittleRestaurant>
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      ></RestaurantInfo>
      <ListReviews
        navigation={navigation}
        idRestaurant={restaurant.id}
        setRating={setRating}
      ></ListReviews>
      <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
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
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 5,
  },
});
