import { create } from "zustand"
export const useStore = create(() => ({
  waterLevel: 0.9,
  waveSpeed: 1.2,
  waveAmplitude: 0.1,
  foamDepth: 0.05,
}))