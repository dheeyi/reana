import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import ButtonLogin from '../../Components/login/Button';
import TextInputLogin from '../../Components/login/TextInput';
import LogoLogin from '../../Components/login/Logo';
import EmailTextField from '../../Components/login/EmailTextField';
import SwitchField from '../../Components/login/SwitchField';
import DismissKeyboard from '../../Components/login/DismissKeyboard';
import FirebasePlugin from '../../Plugins/firebase/Firebase';

import Utils from '../../utils/utils';
import Images from '../../Config/Images';
import Constants from '../../Config/Constants';
import Colors from '../../Config/Colors';

const LoginScreen = ({navigation, route}) => {
  const [loginRegister, setLoginRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @name _toggleSwitch
   * @desc sets switch value
   * @private
   */
  const _toggleSwitch = () => {
    setLoginRegister(!loginRegister);
  };

  /**
   * @name _getTextSwitch
   * @desc gets correct title
   * @returns {string}
   * @private
   */
  const _getTextSwitch = () => {
    return loginRegister
      ? Constants.STRING.BUT_LOGIN
      : Constants.STRING.REGISTER;
  };

  /**
   * @name _validateEmailAddress
   * @returns {boolean}
   * @private
   */
  const _validateEmailAddress = () => {
    let isValidEmail = Utils.isValidEmail(email);
    isValidEmail
      ? setErrorEmail('')
      : setErrorEmail(Constants.STRING.EMAIL_ERROR);
    return isValidEmail;
  };

  /**
   * @name _validatePassword
   * @returns {boolean}
   * @private
   */
  const _validatePassword = () => {
    let isValidPassword = Utils.isValidField(password);
    isValidPassword
      ? setErrorPassword('')
      : setErrorPassword(Constants.STRING.PASSWORD_ERROR);
    return isValidPassword;
  };

  /**
   * @name _onPressLogin
   * @desc onPres event
   * @private
   */
  const _onPressLogin = () => {
    let emailData = _validateEmailAddress();
    let passwordData = _validatePassword();
    let execFn = loginRegister ? loginApp : registerApp;

    if (emailData && passwordData) {
      execFn(email, password);
    } else {
      Alert.alert(Constants.STRING.EMPTY_TITLE, Constants.STRING.EMPTY_VALUES);
    }
  };

  /**
   * @name loginApp
   * @param {string} email
   * @param {string} password
   */
  const loginApp = (email, password) => {
    try {
      setIsLoading(true);
      FirebasePlugin.auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          setIsLoading(false);
          route.params.route.params.setIsLogged(true);
        })
        .catch((error) => {
          setIsLoading(false);
          Alert.alert('Invalid Values', error.message);
        });
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Firebase Error', error.message);
    }
  };

  /**
   * @desc register app
   * @param {string} email
   * @param {string} password
   */
  const registerApp = (email, password) => {
    try {
      setIsLoading(true);
      FirebasePlugin.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          setIsLoading(false);
          Alert.alert('Register Form', 'Registered user', [
            {
              text: 'Ok',
              onPress: () => {
                setIsLoading(false);
                route.params.route.params.setIsLogged(true);
              },
            },
          ]);
        })
        .catch((error) => {
          setIsLoading(false);
          Alert.alert('Invalid Values', error.message);
        });
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Invalid Values', error.message);
    }
  };

  return (
    <DismissKeyboard>
      <KeyboardAvoidingView
        style={stylesLoginScreen.container}
        behavior="height"
        enabled>
        <View style={stylesLoginScreen.container}>
          <SafeAreaView>
            <LogoLogin style={stylesLoginScreen.logo} />
            <View style={stylesLoginScreen.form}>
              <SwitchField
                isEnabled={loginRegister}
                toggleSwitch={_toggleSwitch}
                text={_getTextSwitch()}
              />
              <EmailTextField
                onChangeText={(email) => {
                  setEmail(email);
                }}
                onEndEditing={_validateEmailAddress}
                error={errorEmail}
                source={Images.EMAIL}
                placeholder={Constants.STRING.EMAIL}
                secureTextEntry={false}
                autoCorrect={false}
              />
              <TextInputLogin
                onChangeText={(password) => {
                  setPassword(password);
                }}
                onEndEditing={_validatePassword}
                error={errorPassword}
                source={Images.USERNAME}
                placeholder={Constants.STRING.PASSWORD}
                secureTextEntry={true}
                autoCorrect={false}
              />
              <View style={stylesLoginScreen.buttonSpace}>
                <ButtonLogin
                  isLoading={isLoading}
                  onPress={_onPressLogin}
                  titleButton={_getTextSwitch()}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
};

const stylesLoginScreen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  form: {
    justifyContent: 'center',
    width: '80%',
    marginBottom: 20,
  },
  buttonSpace: {
    marginBottom: 10,
  },
});

export default LoginScreen;
