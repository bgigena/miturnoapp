const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const Client = require('../models/Client');
const { ValidationError, NotFoundError, ForbiddenError } = require('../utils/errors');

class AppointmentService {
  async getAppointmentsForUser(userId, queryDate) {
    const providerProfile = await Provider.findByUserId(userId);
    const clientProfile = await Client.findByUserId(userId);

    if (providerProfile) {
      return await Appointment.findAllByProvider(providerProfile.id, queryDate);
    } else if (clientProfile) {
      return await Appointment.findAllByClient(clientProfile.id);
    } else {
      throw new ForbiddenError('No profile found for user');
    }
  }

  async createAppointment(userId, appointmentData) {
    const { proveedor_id, servicio_id, fecha_hora_inicio, notas } = appointmentData;

    const client = await Client.findByUserId(userId);
    if (!client) {
      throw new ValidationError('Must have a client profile to book');
    }

    const service = await Service.findById(servicio_id);
    if (!service) {
      throw new NotFoundError('Service not found');
    }

    const start = new Date(fecha_hora_inicio);
    const end = new Date(start.getTime() + service.duracion_minutos * 60000);

    const isOverlap = await Appointment.checkOverlap(proveedor_id, start, end);
    if (isOverlap) {
      throw new ValidationError('Time slot occupied');
    }

    const appointmentId = await Appointment.create({
      cliente_id: client.id,
      proveedor_id,
      servicio_id,
      fecha_hora_inicio: start,
      fecha_hora_fin: end,
      notas,
      create_by: userId
    });

    return await Appointment.findById(appointmentId);
  }

  async updateAppointmentStatus(id, status, userId) {
    const validStatuses = ['PENDIENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO', 'AUSENTE'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid status');
    }

    await Appointment.updateStatus(id, status, userId);
    return { message: 'Status updated' };
  }
}

module.exports = new AppointmentService();
