import React from "react";
import { StyleSheet, ScrollView, Image, View, Text } from "react-native";
import { Button } from "react-native-elements";
import { withNavigation } from "react-navigation";
function UserGuest(props) {
  const { navigation } = props;
  return (
    <ScrollView style={styles.viewBody} centerContent={true}>
      <Image
        source={require("../../../assets/img/user-guest.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Consulta tu perfil de 5 tenedores</Text>
      <Text style={styles.description}>
        Como Describirias tu mejor restaurante ? Buscar y visualiza los mejores
        Resturantes de una forma sencilla,vota cual te ha gustado mas y comenta
        como ha sido tu esperiencia
      </Text>
      <View style={styles.viewBtn}>
        <Button
          buttonStyle={styles.btStyle}
          containerStyle={styles.btnContainer}
          title="Ver tu Perfil"
          onPress={() => navigation.navigate("Login")}
        ></Button>
      </View>
    </ScrollView>
  );
}

export default withNavigation(UserGuest);

const styles = StyleSheet.create({
  viewBody: {
    marginRight: 30,
    marginLeft: 30,
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 40,
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  viewBtn: {
    flex: 1,
    alignItems: "center",
  },
  btStyle: {
    backgroundColor: "#00a680",
  },
  btnContainer: {
    width: "70%",
  },
});
