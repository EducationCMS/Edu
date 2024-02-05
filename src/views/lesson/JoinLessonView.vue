<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import router from "@/router"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"
import http from "@/plugins/axios"

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const checkBrowserSupported = () => {
  return typeof navigator.mediaDevices !== "undefined" && typeof navigator.mediaDevices.getUserMedia === "function"
}

const isBrowserSupported = ref(checkBrowserSupported())
const isCameraAvailable = ref<null|boolean>(null)
const isMicrophoneAvailable = ref<null|boolean>(null)
const isScreenAvailable = ref<null|boolean>(null)
const showStream = ref(false)
const localStream = ref<MediaStream>()
const remoteStream = ref(null)
const localAudioEnabled = ref(false)
const localVideoEnabled = ref(false)
const localVideoRef = ref(null)
const remoteVideoRef = ref(null)

const checkCameraAvailability = async() => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    isCameraAvailable.value = true
  } catch(error) {
    isCameraAvailable.value = false
  }
}

const checkMicrophoneAvailability = async() => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    isMicrophoneAvailable.value = true
    localStream.value = stream
    if(localVideoRef.value) {
      localAudioEnabled.value = true
      localVideoEnabled.value = true
      localVideoRef.value.srcObject = localStream.value
    }
  } catch(error) {
    isMicrophoneAvailable.value = false
  }
}

const checkScreenAvailability = async() => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
    isScreenAvailable.value = true
  } catch(error) {
    isScreenAvailable.value = false
  }
}

const isEverythingAvailable = computed(() => {
  return isCameraAvailable.value && isMicrophoneAvailable.value && isBrowserSupported.value && isScreenAvailable.value
})

const toggleLocalAudio = () => {
  localAudioEnabled.value = !localAudioEnabled.value
  localStream.value?.getAudioTracks().forEach((track) => {
    track.enabled = localAudioEnabled.value
  })
}

const toggleLocalVideo = () => {
  localVideoEnabled.value = !localVideoEnabled.value
  localStream.value?.getVideoTracks().forEach((track) => {
    track.enabled = localVideoEnabled.value
  })
}

const endCall = () => {
  router.go(-1)
}

const createRoom = async() => {
  try {
    const { data } = await http.post(`conference/room?roomName=1234`)
    console.log(data)
    return data
  } catch(e) {
    console.error(e)
    throw e
  }
}

onMounted(() => {
  createRoom()
  // (async() => {
  //   userStore.$patch({
  //     layout: EMPTY_LAYOUT
  //   })
  //   // await checkCameraAvailability()
  //   // await checkMicrophoneAvailability()
  //   // await checkScreenAvailability()
  // })()
})
</script>

