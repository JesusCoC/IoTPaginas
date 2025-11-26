// ======= CONFIGURA AQUÍ TUS DATOS =======
// Pon tu accessToken y deviceID reales
var accessToken = "dee0df19a954aeab90df14d8f812690726c582f1";
var deviceID    = "0a10aced202194944a0674bc";

// El nombre de la variable en el Photon 2
// debe ser exactamente: Particle.variable("gradosC", &gradosC, DOUBLE);
var url = "https://api.particle.io/v1/devices/" + deviceID + "/gradosC";
// ========================================

var g = null;   // JustGage
var intervalo = 1000; // ms

// Cuando la página ya cargó
document.addEventListener("DOMContentLoaded", function () {
    // Crear el medidor
    g = new JustGage({
        id: "gauge",
        value: 0,
        min: 0,
        max: 100,           // rango máximo (ajusta si quieres)
        title: "Temperatura (°C)",
        label: "°C",
        decimals: 2
    });

    // Empezar a leer
    getReading();
});

function getReading() {
    $.ajax({
        url: url,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        success: function (data) {
            // 'result' viene como número o string
            var temp = parseFloat(data.result);

            if (isNaN(temp)) {
                console.log("Valor no numérico:", data.result);
                $("#estado").text("Error: valor no numérico.");
            } else {
                // Actualizar medidor y texto
                g.refresh(temp);
                $("#valor-num").text(temp.toFixed(2) + " °C");
                $("#estado").text("Lectura correcta");
            }

            // Volver a leer después de 1s
            setTimeout(getReading, intervalo);
        },
        error: function (err) {
            console.log("ERROR", err);
            $("#estado").text("Error de conexión. Revisa token / deviceID.");
            // Reintentar después de unos segundos
            setTimeout(getReading, 3000);
        }
    });
}
