

import axios from "axios"
import { Incident, ApiResponse } from "../types"

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
})

export const submitIncident = async (
  data: Incident
): Promise<ApiResponse<Incident>> => {

  try {

    const response = await api.post("/posts", data)

    console.log("Server response:", response.data)

    return {
      success: true,
      data: {
        ...data,
        id: response.data.id
      }
    }

  } catch (error: any) {

    return {
      success: false,
      error: error.message
    }

  }

}