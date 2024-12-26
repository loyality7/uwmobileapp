import Reactotron from 'reactotron-react-native';
import apisaucePlugin from 'reactotron-apisauce';

export default Reactotron.configure()
    .useReactNative()
    .use(apisaucePlugin())
    .connect();

