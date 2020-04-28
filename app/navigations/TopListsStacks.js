import { createStackNavigator } from "react-navigation-stack";
import TopRestaurants from "../screens/TopResturants";

const TopListStacks = createStackNavigator({
  TopRestaurants: {
    screen: TopRestaurants,
    navigationOptions: () => ({
      title: "Los mejores Restaurantes",
    }),
  },
});
export default TopListStacks;
