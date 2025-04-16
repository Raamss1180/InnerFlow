import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontType } from '../theme';

const SearchBar = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={colors.textDark} />
            <TextInput 
                style={styles.input} 
                placeholder="Cari latihan meditasi..." 
                placeholderTextColor={colors.textDark}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 40,
        marginVertical: 15,
        elevation: 3,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: fontType.regular, 
        color: colors.textDark,
    },
});

export default SearchBar;
