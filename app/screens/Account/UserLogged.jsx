import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase";
export default function UserLogged() {
  return (
    <View>
      <Text>User logged ....</Text>
      <Button
        title="Cerrar Session"
        onPress={() => firebase.auth().signOut()}
      ></Button>
    </View>
  );
}
