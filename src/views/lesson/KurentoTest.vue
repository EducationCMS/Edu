<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"

const METHOD_CREATE_NEW_SESSION = "METHOD_CREATE_NEW_SESSION"
const METHOD_CREATE_MEDIA_PIPELINE = "METHOD_CREATE_MEDIA_PIPELINE"
const METHOD_CREATE_WEB_RTC_ENDPOINT = "METHOD_CREATE_WEB_RTC_ENDPOINT"
const METHOD_INVOKE_CONNECT = "METHOD_INVOKE_CONNECT"
const METHOD_INVOKE_PROCESS_OFFER = "METHOD_INVOKE_PROCESS_OFFER"
const METHOD_INVOKE_PROCESS_ANSWER = "METHOD_INVOKE_PROCESS_ANSWER"
const METHOD_INVOKE_GATHER_CANDIDATES = "METHOD_INVOKE_GATHER_CANDIDATES"
const METHOD_ON_ICECANDIDATE = "METHOD_ON_ICECANDIDATE"
const METHOD_INVOKE_ADD_ICECANDIDATE = "METHOD_INVOKE_ADD_ICECANDIDATE"
const METHOD_SUBSCRIBE = "METHOD_SUBSCRIBE"

const PARTICIPANT_MAIN_CLASS = "participant main"
const PARTICIPANT_CLASS = "participant"

interface IParticipant {
  name: string,
  videoId: string,
  rtcPeer?: RTCPeerConnection
}

const ON_EXISTING_PARTICIPANTS = "existingParticipants"
const ON_NEW_PARTICIPANT_ARRIVED = "newParticipantArrived"
const ON_PARTICIPANT_LEFT = "participantLeft"
const ON_RECEIVE_VIDEO_ANSWER = "receiveVideoAnswer"
const ON_ICE_CANDIDATE = "iceCandidate"

const sessionId = ref("")
const pipelineId = ref("")
const mediaId = ref("")
const roomName = ref("")
const webSocket = ref()
const webRTCPeer = ref<RTCPeerConnection>()
const localStream = ref()
const localVideoRef = ref()
const remoteVideoRef = ref()
const participants = ref<IParticipant[]>([])
const participantName = ref((Math.random() + 1).toString(36).substring(7))

const sendMessage = (id: string|number, rest: object) => {
  webSocket.value?.send(JSON.stringify({ id, ...rest }))
  // webSocket.value?.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }))
}

// manager@bilim-lab.kz - e0F0cIp8YtVDKDSuGUs9

const generateSDPOffer = async() => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  localStream.value = stream
  for(const track of stream.getTracks()) {
    webRTCPeer.value?.addTrack(track, stream)
  }
  localVideoRef.value.srcObject = stream

  const offer = await webRTCPeer.value?.createOffer()
  await webRTCPeer.value?.setLocalDescription(offer)
  return offer?.sdp
}

const onIceCandidate = (event: RTCPeerConnectionIceEvent, name: string) => {
  const candidate = event.candidate
  const message = { candidate, name }
  if(candidate) sendMessage("ON_ICE_CANDIDATE", message)
}

const startCall = async() => {
  // const options = {
  //   localVideo: localVideoRef.value?.srcObject,
  //   remoteVideo: remoteVideoRef.value?.srcObject,
  //   mediaConstraints: videoConstraints
  // }
  // const room = await createRoomService(roomName.value)
  // sessionId.value = room.sessionId
  // pipelineId.value = room.mediaPipelineId
  sendMessage("JOIN_ROOM", {
    room: roomName.value,
    name: participantName.value
  })
}

const receiveVideo = (name: string) => {
  const participant: IParticipant = {
    name,
    videoId: `video@${name}`
  }

  participants.value = [...participants.value, participant]

  participant.rtcPeer = new RTCPeerConnection({
    iceServers: [{
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302"
      ]
    }]
  })
  participant.rtcPeer.addTransceiver("audio", {
    direction: "recvonly"
  })
  participant.rtcPeer.addTransceiver("video", {
    direction: "recvonly"
  })

  generateOffer(participant.rtcPeer)
    .then((offer) => {
      if(offer) offerToReceiveVideo(name, offer)
    })
}

