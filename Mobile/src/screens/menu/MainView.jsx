import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity ,StyleSheet} from 'react-native';


function MainView() {
  const navigator = useNavigation();
  return (
    <View>
      <Text>Menu Main View</Text>
      <TouchableOpacity
      style = {styles.button} 
      onPress={()=>navigator.navigate("PaintView")}>
      </TouchableOpacity>
    </View>
  );
}
export default MainView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
        maxWidth: 300,
    },
    registerButton: {
        backgroundColor: '#34C759',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});