const ProviderService = require('../models/ProviderService');

// ... existing code ...

exports.getProviderServices = async (req, res) => {
  try {
    const services = await ProviderService.findByProviderId(req.params.id);
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addServiceToProvider = async (req, res) => {
  try {
    // Basic auth check: ensure user owns provider profile
    // For brevity, assuming middleware/previous checks or just checking here
    const provider = await Provider.findByUserId(req.user.id);
    if (!provider || provider.id != req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { service_id, precio_especifico } = req.body;
    await ProviderService.addServiceToProvider(req.params.id, service_id, precio_especifico);
    res.status(201).json({ message: 'Service added to provider' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteServiceFromProvider = async (req, res) => {
  try {
    const provider = await Provider.findByUserId(req.user.id);
    if (!provider || provider.id != req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await ProviderService.removeServiceFromProvider(req.params.id, req.params.serviceId);
    res.json({ message: 'Service removed from provider' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.findAll();
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProviderProfile = async (req, res) => {
  try {
    // Check if profile exists for user
    const existingProfile = await Provider.findByUserId(req.user.id);
    if (existingProfile) {
      return res.status(400).json({ message: 'Provider profile already exists' });
    }

    const { nombre_negocio, telefono_contacto } = req.body;
    const providerId = await Provider.create({
      usuario_id: req.user.id,
      nombre_negocio,
      telefono_contacto
    });

    const newProvider = await Provider.findById(providerId);
    res.status(201).json(newProvider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProviderProfile = async (req, res) => {
  try {
    // Ensure user owns the profile or is admin (skip admin check for now, assume owner)
    const provider = await Provider.findByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    // If trying to update specific ID, check matches
    if (req.params.id && parseInt(req.params.id) !== provider.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Provider.update(provider.id, req.body);
    const updatedProvider = await Provider.findById(provider.id);
    res.json(updatedProvider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
