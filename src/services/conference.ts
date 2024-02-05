import http from "@/plugins/axios"

const createRoomService = async(roomName: string) => {
  try {
    const { data } = await http.post(`conference/room`, { roomName })
    return data || {}
  } catch(e) {
    console.error(e)
    throw e
  }
}

const joinRoomService = async(roomName: string, participantName: string) => {
  try {
    const { data } = await http.post(`conference/room/participant`, { roomName, participantName })
    return data || {}
  } catch(e) {
    console.error(e)
    throw e
  }
}

const subscribeRoomService = async(roomName: string, participantName: string, sdpOffer?: string) => {
  // /conference/room/test/participant/user1/subscribe?sdpOffer=aasdf
  try {
    const { data } = await http.post(`conference/room/subscribe`, { roomName, participantName, sdpOffer })
    return data || {}
  } catch(e) {
    console.error(e)
    throw e
  }
}

const closeRoomService = async(roomName: string) => {
  try {
    const { data } = await http.delete(`conference/room/${roomName}/close`)
    return data || {}
  } catch(e) {
    console.error(e)
    throw e
  }
}

export {
  createRoomService,
  joinRoomService,
  subscribeRoomService,
  closeRoomService
}
