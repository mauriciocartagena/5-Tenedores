import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import Loading from "../components/Loading";
import Toast from "react-native-easy-toast";
//navifation events sirve para refresacar el view cuando cambie
import { NavigationEvents } from "react-navigation";

import { fireabseApp, firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
import Restaurants from "./Restaurants";
const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [restaurants, setResturants] = useState([]);
  const [reloadRestaurants, setReloadRestaurants] = useState(false);
  const [isVisbleLoading, setIsVisibleLoading] = useState(false);
  const toasRef = useRef();
  const [userLogged, setUserLogged] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    if (userLogged) {
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
    }
    setReloadRestaurants(false);
  }, [reloadRestaurants]);

  const getDataRestaurants = (idRestaurantArray) => {
    const arrayRestaurants = [];

    idRestaurantArray.forEach((idRestaurant) => {
      const result = db.collection("restaurants").doc(idRestaurant).get();
      arrayRestaurants.push(result);
    });
    return Promise.all(arrayRestaurants);
  };

  if (!userLogged) {
    return (
      <UserNotLogged
        setReloadRestaurants={setReloadRestaurants}
        navigation={navigation}
      ></UserNotLogged>
    );
  }

  if (restaurants.length === 0)
    return (
      <NotFounRestaurant
        setReloadRestaurants={setReloadRestaurants}
      ></NotFounRestaurant>
    );
  return (
    <View style={styles.viewBody}>
      <NavigationEvents
        onWillFocus={() => setReloadRestaurants(true)}
      ></NavigationEvents>
      {restaurants ? (
        <FlatList
          data={restaurants}
          renderItem={(restaurants) => (
            <Restaurant
              restaurant={restaurants}
              navigation={navigation}
              setIsVisibleLoading={setIsVisibleLoading}
              setReloadRestaurants={setReloadRestaurants}
              toasRef={toasRef}
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
      <Toast ref={toasRef} position="center" opacity={1}>
        <Loading
          text="Eliminando restaurante"
          isVisble={isVisbleLoading}
        ></Loading>
      </Toast>
    </View>
  );
}

function Restaurant(props) {
  const {
    restaurant,
    navigation,
    setIsVisibleLoading,
    setReloadRestaurants,
    toasRef,
  } = props;
  const { id, name, images } = restaurant.item;
  const [imageRestaurant, setImageRestaurant] = useState(null);
  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`restaurant-images/${image}`)
      .getDownloadURL()
      .then((response) => {
        setImageRestaurant(response);
      });
  }, []);
  const confirRemoveFavorite = () => {
    Alert.alert(
      "Eliminar restaurante de favoritos",
      "Estas seguro de que quieres eliminar el restaurante de favoritos ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            RemoveFavorite();
          },
        },
      ],
      { cancelable: false }
    );
  };
  const RemoveFavorite = () => {
    setIsVisibleLoading(true);
    db.collection("favorites")
      .where("idRestaurant", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsVisibleLoading(false);
              setReloadRestaurants(true);
              toasRef.current.show("Restaurante eliminado correctamente");
            })
            .catch(() => {
              toasRef.current.show(
                "Error al eliminar el restaurante intentelo mas tarde"
              );
            });
        });
      });
  };
  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Restaurant", { restaurant: restaurant.item })
        }
      >
        <Image
          resizeMode="cover"
          source={{ uri: imageRestaurant }}
          style={styles.image}
          PlaceholderContent={
            <ActivityIndicator color="#fff"></ActivityIndicator>
          }
        ></Image>
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Icon
          type="material-community"
          name="heart"
          color="#00a685"
          containerStyle={styles.favorite}
          onPress={() => confirRemoveFavorite()}
          size={40}
          underlayColor="transparent"
        ></Icon>
      </View>
    </View>
  );
}
function NotFounRestaurant(props) {
  const { setReloadRestaurants } = props;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <NavigationEvents
        onWillFocus={() => setReloadRestaurants(true)}
      ></NavigationEvents>
      <Icon type="material-community" name="alert-outline" size={50}></Icon>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No tienes Restaurantes en tu lista
      </Text>
    </View>
  );
}
function UserNotLogged(props) {
  const { setReloadRestaurants, navigation } = props;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <NavigationEvents
        onWillFocus={() => setReloadRestaurants(true)}
      ></NavigationEvents>
      <Icon type="material-community" name="alert-outline" size={50}></Icon>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Necesitas estar loggeado para ver esta sección.
      </Text>
      <Button
        title="Ir a Login"
        onPress={() => {
          navigation.navigate("Login");
        }}
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#00a680" }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  restaurant: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 100,
  },
});
