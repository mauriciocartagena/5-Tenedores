import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import ActionButton from "react-native-action-button";
import ListRestaurants from "../../components/Restaurants/ListRestaurants";

//Crear para fireStore
import { firebaseApp } from ".././../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);

  const [restaurant, setRestaurant] = useState([]);
  const [startRestaurants, setStartRestaurants] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRestaurant, setTotalRestaurant] = useState(0);
  const limitRestaurants = 8;
  const [isReloadRestaurants, setIsReloadRestaurants] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useEffect(() => {
    db.collection("restaurants")
      .get()
      .then((snap) => {
        setTotalRestaurant(snap.size);
      });

    (async () => {
      const resultRestaurants = [];

      const restaurant = db
        .collection("restaurants")
        .orderBy("createAt", "desc")
        .limit(limitRestaurants);

      await restaurant.get().then((response) => {
        setStartRestaurants(response.docs[response.docs.length - 1]);

        response.forEach((doc) => {
          let restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurants.push({ restaurant });
        });
        setRestaurant(resultRestaurants);
      });
    })();
    setIsReloadRestaurants(false);
  }, [isReloadRestaurants]);

  const handleLoadMore = async () => {
    const resultRestaurants = [];

    restaurant.length < totalRestaurant && setIsLoading(true);

    const restaurantsDb = db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurants.data().createAt)
      .limit(limitRestaurants);

    await restaurantsDb
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartRestaurants(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }
        response.forEach((doc) => {
          let restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurants.push({ restaurant });
        });

        setRestaurant([...restaurant, ...resultRestaurants]);
      })
      .catch((e) => console.log(e));
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        restaurants={restaurant}
        isLoading={isLoading}
        handleLoadMore={handleLoadMore}
        navigation={navigation}
      ></ListRestaurants>
      {user && (
        <AddRestaurantButton
          navigation={navigation}
          setIsReloadRestaurants={setIsReloadRestaurants}
        ></AddRestaurantButton>
      )}
    </View>
  );
}

function AddRestaurantButton(props) {
  const { navigation, setIsReloadRestaurants } = props;

  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() =>
        navigation.navigate("AddRestaurant", { setIsReloadRestaurants })
      }
    ></ActionButton>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
});
