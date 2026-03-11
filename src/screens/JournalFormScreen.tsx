import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Vibration
} from "react-native"

import * as Calendar from "expo-calendar"

import { CameraCapture } from "../components/CameraCapture"
import { LocationMap } from "../components/LocationMap"

import { submitIncident } from "../services/api"
import { Incident, Coordinates } from "../types"

export const JournalFormScreen: React.FC = () => {

  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const addEventToCalendar = async () => {

    const { status } = await Calendar.requestCalendarPermissionsAsync()

    if (status !== "granted") return

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    )

    const calendarId = calendars[0].id

    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

    await Calendar.createEventAsync(calendarId, {
      title: "🔧 Suivi Intervention",
      notes: description,
      location: `${location?.latitude}, ${location?.longitude}`,
      startDate,
      endDate
    })
  }

  const handleSubmit = async () => {

    if (!photoUri || !location) {
      Alert.alert("Photo et position requises")
      return
    }

    setLoading(true)

    const incident: Incident = {
      description,
      photoUri,
      location,
      timestamp: Date.now()
    }

    try {

      const response = await submitIncident(incident)

      if (response.success) {

        await addEventToCalendar()

        Alert.alert("Incident enregistré")

        Vibration.vibrate(200)

        setPhotoUri(null)
        setLocation(null)
        setDescription("")
      }

    } catch {

      Alert.alert("Erreur réseau")

    }

    setLoading(false)

  }

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.header}>Field Reporting</Text>

      <Text style={styles.label}>Photo</Text>

      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.image} />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setPhotoUri(null)}
          >
            <Text style={styles.buttonText}>Reprendre</Text>
          </TouchableOpacity>
        </>
      ) : (
        <CameraCapture onPictureTaken={setPhotoUri} />
      )}

      <Text style={styles.label}>Localisation</Text>

      <LocationMap onLocationFound={setLocation} />

      <Text style={styles.label}>Description</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Décrire l'incident"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={[
          styles.button,
          (!photoUri || !location) && styles.disabled
        ]}
        disabled={!photoUri || !location || loading}
        onPress={handleSubmit}
      >

        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Envoyer</Text>
        )}

      </TouchableOpacity>

    </ScrollView>

  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20
  },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 10
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 100
  },

  button: {
    marginTop: 30,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center"
  },

  disabled: {
    backgroundColor: "#999"
  },

  secondaryButton: {
    marginTop: 10,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 6,
    alignItems: "center"
  },

  buttonText: {
    color: "white",
    fontWeight: "bold"
  }

})