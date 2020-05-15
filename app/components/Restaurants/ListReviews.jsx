import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";
import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase";
import "firebase/firestore";
import { Value } from "react-native-reanimated";
const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
  const { navigation, idRestaurant, setRating } = props;
  const [reviews, setReviews] = useState([]);
  const [reviewsReload, setReviewsReload] = useState(false);

  useEffect(() => {
    ((async) => {
      const resultReviews = [];
      const arrayRating = [];

      db.collection("reviews")
        .where("idRestaurant", "==", idRestaurant)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            resultReviews.push(doc.data());
            arrayRating.push(doc.data().riting);
          });

          let numSum = 0;
          arrayRating.map((value) => {
            numSum = numSum + value;
          });
          const countRating = arrayRating.length;
          const resultRating = numSum / countRating;
          const resultRatingFinish = resultRating ? resultRating : 0;

          setReviews(resultReviews);
          setRating(resultRatingFinish);
        });
      setReviewsReload(false);
    })();
  }, [reviewsReload]);
  return (
    <View>
      <Button
        buttonStyle={styles.btnAddReview}
        titleStyle={styles.btnTitleAddReview}
        title="Escribir una Opinion"
        icon={{
          type: "material-community",
          name: "square-edit-outline",
          color: "#00a680",
        }}
        onPress={() =>
          navigation.navigate("AddReviewRestaurant", {
            idRestaurant: idRestaurant,
            setReviewsReload: setReviewsReload,
          })
        }
      ></Button>
      <Text>lista de Comentarios</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleAddReview: {
    color: "#00a680",
  },
});
