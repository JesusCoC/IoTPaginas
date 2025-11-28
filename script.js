var gTemp = null;
var gHum = null;

document.addEventListener("DOMContentLoaded", () => {

    // ==== TEMPERATURA ====
    gTemp = new JustGage({
        id: "gaugeTemp",
        value: 0,
        min: 0,
        max: 60,
        label: "°C",
        levelColors: ["#4caf50", "#ffc107", "#f44336"]
    });

    // ==== HUMEDAD ====
    gHum = new JustGage({
        id: "gaugeHum",
        value: 0,
        min: 0,
        max: 100,
        label: "%",
        levelColors: ["#2196f3", "#00bcd4", "#3f51b5"]
    });

    actualizar();
});


function actualizar() {

    // ---------- TEMPERATURA ----------
    $.get("/api/temperatura", (data) => {
        let t = parseFloat(data.valor);
        gTemp.refresh(t);
        $("#tempVal").text(t.toFixed(2) + " °C");
    });


    // ---------- HUMEDAD ----------
    $.get("/api/humedad", (data) => {
        let h = parseFloat(data.valor);
        gHum.refresh(h);
        $("#humVal").text(h.toFixed(2) + " %");

        evaluarEstado();
    });

    setTimeout(actualizar, 1200);
}


// ---------- ESTADO ----------
function evaluarEstado() {

    let t = parseFloat($("#tempVal").text());
    let h = parseFloat($("#humVal").text());
    let estado = $("#estado");

    if (h > 60) {
        estado.text("Humedad alta: Foco encendido");
        estado.css("color", "#d32f2f");
    }
    else if (t <= 27) {
        estado.text("Temperatura baja: Secuencia general");
        estado.css("color", "#1976d2");
    }
    else if (t > 27 && t <= 30) {
        estado.text("Temperatura templada: PWM respiración");
        estado.css("color", "#ffa000");
    }
    else if (t > 30) {
        estado.text("Temperatura alta: Secuencia caliente");
        estado.css("color", "#d84315");
    }
}
