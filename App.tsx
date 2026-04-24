import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Keyboard } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ViaCepResponse } from './types/via-cep-response';
import { use, useState } from 'react';

export default function App() {
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function buscarCep() {
    const cepLimpo = cep.replace(/\D/g, '');

    if(cepLimpo.length !== 8) {
      setCidade('');
      setErro('Digite um CEP válido');
      return;
    }

    try {
      Keyboard.dismiss();
      setLoading(true);
      setErro('');
      setCidade('');

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = (await response.json()) as ViaCepResponse;
    } catch {

    }
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <Text>Busca por CEP</Text>
        <TextInput placeholder='Digite um CEP' />
        <Pressable>
          <Text>Consultar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
