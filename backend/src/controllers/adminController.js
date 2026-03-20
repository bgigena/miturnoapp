const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        role_id: true,
        activo: true,
        created_at: true,
        Role: { select: { nombre: true } }
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Crear usuario manualmente (asignando rol directamente)
exports.createUser = async (req, res) => {
  try {
    const { email, password, role_id } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await prisma.usuario.create({
      data: { 
        email, 
        password_hash, 
        role_id: parseInt(role_id, 10) 
      }
    });
    
    res.status(201).json({ message: 'Usuario creado', id: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'El email ya existe o datos inválidos' });
  }
};

// Actualizar rol o estado (activo/inactivo) de un usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, activo } = req.body;

    const data = {};
    if (role_id !== undefined) data.role_id = parseInt(role_id, 10);
    if (activo !== undefined) data.activo = activo;

    const updatedUser = await prisma.usuario.update({
      where: { id: parseInt(id, 10) },
      data
    });

    res.json({ message: 'Usuario actualizado', updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.usuario.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};