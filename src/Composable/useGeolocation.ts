import { ref } from "vue";

export default function useGeolocation() {
    // Função setup para lógica reativa.
    // Definindo propriedades reativas
    const latitude = ref();
    const longitude = ref();
    const altitude = ref(0);
    const errors = ref({
        geolocation: {
            message: "",
        },
    });
    const hasLocation = ref(false);

    /**
     * Ativa a geolocalização para obter e monitorar a posição atual do dispositivo.
     * Se a geolocalização for suportada, a posição do dispositivo é obtida e monitorada.
     * Em caso de erros, mensagens apropriadas são definidas.
     */
    const activateLocate = () => {
        // Verifica se a geolocalização é suportada pelo navegador
        if (navigator.geolocation) {
          // Monitora a posição do dispositivo
          navigator.geolocation.watchPosition(
            (position) => {              
              // Define as coordenadas e altitude atuais usando os valores obtidos
              latitude.value = position.coords.latitude;
              longitude.value = position.coords.longitude;
              altitude.value = position.coords.altitude ?? 0;
              // Atualiza o valor de hasLocation para indicar que uma localização foi obtida
              hasLocation.value = true;
            },
            (error) => {
              // Em caso de erros, define mensagens apropriadas
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errors.value.geolocation.message =
                    "Usuário negou a solicitação de geolocalização.";
                  break;
                case error.POSITION_UNAVAILABLE:
                  errors.value.geolocation.message =
                    "Não foi possível obter a posição do dispositivo.";
                  break;
                case error.TIMEOUT:
                  errors.value.geolocation.message =
                    "A solicitação de geolocalização expirou.";
                  break;
                default:
                  errors.value.geolocation.message =
                    "Um erro desconhecido ocorreu na solicitação de geolocalização.";
              }
            },
            {
              // Opções para a geolocalização
              enableHighAccuracy: false,
              maximumAge: 500, // Defina o tempo máximo de idade em milissegundos (0,5 segundos)
            }
          );
        } else {
          console.log("Geolocalização não é suportada pelo navegador.");
        }
      };

  return {
    latitude,
    longitude,
    altitude,
    errors,
    hasLocation,
    activateLocate,
  };
}
