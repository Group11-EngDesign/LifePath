import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer } from 'react-navigation-stack';
import HomeScreen from '../screens/home';
import PhotoGallery from '../screens/photo_gallery';
import PhotoDetails from '../screens/photodetails';
import Login from '../screens/login';



const Stack = createStackNavigator();    

export const GalleryStack = () => {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PhotoGallery" component={PhotoGallery} />
        <Stack.Screen name="PhotoDetails" component={PhotoDetails} />
      </Stack.Navigator>
    );
  };
  
