import React, { useRef } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"

interface Props {
  onPictureTaken: (uri: string) => void
}

export const CameraCapture: React.FC<Props> = ({ onPictureTaken }) => {

  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<CameraView>(null)

  if (!permission?.granted) {
    requestPermission()
    return <View />
  }

  const takePicture = async () => {

    if (cameraRef.current) {

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5
      })

      if (photo?.uri) {
        onPictureTaken(photo.uri)
      }

    }

  }

  return (
    <View style={styles.container}>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
      />

      <TouchableOpacity
        style={styles.captureButton}
        onPress={takePicture}
      />

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    height: 250,
    borderRadius: 10,
    overflow: "hidden"
  },

  camera: {
    flex: 1
  },

  captureButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white"
  }

})