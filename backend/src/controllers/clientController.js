const Client = require('../models/Client');

exports.createClientProfile = async (req, res) => {
  try {
    const existingProfile = await Client.findByUserId(req.user.id);
    if (existingProfile) {
      return res.status(400).json({ message: 'Client profile already exists' });
    }

    const { nombre, apellido, telefono } = req.body;
    const clientId = await Client.create({
      usuario_id: req.user.id,
      nombre,
      apellido,
      telefono
    });

    const newClient = await Client.findById(clientId);
    res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getClientProfile = async (req, res) => {
  try {
    const client = await Client.findByUserId(req.user.id);
    if (!client) {
      return res.status(404).json({ message: 'Client profile not found' });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
