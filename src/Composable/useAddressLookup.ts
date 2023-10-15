export default function useAddressLookup() {
    /**
     * Obtém o nome da rua mais próxima das coordenadas fornecidas.
     * Esta função faz uma requisição ao serviço Nominatim da OpenStreetMap para obter informações de endereço.
     * @param latitude - Latitude das coordenadas.
     * @param longitude - Longitude das coordenadas.
     * @return Retorna o nome da rua mais próxima.
     */
    const getNearestStreet = async (latitude: number, longitude: number) => {
        // Fazendo uma requisição ao serviço Nominatim da OpenStreetMap para obter informações do endereço
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        // Convertendo a resposta em objeto JSON
        const data = await response.json();
        // Retornando o nome da rua do endereço
        return data;
    };

    return {
        getNearestStreet
    };
}