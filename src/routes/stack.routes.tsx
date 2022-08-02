import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';

import { Welcome } from "../pages/Welcome";
import { UserIdentification } from "../pages/UserIdentification";
import { Confirmation } from "../pages/Confirmation";
import colors from "../styles/colors";

const stackRoutes = createNativeStackNavigator();

export function AppRoutes(){
    return(
        <NavigationContainer independent={true}>
            <stackRoutes.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: colors.white
                    },
                }}
            >
                <stackRoutes.Screen
                    name="Welcome"
                    component={Welcome}
                />
                <stackRoutes.Screen
                    name="UserIdentification"
                    component={UserIdentification}
                />
                <stackRoutes.Screen
                    name="Confirmation"
                    component={Confirmation}
                />
            </stackRoutes.Navigator>
        </NavigationContainer>
    )
}