const offerToReceiveVideo = (name: string, sdpOffer: string) => {
  sendMessage("RECEIVE_VIDEO_FROM", {
    sender: name,
    sdpOffer
  })
}

const setRemoteVideo = (pc: RTCPeerConnection, videoId: string) => {
  // const stream = new MediaStream();
  // for(const sender of pc.getReceivers()) {
  //   stream.addTrack(sender.track);
  // }
  const stream = getRemoteStreams(pc)[0]
  const video = document.getElementById(videoId) as HTMLVideoElement
  video.srcObject = stream
  video.play()
}

const generateOffer = async(pc: RTCPeerConnection) => {
  try {
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    return pc.localDescription?.sdp
  } catch(e) {
    return false
  }
}

const getMedia = async(pc: RTCPeerConnection, videoId: string, name: string) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 480,
      height: 320,
      frameRate: 30
    }, audio: false
  })
  const video = document.getElementById(videoId) as HTMLVideoElement
  video.srcObject = stream

  for(const track of stream.getTracks()) {
    pc.addTrack(track, stream)
  }

  pc.addEventListener("icecandidate", (event: RTCPeerConnectionIceEvent) => onIceCandidate(event, name))
}

const processAnswer = (pc: RTCPeerConnection, sdpAnswer: string, videoId: string) => {
  const answer = new RTCSessionDescription({
    type: "answer",
    sdp: sdpAnswer
  })

  pc.setRemoteDescription(answer).then(() => {
    if(`video@${participantName.value}` !== videoId) setRemoteVideo(pc, videoId)
  })
}

async function onExistingParticipants(msg) {
  const participant: IParticipant = {
    name: participantName.value,
    videoId: `video@${participantName.value}`
  }

  participants.value = [...participants.value, participant]

  participant.rtcPeer = new RTCPeerConnection({
    iceServers: [{
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302"
      ]
    }]
  })

  participant.rtcPeer.getTransceivers().forEach(function(transceiver) {
    transceiver.direction = "sendonly"
  })

  participant.rtcPeer?.addEventListener("icecandidate", (event: RTCPeerConnectionIceEvent) => onIceCandidate(event, participant.name))
  // participant.rtcPeer.getTransceivers().forEach(function (transceiver) {
  //   transceiver.direction = "sendonly";
  // });

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 480,
      height: 320,
      frameRate: 30
    }, audio: false
  })
  const video = document.getElementById(participant.videoId) as HTMLVideoElement
  video.srcObject = stream

  for(const track of stream.getTracks()) {
    participant.rtcPeer.addTrack(track, stream)
  }

  // participant.rtcPeer?.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent) => onIceCandidate(event, participant.name))

  // getMedia(participant.rtcPeer, participant.videoId, participant.name)
  // participant.rtcPeer.addEventListener('track', (event: RTCTrackEvent) => {
  //   console.log(event)
  // })

  await generateOffer(participant.rtcPeer)
  // if(offer) offerToReceiveVideo(participant.name, offer)
  //   .then((offer) => {
  //     if(offer) offerToReceiveVideo(participant.name, offer)
  //   })

  for(const item of msg.data) {
    receiveVideo(item)
  }
}

const onNewParticipant = (name: string) => {
  receiveVideo(name)
}

const receiveVideoResponse = (result: { name: string, sdpAnswer: string }) => {
  const participant = participants.value.find((participant) => participant.name === result.name)
  const pc = participant?.rtcPeer
  // pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => onIceCandidate(event, result.name)
  if(pc) processAnswer(pc, result.sdpAnswer, participant?.videoId)
}

const getRemoteStreams = (pc: RTCPeerConnection) => {
  if(pc.getReceivers()) {
    const stream = new MediaStream()
    pc.getReceivers().forEach(function(sender) {
      console.log(sender)
      stream.addTrack(sender.track)
    })
    return [stream]
  }
}

