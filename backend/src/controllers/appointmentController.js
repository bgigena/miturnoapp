const appointmentService = require('../services/appointmentService');

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getAppointmentsForUser(req.user.id, req.query.date);
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const newAppointment = await appointmentService.createAppointment(req.user.id, req.body);
    res.status(201).json(newAppointment);
  } catch (error) {
    next(error);
  }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    await appointmentService.updateAppointmentStatus(req.params.id, req.body.status, req.user.id);
    res.json({ message: 'Status updated' });
  } catch (error) {
    next(error);
  }
};
