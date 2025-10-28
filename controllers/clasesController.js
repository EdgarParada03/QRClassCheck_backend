const { db } = require('../firebase/adminConfig');
const { generarQR } = require('../utils/qrGenerator');

const crearClase = async (req, res) => {
  try {
    const {
      dia,
      hora_inicio,
      hora_fin,
      asignatura,
      semestre,
      docente_id,
      tema // ← nuevo campo recibido desde el frontend
    } = req.body;

    // Validación: día permitido
    const diasPermitidos = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    if (!diasPermitidos.includes(dia)) {
      return res.status(400).json({ error: 'Solo se permiten clases de lunes a sábado. Domingo no es válido.' });
    }

    // Validación: hora en rango permitido
    const convertirHora = (horaStr) => {
      const [h, m] = horaStr.split(':').map(Number);
      return h * 60 + m;
    };

    const inicioMinutos = convertirHora(hora_inicio);
    const finMinutos = convertirHora(hora_fin);

    const rangoMin = convertirHora("06:00");
    const rangoMax = convertirHora("22:05");

    if (inicioMinutos < rangoMin || inicioMinutos > rangoMax ||
        finMinutos < rangoMin || finMinutos > rangoMax) {
      return res.status(400).json({ error: 'Las clases deben estar entre 6:00 AM y 10:05 PM' });
    }

    if (finMinutos <= inicioMinutos) {
      return res.status(400).json({ error: 'La hora de fin debe ser posterior a la hora de inicio' });
    }

    // 1. Buscar o crear asignatura
    let asignatura_id;
    const asignaturasRef = db.collection('asignaturas');
    const asignaturaSnap = await asignaturasRef
      .where('nombre', '==', asignatura.nombre)
      .where('codigo', '==', asignatura.codigo)
      .get();

    if (asignaturaSnap.empty) {
      const docRef = await asignaturasRef.add(asignatura);
      asignatura_id = docRef.id;
    } else {
      asignatura_id = asignaturaSnap.docs[0].id;
    }

    // 2. Buscar o crear semestre
    let semestre_id;
    const semestresRef = db.collection('semestres');
    const semestreSnap = await semestresRef
      .where('nombre', '==', semestre.nombre)
      .where('año', '==', semestre.año)
      .where('periodo', '==', semestre.periodo)
      .get();

    if (semestreSnap.empty) {
      const docRef = await semestresRef.add(semestre);
      semestre_id = docRef.id;
    } else {
      semestre_id = semestreSnap.docs[0].id;
    }

    // 3. Crear clase
    const nuevaClase = {
      dia,
      hora_inicio,
      hora_fin,
      asignatura_id,
      docente_id,
      semestre_id,
      tema: tema || '', // ← se guarda el tema, puede ser texto largo
      qrHash: '',
      timestamp: Date.now()
    };

    const claseRef = await db.collection('clases').add(nuevaClase);
    const qr = await generarQR(`https://tuapp.com/asistencia/${claseRef.id}`);
    await claseRef.update({ qrHash: qr });

    res.status(201).json({ id: claseRef.id, qr });
  } catch (error) {
    console.error('Error al crear clase:', error);
    res.status(500).json({ error: 'Error al crear clase' });
  }
};

const getClasesPorDocente = async (req, res) => {
  try {
    const { docente_id } = req.query;
    const clasesSnap = await db.collection('clases')
      .where('docente_id', '==', docente_id)
      .get();

    const clases = [];

    for (const doc of clasesSnap.docs) {
      const clase = doc.data();

      // Obtener asignatura
      const asignaturaSnap = await db.collection('asignaturas').doc(clase.asignatura_id).get();
      const asignatura = asignaturaSnap.exists ? asignaturaSnap.data() : null;

      // Obtener semestre
      const semestreSnap = await db.collection('semestres').doc(clase.semestre_id).get();
      const semestre = semestreSnap.exists ? semestreSnap.data() : null;

      clases.push({
        id: doc.id,
        dia: clase.dia,
        hora_inicio: clase.hora_inicio,
        hora_fin: clase.hora_fin,
        tema: clase.tema || '', // ← incluir el campo tema en la respuesta
        qrHash: clase.qrHash,
        asignatura,
        semestre
      });
    }

    res.status(200).json(clases);
  } catch (error) {
    console.error('Error al obtener clases:', error);
    res.status(500).json({ error: 'Error al obtener clases' });
  }
};

module.exports = { crearClase, getClasesPorDocente };
