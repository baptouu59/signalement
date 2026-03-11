import React, { useEffect, useState } from "react"
import { View, ActivityIndicator, Text, StyleSheet } from "react-native"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"

import { Coordinates } from "../types"

interface Props {
  onLocationFound: (coords: Coordinates) => void
}

export const LocationMap: React.FC<Props> = ({ onLocationFound }) => {

  const [location, setLocation] = useState<Coordinates | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {

    const getLocation = async () => {

      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== "granted") {
        setErrorMsg("Permission localisation refusée")
        return
      }

      const pos = await Location.getCurrentPositionAsync({})

      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }

      setLocation(coords)

      onLocationFound(coords)

    }

    getLocation()

  }, [])

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    )
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (

    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      }}
    >

      <Marker coordinate={location} />

    </MapView>

  )
}

const styles = StyleSheet.create({

  map: {
    width: "100%",
    height: 250,
    borderRadius: 10
  },

  center: {
    height: 250,
    justifyContent: "center",
    alignItems: "center"
  }

})