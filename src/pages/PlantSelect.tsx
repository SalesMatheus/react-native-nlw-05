import React, { useEffect, useState } from "react";
import { 
    StyleSheet,
    View,
    Text,
    FlatList,
    ActivityIndicator
} from "react-native";
import { useNavigation } from '@react-navigation/native';

import api from "../service/api";

import { Load } from "../components/Load";
import { Header } from "../components/Header";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { EnviromentButton } from "../components/EnviromentButton";
import { PlantProps } from "../libs/storage";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface EnviromentProps {
    key: string;
    title: string;
}

export function PlantSelect() {
    const [enviroment, setEnviroment] = useState<EnviromentProps[]>();
    const [plants, setPlants] = useState<PlantProps[]>();
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>();
    const [enviromentSelected, setEnviromentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigation = useNavigation<any>();

    function handleEnviromentSelected(enviroment: string){
        setEnviromentSelected(enviroment);

        if(enviroment == 'all')
            return setFilteredPlants(plants)

        const filtered = plants?.filter(plant =>
            plant.environments.includes(enviroment)
        );

        setFilteredPlants(filtered)
    }

    function handlePlantSelect(plant: PlantProps){
        navigation.navigate("PlantSave", { plant });
    }

    function handleFetchMore(distance: number){
        if(distance < 1)
            return;
        
        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchPlants();
    }

    async function fetchPlants(){
        const { data } = await api
        .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if(!data)
            return setLoading(true)

        if(page > 1){
            setPlants(oldValue => [...oldValue as [], ...data])
            setFilteredPlants(oldValue => [...oldValue as [], ...data])
        }else{
            setPlants(data);
            setFilteredPlants(data);
        }

        
        setLoading(false);
        setLoadingMore(false);
    }

    useEffect(() => {
        async function fetchEnviroment(){
            const { data } = await api.get('plants_environments?_sort=title&_order=asc');
            setEnviroment([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ])
        }

        fetchEnviroment();
        fetchPlants();
    },[]);

    if(loading)
        return <Load />

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
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => handleEnviromentSelected(item.key)}
                        />
                    )}
                />
            </View>
            
            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
                    ListFooterComponent={
                        loadingMore 
                        ? <ActivityIndicator color={colors.green}/> 
                        : <></>
                    }
                    renderItem={({ item }) => (
                        <PlantCardPrimary
                            data={item}
                            onPress={() => handlePlantSelect(item)}
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