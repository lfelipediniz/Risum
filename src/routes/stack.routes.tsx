import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import colors from "../styles/colors";
import { Welcome } from "../pages/Welcome";
import { RegisterStg1 } from "../pages/RegisterStg1";
import { RegisterStg2 } from "../pages/RegisterStg2";
import { RegisterStg3 } from "../pages/RegisterStg3";
import { Feed } from "../pages/Feed";
import { Login } from "../pages/Login";

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
  <stackRoutes.Navigator
    headerMode="none"
    screenOptions={{
      cardStyle: {
        backgroundColor: colors.background,
      },
    }}
  >
    <stackRoutes.Screen name="Welcome" component={Welcome} />
    <stackRoutes.Screen name="Login" component={Login} />
    <stackRoutes.Screen name="RegisterStg1" component={RegisterStg1} />
    <stackRoutes.Screen name="RegisterStg2" component={RegisterStg2} />
    <stackRoutes.Screen name="RegisterStg3" component={RegisterStg3} />
    <stackRoutes.Screen name="Feed" component={Feed} />
  </stackRoutes.Navigator>
);

export default AppRoutes;