<template>
  <div v-if="!showStream" class="flex flex-column h-screen">
    <div style="box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);">
      <header class="layout__header flex justify-content-end align-items-center">
        <div class="flex align-items-center gap-4">
          <i class="pi pi-bell text-xl"></i>
          <div v-if="user" class="flex align-items-center">
            <Avatar label="N" class="mr-2" size="large" shape="circle" />
            <div>
              <p class="my-0 font-semibold">{{ user.firstName }} {{ user.lastName }}</p>
              <p class="my-0 font-semibold text-gray-500">{{ user.email }}</p>
            </div>
          </div>
        </div>
      </header>
    </div>
    <div class="flex-1 flex align-items-center justify-content-center">
      <div class="join-lesson__preparing pt-2 pb-4 px-4">
        <p class="text-xl font-semibold mb-4">Дайындық</p>
        <p>
          <i
            class="pi mr-2"
            :class="[
              isBrowserSupported === null && 'pi-spinner pi-spin text-yellow-400',
              typeof isBrowserSupported === 'boolean' && (isBrowserSupported ? 'pi-check text-green-500' : 'pi-times text-red-500')
            ]"
          ></i>
          <span>Тексеру: браузер</span>
        </p>
        <p>
          <i
            class="pi mr-2"
            :class="[
              isCameraAvailable === null && 'pi-spinner pi-spin text-yellow-400',
              typeof isCameraAvailable === 'boolean' && (isCameraAvailable ? 'pi-check text-green-500' : 'pi-times text-red-500')
            ]"
          ></i>
          <span>Тексеру: камера</span>
        </p>
        <p>
          <i
            class="pi mr-2"
            :class="[
              isMicrophoneAvailable === null && 'pi-spinner pi-spin text-yellow-400',
              typeof isMicrophoneAvailable === 'boolean' && (isMicrophoneAvailable ? 'pi-check text-green-500' : 'pi-times text-red-500')
            ]"
          ></i>
          <span>Тексеру: микрофон</span>
        </p>
        <p>
          <i
            class="pi mr-2"
            :class="[
              isScreenAvailable === null && 'pi-spinner pi-spin text-yellow-400',
              typeof isScreenAvailable === 'boolean' && (isScreenAvailable ? 'pi-check text-green-500' : 'pi-times text-red-500')
            ]"
          ></i>
          <span>Тексеру: экран</span>
        </p>
        <div class="flex justify-content-end">
          <Button
            text
            severity="success"
            class="bg-green-100"
            :disabled="!isEverythingAvailable"
            @click="showStream = true"
          >Келесі
          </Button>
        </div>
      </div>
    </div>
  </div>
  <div v-show="showStream" class="flex flex-column h-screen">
    <div class="stream__gallery">
      <video ref="localVideoRef" autoplay style="outline:none;height: calc(100vh - 160px);"></video>
    </div>
    <div class="stream__actions flex align-items-center justify-content-center gap-3">
      <div class="stream__actions__button cursor-pointer" :class="[!localAudioEnabled && 'bg-gray-400']" @click="toggleLocalAudio">
        <img :src="`/src/assets/images/icons/stream/microphone.svg`" alt="off micro"/>
      </div>
      <div class="stream__actions__button cursor-pointer" :class="[!localVideoEnabled && 'bg-gray-400']" @click="toggleLocalVideo">
        <img :src="`/src/assets/images/icons/stream/video.svg`" alt="off camera"/>
      </div>
      <div class="stream__actions__button cursor-pointer bg-red-600" @click="endCall">
        <img :src="`/src/assets/images/icons/stream/end_call.svg`" alt="end_call"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.join-lesson {
  &__preparing {
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #DADADA;
    box-shadow: 0px 10px 7px rgba(0, 0, 0, 0.25);
    min-width: 500px;
  }
}
.video-stream {
  background-color: #2B2929;
  height: 100vh;
  width: 100%;
  position: relative;
}

.stream {
  &__gallery {
    background-color: #2B2929;
    display: grid;
    place-items: center;
    flex: 1;
  }
  &__actions {
    height: 120px;
    background-color: #000;

    &__button {
      border-radius: 100%;
      background-color: rgba(100, 97, 97, 0.64);
      display: grid;
      place-items: center;
      width: 4rem;
      height: 4rem;
    }
  }
}
</style>
<!--<script>-->
<!--import WebRTC from "vue-webrtc"-->

<!--export default {-->
<!--  name: "Call",-->
<!--  components: { WebRTC },-->
<!--  data() {-->
<!--    return {-->
<!--      localStream: null,-->
<!--      remoteStream: null,-->
<!--      rtc: null,-->
<!--      signalingServerUrl: "ws://localhost:3000",-->
<!--      roomName: "test-room",-->
<!--      started: false-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    async startCall() {-->
<!--      this.rtc = new WebRTC({-->
<!--        signalingServerUrl: this.signalingServerUrl,-->
<!--        roomName: this.roomName,-->
<!--        mediaConstraints: {-->
<!--          video: true,-->
<!--          audio: true-->
<!--        }-->
<!--      })-->
<!--      await this.rtc.getUserMedia()-->
<!--      this.localStream = this.rtc.localStream-->
<!--      this.$refs.localVideo.srcObject = this.localStream-->

<!--      this.rtc.on("peerStreamAdded", (event) => {-->
<!--        this.remoteStream = event.stream-->
<!--        this.$refs.remoteVideo.srcObject = this.remoteStream-->
<!--      })-->

<!--      await this.rtc.connect()-->
<!--      this.started = true-->
<!--    },-->
<!--    endCall() {-->
<!--      if (this.rtc) {-->
<!--        this.rtc.disconnect()-->
<!--      }-->
<!--      this.localStream = null-->
<!--      this.remoteStream = null-->
<!--      this.started = false-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
