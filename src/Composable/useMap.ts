// useMap.ts
import { ref } from "vue";
import L from "leaflet";

export default function useMap() {
  // Estado reativo para o mapa e o marcador
  const map = ref<L.Map>();
  const markers = ref<L.Marker[]>([]);
  const magnetometer = ref(0);

  /**
   * Inicializa o mapa com configurações padrão e adiciona camada de tiles.
   * O mapa é criado com um centro padrão e uma camada de tiles do Mapbox é adicionada.
   */
  const initializeMap = () => {
    // Criando uma nova instância do mapa e associando ao elemento com id "map"
    map.value = new L.Map("map", {
      // Definindo o centro inicial do mapa
      center: [-29.1654907, -51.2437938],
      // Desativando o controle padrão de zoom
      zoomControl: false,
    });

    // Adicionando uma camada de tiles ao mapa usando o serviço Mapbox
    new L.TileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}&format=webp",
      {
        // Atribuição do mapa (pode ser deixada vazia se não for necessário mostrar os créditos do mapa)
        attribution: "",
        // Definindo os níveis de zoom mínimo e máximo
        minZoom: 7,
        maxZoom: 19,
        // ID do estilo do mapa no Mapbox
        id: "mapbox/streets-v11",
        // Tamanho dos tiles (512 é um valor padrão para muitos serviços de tiles)
        tileSize: 512,
        // Token de acesso para usar o serviço Mapbox
        accessToken:
          "pk.eyJ1IjoibWFyY2VsbGV6YSIsImEiOiJjbGV1ZmVrZmcwMWthM3NwZGFrM3FmYjRsIn0.pUVOlQKRnpwBV_icFHTrIA",
        // Deslocamento de zoom (ajusta o nível de zoom para corresponder ao tamanho dos tiles)
        zoomOffset: -1,
      }
    ).addTo(map.value);

    // Definindo a visualização inicial do mapa (coordenadas [0, 0] e nível de zoom 1)
    map.value.setView([0, 0], 1);
  };

  /**
   * Adiciona um marcador ao mapa nas coordenadas especificadas.
   * Se já houver um marcador no mapa, ele será substituído pelo novo.
   * @param coordinates Coordenadas no formato "latitude,longitude"
   * @param altitude Altitude atual
   * @param magnetometer Valor do magnetômetro para rotacionar o ícone
   */
  const addMarker = (
    latitude: number,
    longitude: number,
    altitude: number,
    magnetometer: number,
    icon: any
  ) => {
    // Verifica se o mapa e as coordenadas estão definidos
    if (map.value) {
      // Divide a string de coordenadas em latitude e longitude

      // Cria um novo objeto LatLng com as coordenadas extraídas
      const newLatLng = new L.LatLng(latitude, longitude, altitude);

      // Remove o marcador existente, se houver
      // if (marker.value) {
      //   map.value.removeLayer(marker.value);
      // }

      const magn = magnetometer ? `transform: rotate(${magnetometer}deg)` : "";
      let newIcon = undefined;

      if (icon) {
        // Define o ícone personalizado para o marcador
        const MarkerIcon = new L.DivIcon({
          className: "custom-marker",
          html: `<img src="${icon}" width="32" height="32"  style="${magn}" />`,
        });
        newIcon = { icon: MarkerIcon, zIndexOffset: 0 };
      }

      // Cria um novo marcador com o ícone personalizado e adiciona ao mapa
      const newMarker = new L.Marker(newLatLng, newIcon);

      newMarker.addTo(map.value);

      markers.value.push(newMarker);
      return markers.value.length - 1;
    }
  };

  /**
   * Atualiza a posição do marcador no mapa com base nas coordenadas fornecidas.
   * Se o marcador já estiver no mapa, sua posição será atualizada. Caso contrário, um novo marcador será adicionado.
   * @param lat Latitude atual
   * @param lng Longitude atual
   * @param alt Altitude atual
   */
  const updateMarkerPosition = (
    id: number,
    latitude: number,
    longitude: number,
    altitude: number,
    magnetometer: number,
    icon: any
  ) => {
    // Verifica se o marcador e as coordenadas estão definidos
    //   if (map.value && markerData.latitude && markerData.longitude) {
    //   // Cria um novo objeto LatLng com as coordenadas extraídas
    //   const newLatLng = new L.LatLng(
    //     markerData.latitude,
    //     markerData.longitude
    //   );
    //   // Atualiza a posição do marcador com o novo LatLng
    //   markers.value[markerData.id].setLatLng(newLatLng);
    //   const magn = markerData.magnetometer;
    //   // Chama o método addMarker para garantir que o marcador seja adicionado ao mapa (se ainda não estiver)
    //   // addMarker(`${markerData.latitude},${markerData.longitude}`, 0, magn);
    // }
  };

  /**
   * Centraliza o mapa nas coordenadas fornecidas.
   * @param lat Latitude atual
   * @param lng Longitude atual
   */
  const centerMapOnCoordinates = (lat: number, lng: number) => {
    if (map.value && lat && lng) {
      // Cria um novo objeto LatLng com as coordenadas fornecidas
      const newLatLng = new L.LatLng(lat, lng);

      // Centraliza o mapa nas coordenadas especificadas
      map.value.setView(newLatLng, 18);
    }
  };

  // Expondo o estado e os métodos para serem usados no componente
  return {
    map,
    markers,
    magnetometer,
    initializeMap,
    addMarker,
    updateMarkerPosition,
    centerMapOnCoordinates,
  };
}