const onIceCandidateFound = (name: string, candidate: RTCIceCandidate) => {
  const participant = participants.value.find((participant) => participant.name === name)
  participant?.rtcPeer?.addIceCandidate(new RTCIceCandidate(candidate))
}

const onParticipantLeft = (name: string) => {
  const participant = participants.value.find((participant) => participant.name === name)
  participant?.rtcPeer?.dispose()
  participants.value = participants.value.filter((participant) => participant.name === name)
}

onMounted(async() => {
  webSocket.value = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)
  // webRTCPeer.value = new RTCPeerConnection({
  //   iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  // })
  //
  // webRTCPeer.value?.addEventListener("track", (event) => {
  //   console.log('--- STREAMS', event.streams)
  //   remoteVideoRef.value.srcObject = event.streams?.[0]
  //   // const participantId = participant.id;
  //   // const mediaElement = mediaElements.value[participantId];
  //   // mediaElement.srcObject = event.streams[0];
  // })
  //
  // webRTCPeer.value?.addEventListener("icecandidate", (event: RTCPeerConnectionIceEvent) => {
  //   // console.log('ON_ICE_CANDIDATE', event)
  //   if(event.candidate) {
  //     sendMessage(METHOD_INVOKE_ADD_ICECANDIDATE, 'invoke', {
  //       object: mediaId.value,
  //       operation: 'addIceCandidate',
  //       operationParams: {
  //         candidate: event.candidate,
  //       },
  //     })
  //     // webRTCPeer.value?.addIceCandidate(new RTCIceCandidate(event.candidate))
  //     // sendMessage(METHOD_ON_ICECANDIDATE, 'onIceCadidate', {})
  //     // sendMessage({
  //     //   id: 'onIceCandidate',
  //     //   candidate: event.candidate,
  //     // });
  //   }
  // })

  webSocket.value.onopen = async function() {
    console.log("WebSocket connected")
    // createRoom()
    // webSocket.value.send(JSON.stringify({ jsonrpc: "2.0", id: 0, method: "ping", params: { interval: 240000 } }))
  }

  webSocket.value.onmessage = function(message: MessageEvent) {
    const parsedMessage = JSON.parse(message.data)
    console.info("Received message: " + message.data)

    switch(parsedMessage.id) {
      case ON_EXISTING_PARTICIPANTS:
        onExistingParticipants(parsedMessage)
        break
      case ON_NEW_PARTICIPANT_ARRIVED:
        onNewParticipant(parsedMessage.name)
        break
      case ON_PARTICIPANT_LEFT:
        onParticipantLeft(parsedMessage)
        break
      case ON_RECEIVE_VIDEO_ANSWER:
        receiveVideoResponse(parsedMessage)
        break
      case ON_ICE_CANDIDATE:
        console.log(ON_ICE_CANDIDATE, parsedMessage)
        onIceCandidateFound(parsedMessage.name, parsedMessage.candidate)
        break
      default:
        console.error("Unrecognized message", parsedMessage)
    }
  }

  webSocket.value.onclose = function(event: CloseEvent) {
    console.log("WebSocket closed:", event.code, event.reason)
  }

  webSocket.value.onerror = function(error: ErrorEvent) {
    console.log(error)
    console.log("WebSocket error:", error.message)
  }

  // webSocket.value.onmessage = async function(event: MessageEvent) {
  //   // console.log(event.data)
  //   const message = JSON.parse(event.data)
  //   console.log(message)
  //   const  { id, result, error } = message
  //   switch(id) {
  //     case METHOD_CREATE_NEW_SESSION: {
  //       sessionId.value = result.sessionId
  //       const data = await joinRoomService(roomName.value, participantName.value)
  //       // participants.value = (data ?? []).filter(ep => ep.name !== participantName.value)
  //       mediaId.value = (data ?? []).find(ep => ep.name === participantName.value).webRtcEndpoint
  //       sendMessage(METHOD_INVOKE_CONNECT, "invoke", {
  //         object: mediaId.value,
  //         operation: "connect",
  //         operationParams: {
  //           sink: mediaId.value
  //         },
  //         sessionId: sessionId.value
  //       })
  //       // for(const participant of participants.value) {
  //       //   sendMessage(METHOD_INVOKE_CONNECT, "invoke", {
  //       //     object: mediaId.value,
  //       //     operation: "connect",
  //       //     operationParams: {
  //       //       sink: mediaId.value
  //       //     },
  //       //     sessionId: sessionId.value
  //       //   })
  //       // }
  //       const sdpOffer = await generateSDPOffer()
  //       sendMessage(METHOD_INVOKE_PROCESS_OFFER, "invoke", {
  //         "object": mediaId.value,
  //         "operation": "processOffer",
  //         "operationParams": {
  //           "offer": sdpOffer
  //         },
  //         "sessionId": sessionId.value
  //       })
  //       // const processOffer = await subscribeRoomService(roomName.value, participantName.value, sdpOffer)
  //       // webRTCPeer.value?.setRemoteDescription(new RTCSessionDescription({
  //       //   type: "offer",
  //       //   sdp: processOffer
  //       // })).then(async() => {
  //       //   const sdpAnswer = await webRTCPeer.value?.createAnswer()
  //       //   await webRTCPeer.value?.setLocalDescription(sdpAnswer)
  //       //   sendMessage(METHOD_INVOKE_PROCESS_ANSWER, "invoke", {
  //       //     "object": mediaId.value,
  //       //     "operation": "processAnswer",
  //       //     "operationParams": {
  //       //       "answer": sdpAnswer?.sdp
  //       //     },
  //       //     "sessionId": sessionId.value
  //       //   })
  //       // })
  //       // await webRTCPeer.value?.setRemoteDescription(new RTCSessionDescription(processOffer))
  //       // const sdpAnswer = await webRTCPeer.value?.createAnswer()
  //       // console.log('ANSWER -------------', sdpAnswer)
  //       // await webRTCPeer.value?.setLocalDescription(sdpAnswer)
  //       // sendMessage(METHOD_INVOKE_PROCESS_OFFER, "invoke", {
  //       //   "object": mediaId.value,
  //       //   "operation": "processAnswer",
  //       //   "operationParams": {
  //       //     "answer": sdpAnswer
  //       //   },
  //       //   "sessionId": sessionId.value
  //       // })
  //       // await webRTCPeer.value?.setRemoteDescription(new RTCSessionDescription({
  //       //   type: "answer",
  //       //   sdp: sdpAnswer
  //       // }))
  //       // for(const participant of data) {
  //       //   sendMessage(METHOD_INVOKE_CONNECT, "invoke", {
  //       //     object: participant.webRtcEndpoint,
  //       //     operation: "connect",
  //       //     operationParams: {
  //       //       sink: participant.webRtcEndpoint
  //       //     },
  //       //     sessionId: sessionId.value
  //       //   })
  //       // }
  //       // sendMessage(METHOD_SUBSCRIBE, 'subscribe', {
  //       //   type: "",
  //       //   object: pipelineId.value,
  //       //   sessionId: sessionId.value
  //       // })
  //       // sendMessage(METHOD_CREATE_WEB_RTC_ENDPOINT, "create", {
  //       //   type: "WebRtcEndpoint",
  //       //   constructorParams: {
  //       //     mediaPipeline: pipelineId.value
  //       //   },
  //       //   properties: {},
  //       //   sessionId: sessionId.value
  //       // })
  //       break
  //     }
  //     case METHOD_CREATE_MEDIA_PIPELINE: {
  //       sessionId.value = message.result?.sessionId
  //       pipelineId.value = message.result?.value
  //       sendMessage(METHOD_CREATE_WEB_RTC_ENDPOINT, "create", {
  //         type: "WebRtcEndpoint",
  //         constructorParams: {
  //           mediaPipeline: pipelineId.value
  //         },
  //         properties: {},
  //         sessionId: sessionId.value
  //       })
  //       break
  //     }
  //     case METHOD_CREATE_WEB_RTC_ENDPOINT: {
  //       mediaId.value = message.result?.value
  //       sendMessage(METHOD_INVOKE_CONNECT, "invoke", {
  //         object: message.result?.value,
  //         operation: "connect",
  //         operationParams: {
  //           sink: message.result?.value
  //         },
  //         sessionId: sessionId.value
  //       })
  //       break
  //     }
  //     case METHOD_INVOKE_CONNECT: {
  //       // generateSDPOffer()
  //       console.log('CONNECT', message)
  //       // const sdpOffer = await generateSDPOffer()
  //       // sendMessage(METHOD_INVOKE_PROCESS_OFFER, "invoke", {
  //       //   "object": mediaId.value,
  //       //   "operation": "processOffer",
  //       //   "operationParams": {
  //       //     "offer": sdpOffer
  //       //   },
  //       //   "sessionId": sessionId.value
  //       // })
  //       break
  //     }
  //     case METHOD_INVOKE_PROCESS_OFFER: {
  //       const answer = result?.value
  //       await webRTCPeer.value?.setRemoteDescription(new RTCSessionDescription({
  //         type: "answer",
  //         sdp: answer
  //       }))
  //       sendMessage(METHOD_SUBSCRIBE, "subscribe", {
  //         type: "IceCandidateFound",
  //         object: mediaId.value,
  //         sessionId: sessionId.value
  //       })
  //       sendMessage(METHOD_INVOKE_GATHER_CANDIDATES, 'invoke', {
  //         object: mediaId.value,
  //         operation: 'gatherCandidates',
  //         sessionId: sessionId.value
  //       })
  //       // const sdpAnswer = await webRTCPeer.value?.createAnswer()
  //       // await webRTCPeer.value?.setLocalDescription(sdpAnswer)
  //       // sendMessage(METHOD_INVOKE_PROCESS_ANSWER, "invoke", {
  //       //   "object": mediaId.value,
  //       //   "operation": "processAnswer",
  //       //   "operationParams": {
  //       //     "answer": answer
  //       //   },
  //       //   "sessionId": sessionId.value
  //       // })
  //       // await webRTCPeer.value?.setRemoteDescription(new RTCSessionDescription({
  //       //   type: "answer",
  //       //   sdp: answer
  //       // }))
  //       // const sdpAnswer = await webRTCPeer.value?.createAnswer()
  //       // console.log(sdpAnswer)
  //       // for(const track of localStream.value.getTracks()) {
  //       //   webRTCPeer.value?.addTrack(track, localStream.value)
  //       // }
  //       break
  //     }
  //     case METHOD_INVOKE_ADD_ICECANDIDATE: {
  //       console.log('ON ADD ICE CANDIDATE', message)
  //       break
  //     }
  //     case METHOD_INVOKE_GATHER_CANDIDATES: {
  //       console.log('METHOD_INVOKE_GATHER_CANDIDATES', message)
  //       break
  //     }
  //     case METHOD_INVOKE_PROCESS_ANSWER: {
  //       const answer = result?.value
  //       console.log('METHOD_INVOKE_PROCESS_ANSWER', answer)
  //       await webRTCPeer.value?.setRemoteDescription(new RTCSessionDescription({
  //         type: 'answer',
  //         sdp: answer
  //       }))
  //
  //       // const sdpAnswer = await webRTCPeer.value?.createAnswer()
  //
  //       // for(const track of localStream.value.getTracks()) {
  //       //   webRTCPeer.value?.addTrack(track, localStream.value)
  //       // }
  //       break
  //     }
  //   }
  //
  //   if(message.method === 'onEvent') {
  //     switch(message.params?.value.type) {
  //       case "IceCandidateFound": {
  //         console.log("IceCandidateFound", message.params?.value?.data?.candidate)
  //         await webRTCPeer.value?.addIceCandidate(new RTCIceCandidate(message.params?.value?.data?.candidate))
  //         break
  //       }
  //     }
  //   }
  //   // switch(message.type) {
  //   //   case "offer": {
  //   //     // Получаем SDP-предложение от сервера и устанавливаем его в peer connection
  //   //     await webRTCPeer.value.setRemoteDescription(new RTCSessionDescription(message.sdpOffer))
  //   //
  //   //     // Создаем ответное SDP-предложение и отправляем его серверу
  //   //     const sdpAnswer = await webRTCPeer.value.createAnswer()
  //   //     await webRTCPeer.value.setLocalDescription(sdpAnswer)
  //   //     webSocket.value.send(JSON.stringify({ type: "answer", sdpAnswer }))
  //   //     break
  //   //   }
  //   //   case "candidate": {
  //   //     // Добавляем ICE-кандидата в peer connection
  //   //     await webRTCPeer.value.addIceCandidate(new RTCIceCandidate(message.candidate))
  //   //     break
  //   //   }
  //   //   case "roomCreated": {
  //   //     // Отправляем запрос на добавление себя в комнату
  //   //     webSocket.value.send(JSON.stringify({ type: "addParticipant", roomName: "myRoom", participantName: "Alice" }))
  //   //     break
  //   //   }
  //   //   case "participantAdded": {
  //   //     // Создаем медиапотоки для отправки видео и аудио
  //   //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //   //     stream.getTracks().forEach(track => webRTCPeer.value.addTrack(track, stream))
  //   //
  //   //     // Создаем SDP-предложение и отправляем его серверу
  //   //     const sdpOffer = await webRTCPeer.value.createOffer()
  //   //     await webRTCPeer.value.setLocalDescription(sdpOffer)
  //   //     webSocket.value.send(JSON.stringify({
  //   //       type: "publishMedia",
  //   //       roomName: "myRoom",
  //   //       participantName: "Alice",
  //   //       sdpOffer
  //   //     }))
  //   //     break
  //   //   }
  //   //   case "subscribed": {
  //   //     // Получаем SDP-предложение от сервера и устанавливаем его в peer connection
  //   //     await webRTCPeer.value.setRemoteDescription(new RTCSessionDescription(message.sdpOffer))
  //   //     break
  //   //   }
  //   // }
  // }

  // ws.addEventListener('open', event => {
  //   // Отправляем запрос на создание комнаты
  //   console.log(event)
  //   ws.send(JSON.stringify({ type: 'createRoom', roomName: 'myRoom' }));
  // });

  window.onbeforeunload = function() {
    if(participants.value.length > 0) sendMessage("LEAVE_ROOM", { name: participantName.value })
    webSocket.value.close()
  }
})

onBeforeUnmount(() => {
  // sendMessage("LEAVE_ROOM", { name: participantName.value, roomName: roomName.value })
  webSocket.value.close()
})

// onUnmounted(() => {
//   closeRoomService(roomName.value)
// })
</script>

<template>
  <div class="px-5">
    <div class="mb-4">
      <h1>Kurento Test</h1>
      <div>
        name: {{ participantName }}
      </div>
      <InputText v-model="roomName" />
      <Button
        class="ml-2"
        label="Start Call"
        @click="startCall"
      />
    </div>
    <div class="flex gap-3">
      <div
        class="border-round-2xl border-1"
        v-for="participant in participants"
        :key="participant.name"
      >
        <p class="font-semibold text-lg text-center">{{ participant.name }}</p>
        <video
          :id="`video@${participant.name}`"
          autoplay
          style="outline:none; height: 200px; background-color: #312F2F"
        ></video>
      </div>
    </div>
  </div>
</template>

<!--<script>-->
<!--import kurentoUtils from "kurento-utils"-->

<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--        -->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv()-->
<!--  }-->
<!--}-->
<!--</script>-->

<style scoped lang="scss">

</style>
