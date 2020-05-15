import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {
  const { navigation } = props;
  const { idRestaurant, setReviewsReload } = navigation.state.params;
  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toasRef = useRef();

  const addReview = () => {
    setIsVisible(true);
    if (rating === null) {
      setIsVisible(false);
      toasRef.current.show("No has dado ninguna puntuacion");
    } else if (!title) {
      setIsVisible(false);
      toasRef.current.show("El titulo es obligatorio");
    } else if (!review) {
      setIsVisible(false);
      toasRef.current.show("El comentario es obligatorio");
    } else {
      //con esto sacamos el usuario que esta logeado
      const user = firebase.auth().currentUser;
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idRestaurant: idRestaurant,
        title: title,
        review: review,
        riting: rating,
        createAt: new Date(),
      };
      db.collection("reviews")
        .add(payload)
        .then(() => {
          updateRestaurant();
        })
        .catch(() => {
          setIsVisible(false);
          toasRef.current.show(
            "Error al enviar al review, intentelo mas tarde"
          );
        });
    }
  };

  const updateRestaurant = () => {
    const restaurantRef = db.collection("restaurants").doc(idRestaurant);

    restaurantRef.get().then((response) => {
      const restaurantData = response.data();
      const ratingTotal = restaurantData.ratingTotal + rating;
      const quantityVoting = restaurantData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      restaurantRef
        .update({
          riting: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then(() => {
          setIsVisible(false);
          setReviewsReload(true);
          navigation.goBack();
        });
    });
  };
  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count="5"
          reviews={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
          defaultRating={0}
          size={35}
          onFinishRating={(value) => setRating(value)}
        ></AirbnbRating>
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Titulo"
          containerStyle={styles.input}
          onChange={(e) => setTitle(e.nativeEvent.text)}
        ></Input>
        <Input
          placeholder="Comentario"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={(e) => setReview(e.nativeEvent.text)}
        ></Input>
        <Button
          title="Enviar Comentario"
          onPress={addReview}
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
        ></Button>
        <Toast ref={toasRef} position="center"></Toast>
        <Loading isVisible={isVisible} text="Enviando Comentario" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2",
  },
  formReview: {
    margin: 10,
    marginTop: 40,
    flex: 1,
    alignItems: "center",
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
