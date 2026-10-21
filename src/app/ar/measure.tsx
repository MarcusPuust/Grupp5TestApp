import { Stack } from "expo-router"

import MeasurementExperience from "@/components/ar/measurement-experience"

export default function MeasureScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "AR-mõõdulint", headerTitle: "AR-mõõdulint", headerBackVisible: true, headerLeft: () => null }} />
      <MeasurementExperience />
    </>
  )
}
