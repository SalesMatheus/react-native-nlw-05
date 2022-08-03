import React, { useEffect, useState } from "react";
import { 
    StyleSheet,
    View,
    Text,
    FlatList,
} from "react-native";
import { EnviromentButton } from "../components/EnviromentButton";

import { Header } from "../components/Header";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import api from "../service/api";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface EnviromentProps {
    key: string;
    title: string;
}
interface PlantsProps {
    id: 1;
      name:string;
      about: string;
      water_tips: string;
      photo: string;
      environments: [string];
      frequency: {
        times: number;
        repeat_every: string;
      }
}

export function PlantSelect() {
    const [enviroment, setEnviroment] = useState<EnviromentProps[]>();
    const [plants, setPlants] = useState<PlantsProps[]>();

    useEffect(() => {
        async function fetchEnviroment(){
            const { data } = await api.get('plants_environments');
            setEnviroment([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ])
        }

        fetchEnviroment();

    },[]);

    useEffect(() => {
        async function fetchPlants(){
            const { data } = await api.get('plants');
            setPlants(data)
        }

        fetchPlants();

    },[]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
            
                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subTitle}>
                    você quer colocar sua planta? 🤔
                </Text>
            </View>
            <View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                    data={enviroment}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                        />
                    )}
                />
            </View>
            
            <View style={styles.plants}>
                <FlatList
                    data={plants}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <PlantCardPrimary
                            data={item}
                        />
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15,
    },
    subTitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    enviromentList: {
        height: 40,
        justifyContent: "center",
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
    },
})