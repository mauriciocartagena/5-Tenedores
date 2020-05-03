import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

export default function LoginFacebook(props) {
  const { toastRef, navigation } = props;
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    await Facebook.initializeAsync(FacebookApi.application_id);
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: FacebookApi.permissions,
    });

    if (type == "success") {
      setIsLoading(true);
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      await firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          navigation.navigate("MyAccount");
        })
        .catch(() => {
          toastRef.current.show(
            "Erro accediendo con facebook ,intentelo mas tarde"
          );
        });
    } else if (type == "cancel") {
      toastRef.current.show("Inicio de session cancelado");
    } else {
      toastRef.current.show("Error desconocido intente mas tarde");
    }
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <SocialIcon
        title="Iniciar session con facebook"
        type="facebook"
        button
        onPress={login}
      ></SocialIcon>
      <Loading isVisible={isLoading} text="Iniciando Sessión" />
    </React.Fragment>
  );
}
