import { createStackNavigator } from "react-navigation-stack";
import FavoritesScreen from "../screens/Favorites";
import Favorites from "../screens/Favorites";
const FavoritesScreenStack = createStackNavigator({
  favorites: {
    screen: FavoritesScreen,
    navigationOptions: () => ({
      title: "Resturante Favorites",
    }),
  },
});

export default FavoritesScreenStack;
