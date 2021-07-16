import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { ConfirmButton } from "../components/ConfirmButton";
import { RegisterProgressBar } from "../components/RegisterProgressBar";

import googleWhite from "../assets/googleWhite.png";
import appleWhite from "../assets/appleWhite.png";
import facebookWhite from "../assets/facebookWhite.png";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export function RegisterStg1() {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  function handleEmailInputChange(value: string) {
    setEmail(value);
  }

  function handleUserNameInputChange(value: string) {
    setUserName(value);
  }

  async function handleConfirm() {
    if (!email || !userName) {
      return Alert.alert("Email ou Username inválido!");
    }

    try {
      await AsyncStorage.setItem("@risum:email", email);
      await AsyncStorage.setItem("@risum:user", userName);

      navigation.navigate("RegisterStg2");
    } catch {
      Alert.alert(
        "Não foi possível salvar o seu e-mail e/ou usuário, tente novamente mais tarde."
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <RegisterProgressBar position={25} />

        <View style={styles.heading}>
          <Text style={styles.title}>Email e{"\n"}Username</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="alekprincipebra@mail.com"
            placeholderTextColor={colors.lightText}
            style={styles.input}
            onChangeText={handleEmailInputChange}
          />
          <TextInput
            placeholder="RobertoMemeiro"
            placeholderTextColor={colors.lightText}
            style={styles.input}
            onChangeText={handleUserNameInputChange}
          />
        </View>
        <View style={styles.buttonBox}>
          <ConfirmButton title="Confirmar" onPress={handleConfirm} />
        </View>
        <View style={styles.orBox}>
          <Text style={styles.subtitle}>OU</Text>
        </View>

        <View style={styles.socialRegister}>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={googleWhite} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ marginLeft: "25%", marginRight: "25%" }}
          >
            <Image source={appleWhite} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={facebookWhite} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  heading: {
    textAlign: "left",
    width: "100%",
    marginTop: "-5%",
  },
  title: {
    fontFamily: fonts.heading,
    color: colors.white,
    fontSize: 27,
    lineHeight: 50,
  },
  subtitle: {
    fontFamily: fonts.heading,
    color: colors.white,
    fontSize: 20,
    lineHeight: 50,
  },
  form: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    width: "100%",
    marginTop: "-10%",
  },
  input: {
    height: 64,
    padding: 20,
    borderBottomWidth: 1,
    color: colors.white,
  },
  buttonBox: {
    width: "100%",
    marginTop: "-0%",
  },
  buttonText: {
    fontFamily: fonts.subtitle,
    fontSize: 16,
  },
  orBox: {
    marginTop: "-10%",
    marginBottom: "-10%",
  },
  socialRegister: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginBottom: "5%",
  },
  redAdvertisement: {
    color: colors.pastelRed,
    fontFamily: fonts.heading,
    fontSize: 10,
    marginTop: 4,
  },
});
