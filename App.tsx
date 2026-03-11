import { SafeAreaView, StyleSheet } from "react-native"
import { StatusBar } from "expo-status-bar"
import { JournalFormScreen } from "./src/screens/JournalFormScreen"

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <JournalFormScreen />
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})