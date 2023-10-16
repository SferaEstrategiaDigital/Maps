<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  watch,
  computed,
  ref,
  inject,
} from "vue"; // Importando funções úteis do Vue 3.
import "leaflet/dist/leaflet.css"; // Importando estilos CSS do Leaflet.

import useGeolocation from "../../Composable/useGeolocation";
import useMap from "../../Composable/useMap";
import useAddressLookup from "../../Composable/useAddressLookup";
// import MarkerIcon2 from "@/assets/marker2.svg";

export default defineComponent({
  name: "Mapa", // Nome do componente.
  components: {}, // Lista de componentes filhos, se houver.

  setup() {
    // Função setup para lógica reativa.
    // Definindo propriedades reativas

    // Usando o composable useGeolocation
    const {
      latitude,
      longitude,
      altitude,
      errors,
      hasLocation,
      activateLocate,
    } = useGeolocation();

    // Usando o composable useMap
    const {
      // map,
      // markers,
      magnetometer,
      initializeMap,
      addMarker,
      // updateMarkerPosition,
      centerMapOnCoordinates,
    } = useMap();

    const data = ref("");

    const { getNearestStreet } = useAddressLookup();

    const contentHeight = inject("contentHeight") ?? {};

    watch(magnetometer, () => {
      // updateMarkerPosition(+latitude.value, +longitude.value, 0);
    });

    /**
     * Hook de ciclo de vida "onMounted".
     * É executado após o componente ser montado no DOM.
     * Neste hook, várias inicializações e configurações são feitas, como a inicialização do mapa, a configuração de eventos e a ativação da geolocalização.
     */
    onMounted(() => {
      // Ativa a geolocalização para monitorar a posição do dispositivo
      activateLocate();

      // Inicializa o mapa com configurações padrão e adiciona camada de tiles
      initializeMap();

      // Verifica se o evento de orientação do dispositivo é suportado
      if (window.DeviceOrientationEvent) {
        // Adiciona um ouvinte de eventos para monitorar mudanças na orientação do dispositivo
        window.addEventListener("deviceorientation", handleDeviceOrientation);
      }
    });

    /**
     * Hook de ciclo de vida "onUnmounted".
     * Neste hook, o ouvinte de eventos de orientação do dispositivo é removido para evitar vazamentos de memória.
     */
    onUnmounted(() => {
      // Remove o ouvinte de eventos para a orientação do dispositivo
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    });

    const coordinates = computed(() => `${latitude.value}, ${longitude.value}`);

    /**
     * Manipula eventos de orientação do dispositivo e atualiza a direção do norte magnético.
     * Esta função é chamada sempre que a orientação do dispositivo muda.
     */
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      // Obtendo o valor de orientação do dispositivo em relação ao norte magnético
      const alpha = event.alpha || 0;
      // Obtendo o valor de orientação do dispositivo em relação ao plano x-y
      // const beta = event.beta || 0;
      // Obtendo o valor de orientação do dispositivo em relação ao plano x-z
      // const gamma = event.gamma || 0;

      // Calculando a direção do norte magnético
      var heading = 360 - alpha;
      if (heading < 0) {
        heading += 360;
      }
      // Atualizando o valor do magnetômetro com a direção calculada
      magnetometer.value = +heading;
    };

    // Este é o objeto retornado pela função setup.
    // Ele expõe propriedades e métodos reativos que podem ser usados no template do componente.
    return {
      contentHeight,
      data,
      hasLocation, // Indica se uma localização foi obtida
      coordinates, // Coordenadas no formato "latitude,longitude"
      latitude, // Latitude atual
      longitude, // Longitude atual
      altitude, // Altitude atual
      errors, // Erros relacionados à geolocalização
      addMarker: async () => {
        /* const markerId = addMarker(
          latitude.value,
          longitude.value,
          altitude.value,
          magnetometer.value,
          MarkerIcon2
        ); */

        addMarker(
          latitude.value,
          longitude.value,
          altitude.value,
          magnetometer.value,
          null
        );

        const response = await getNearestStreet(
          latitude.value,
          longitude.value
        );

        addMarker(response.lat, response.lon, 0, 0, null);

        // updateMarkerPosition(response.lat, response.lon, 0);

        // data.value = response;
      },
      // updateMarkerPosition: () =>
      //   updateMarkerPosition(latitude.value, longitude.value, altitude.value),
      centerMapOnCoordinates: () =>
        centerMapOnCoordinates(latitude.value, longitude.value),
    };
  },
});
</script>
<template>
  <div
    class="relative w-full"
    :style="{
      minHeight: contentHeight + 'px',
      maxHeight: contentHeight + 'px',
    }"
  >
    <!-- Elemento do Mapa -->
    <div ref="map" id="map" class="absolute inset-0 z-10"></div>

    <div
      class="absolute top-4 left-4 right-4 flex items-center justify-between flex-col bg-white p-2 rounded shadow-md z-20"
    >
      <ul>
        <li v-for="(value, key) in data">
          <div v-if="['display_name'].indexOf(key.toString()) > -1">
            {{ key }}: {{ value }}
          </div>
        </li>
      </ul>
    </div>

    <!-- Barra inferior com informações do usuário -->
    <div
      class="absolute bottom-4 left-4 right-4 flex items-center justify-between flex-col bg-white p-2 rounded shadow-md z-20"
    >
      <div>
        <div>
          <span class="text-sm">Lat: {{ latitude }}</span>
          <span class="text-sm ml-4">Lng: {{ longitude }}</span>
          <span class="text-sm ml-4">Alt: {{ altitude }}m</span>
        </div>
        <small class="text-red-500">{{ errors.geolocation.message }}</small>
      </div>
      <div>
        <!-- Controles na parte inferior -->
        <div class="flex space-x-4 z-20">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            @click="centerMapOnCoordinates"
          >
            Centralizar
          </button>
          <button
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            @click="addMarker"
          >
            Adicionar Marcador
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Alterar a cor da linha de estrada primária */
.leaflet-tile-container
  .leaflet-tile.leaflet-tile-loaded
  path[class*="primary"] {
  stroke: #ff0000;
}

/* Alterar a cor da linha de estrada secundária */
.leaflet-tile-container
  .leaflet-tile.leaflet-tile-loaded
  path[class*="secondary"] {
  stroke: #00ff00;
}
</style>
