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

      if(!response.ok || data.erro) {
        setErro('CEP não encontrado');
        return;
      }

      setCidade(data.localidade);
    } catch {
      setErro('Não foi possível buscar o CEP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <View style={styles.container}>
        <Text style={styles.titulo}>Busca por CEP</Text>
        <TextInput placeholder='Digite um CEP'
          value={cep}
          onChangeText={(value) => setCep(value)}
          style={styles.input} />
        <Pressable onPress={buscarCep} style={styles.botao}>
          <Text style={styles.textoBotao}>Consultar</Text>
        </Pressable>

        {!!cidade && <Text style={styles.resultado}>Cidade: {cidade}</Text>}
        {!!erro && <Text style={styles.erro}>{erro}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d0d0d0',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 18,
    marginBottom: 12
  },
  botao: {
    alignItems: 'center',
    backgroundColor: '#d0d0d0',
    borderRadius: 8,
    padding: 14
  },
  textoBotao: {
    color: "#000000",
    fontSize: 16,
    fontWeight: '700'
  },
  resultado: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center'
  },
  erro: {
    color: '#b91c1c',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center'
  }
});
