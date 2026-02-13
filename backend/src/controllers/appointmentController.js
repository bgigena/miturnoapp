const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const Client = require('../models/Client');
const dateFns = require('date-fns'); // Might need this or just native Dates

exports.getAppointments = async (req, res) => {
  try {
    // Determine context based on user role
    const { role_id, id: userId } = req.user;

    // Assuming role_id 2 = Provider, 3 = Client based on SQL comment usually
    // But better to check. For now, let's look up profile.

    const providerProfile = await Provider.findByUserId(userId);
    const clientProfile = await Client.findByUserId(userId);

    if (providerProfile) {
      // If provider, return their appointments
      const date = req.query.date; // YYYY-MM-DD
      const appointments = await Appointment.findAllByProvider(providerProfile.id, date);
      return res.json(appointments);
    } else if (clientProfile) {
      // If client, return their history
      const appointments = await Appointment.findAllByClient(clientProfile.id);
      return res.json(appointments);
    } else {
      // Admin or other?
      return res.status(403).json({ message: 'No profile found for user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { proveedor_id, servicio_id, fecha_hora_inicio, notas } = req.body;

    // Get client profile
    const client = await Client.findByUserId(req.user.id);
    if (!client) {
      return res.status(400).json({ message: 'Must have a client profile to book' });
    }

    // Get service details for duration
    const service = await Service.findById(servicio_id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Calculate end time
    const start = new Date(fecha_hora_inicio);
    const end = new Date(start.getTime() + service.duracion_minutos * 60000);

    // Check overlap
    const isOverlap = await Appointment.checkOverlap(proveedor_id, start, end);
    if (isOverlap) {
      return res.status(400).json({ message: 'Time slot occupied' });
    }

    const appointmentId = await Appointment.create({
      cliente_id: client.id,
      proveedor_id,
      servicio_id,
      fecha_hora_inicio: start,
      fecha_hora_fin: end,
      notas,
      create_by: req.user.id
    });

    const newAppointment = await Appointment.findById(appointmentId);
    res.status(201).json(newAppointment);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // Validate status ENUM('PENDIENTE','CONFIRMADO', 'CANCELADO', 'COMPLETADO', 'AUSENTE')
    const validStatuses = ['PENDIENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO', 'AUSENTE'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await Appointment.updateStatus(req.params.id, status, req.user.id);
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
