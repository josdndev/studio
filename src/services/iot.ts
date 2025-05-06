/**
 * Represents vital signs data from an IoT device.
 */
export interface VitalSigns {
  /**
   * The patient's heart rate in beats per minute.
   */
  heartRate: number;
  /**
   * The patient's body temperature in Celsius.
   */
  temperatureCelsius: number;
  /**
   * The patient's blood oxygen saturation percentage.
   */
  oxygenSaturation: number;
}

/**
 * Asynchronously retrieves vital signs for a given patient ID.
 *
 * @param patientId The ID of the patient to retrieve vital signs for.
 * @returns A promise that resolves to a VitalSigns object containing heart rate, temperature and oxygen saturation.
 */
export async function getVitalSigns(patientId: string): Promise<VitalSigns> {
  // TODO: Implement this by calling an API.

  return {
    heartRate: 72,
    temperatureCelsius: 36.8,
    oxygenSaturation: 98,
  };
}
