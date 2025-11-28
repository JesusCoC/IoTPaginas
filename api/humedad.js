export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const accessToken = process.env.PARTICLE_ACCESS_TOKEN;
    const deviceID = process.env.PARTICLE_DEVICE_ID;

    if (!accessToken || !deviceID) {
        return res.status(500).json({ error: "Variables privadas no configuradas en Vercel" });
    }

    const url = `https://api.particle.io/v1/devices/${deviceID}/porcentajeA1`;

    try {
        const particleRes = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await particleRes.json();

        // Manejo de errores de Particle
        if (!particleRes.ok) {
            return res.status(500).json({
                error: "Error leyendo la variable en Particle",
                detalle: data
            });
        }

        return res.status(200).json({
            ok: true,
            valor: data.result,  // Humedad porcentual
            raw: data            // Info completa
        });

    } catch (error) {
        return res.status(500).json({
            error: "Error conectando con Particle",
            detalle: String(error)
        });
    }
}
