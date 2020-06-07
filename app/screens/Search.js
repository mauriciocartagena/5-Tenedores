import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Image, Text } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import { useDebouncedCallback } from "use-debounce";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    onSearch();
  }, [search]);
  const [onSearch] = useDebouncedCallback(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM restaurants WHERE name LIKE '${search}'`)
        .then((response) => {
          setRestaurants(response);
        });
    }
  }, 300);

  return (
    <View>
      <SearchBar
        placeholder="Busca tu restaurante"
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      ></SearchBar>
      {restaurants.length === 0 ? (
        <NoFoundRestaurants></NoFoundRestaurants>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={(restaurants) => (
            <Restauarant
              restaurants={restaurants}
              navigation={navigation}
            ></Restauarant>
          )}
          keyExtractor={(item, index) => index.toString()}
        ></FlatList>
      )}
    </View>
  );
}
function Restauarant(props) {
  const { restaurants, navigation } = props;

  const { name, images } = restaurants.item;
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

  return (
    <ListItem
      title={name}
      leftAvatar={{ source: { uri: imageRestaurant } }}
      rightIcon={<Icon type="material-community" name="chevron-right"></Icon>}
      onPress={() => {
        navigation.navigate("Restaurant", { restaurant: restaurants.item });
      }}
    ></ListItem>
  );
}
function NoFoundRestaurants() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      ></Image>
    </View>
  );
}
const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
  },
});
