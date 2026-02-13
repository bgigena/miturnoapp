CREATE DATABASE IF NOT EXISTS miturnoapp 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE miturnoapp;

-- 1. Roles (Administración de accesos)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE -- 'ADMIN', 'PROVEEDOR', 'CLIENTE', 'OPERADOR'
) ENGINE=InnoDB;

-- 2. Usuarios (Credenciales centrales)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- 3. Proveedores (Perfiles de los profesionales)
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_negocio VARCHAR(100) NOT NULL,
    telefono_contacto VARCHAR(20),
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modify_date TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Horarios de Atención (Normalizado: un proveedor tiene muchos horarios)
CREATE TABLE horarios_atencion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    dia_semana TINYINT NOT NULL, -- 0 (Dom) a 6 (Sab)
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Servicios (Maestro de servicios/cortes)
CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    duracion_minutos INT NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modify_date TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Proveedor_Servicios (Relación N:M entre barbero y qué servicios hace)
CREATE TABLE proveedor_servicios (
    proveedor_id INT NOT NULL,
    servicio_id INT NOT NULL,
    precio_especifico DECIMAL(10,2), -- Por si un barbero cobra distinto a otro
    PRIMARY KEY (proveedor_id, servicio_id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Clientes (Perfiles de los que reservan)
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    telefono VARCHAR(20),
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    create_by INT,
    modify_date TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    modify_by INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (create_by) REFERENCES usuarios(id),
    FOREIGN KEY (modify_by) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- 8. Feriados (Globales)
CREATE TABLE feriados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL UNIQUE,
    descripcion VARCHAR(100),
    create_by INT,
    FOREIGN KEY (create_by) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- 9. Excepciones (Específicas de un profesional)
CREATE TABLE excepciones_horario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    motivo VARCHAR(255),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Turnos (El corazón del sistema)
CREATE TABLE turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    servicio_id INT NOT NULL,
    fecha_hora_inicio DATETIME NOT NULL,
    fecha_hora_fin DATETIME NOT NULL,
    estado ENUM('PENDIENTE','CONFIRMADO', 'CANCELADO', 'COMPLETADO', 'AUSENTE') DEFAULT 'PENDIENTE',
    notas TEXT,
    -- Auditoría completa
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    create_by INT,
    modify_date TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    modify_by INT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (create_by) REFERENCES usuarios(id),
    FOREIGN KEY (modify_by) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS logs_notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turno_id INT NOT NULL,
    tipo_envio VARCHAR(50) NOT NULL, -- 'MAIL_CONFIRMACION', 'MAIL_CANCELACION'
    destinatario VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_envio DATETIME NULL, -- Se llena cuando el Job lo logra mandar
    procesado BOOLEAN DEFAULT FALSE, -- Crucial para el Job
    intentos TINYINT DEFAULT 0, -- Para reintentar si falla el SMTP
    error_mensaje TEXT, -- Para debuguear por qué falló el envío
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_turnos_fecha ON turnos(fecha_hora_inicio);

CREATE INDEX idx_turnos_estado ON turnos(estado);

== TRIGGER DE ESTADOS DE TURNO == 
DELIMITER //

CREATE TRIGGER after_turno_status_change
AFTER UPDATE ON turnos
FOR EACH ROW
BEGIN
    DECLARE v_email_cliente VARCHAR(255);
    
    -- 1. Verificamos si hubo un cambio de estado
    IF NEW.estado <> OLD.estado THEN
        
        -- Obtenemos el email del cliente
        SELECT u.email INTO v_email_cliente
        FROM usuarios u
        JOIN clientes c ON c.usuario_id = u.id
        WHERE c.id = NEW.cliente_id;

        -- 2. Caso: CONFIRMACIÓN
        IF NEW.estado = 'confirmado' THEN
            INSERT INTO logs_notificaciones (turno_id, tipo_envio, destinatario, fecha_envio)
            VALUES (NEW.id, 'MAIL_CONFIRMACION', v_email_cliente, NOW());
        
        -- 3. Caso: CANCELACIÓN
        ELSEIF NEW.estado = 'cancelado' THEN
            INSERT INTO logs_notificaciones (turno_id, tipo_envio, destinatario, fecha_envio)
            VALUES (NEW.id, 'MAIL_CANCELACION', v_email_cliente, NOW());
            
        END IF;
    END IF;
END //

DELIMITER ;


== VISTAS PARA REPORTES ==

1. Vista de Agenda Diaria (Lo que ves en tu frontend)
CREATE OR REPLACE VIEW vista_agenda_completa AS
SELECT 
    t.id AS turno_id,
    t.fecha_hora_inicio,
    t.fecha_hora_fin,
    t.estado,
    c.nombre AS cliente_nombre,
    c.telefono AS cliente_telefono,
    s.nombre AS servicio_nombre,
    s.duracion_minutos,
    p.nombre_negocio AS proveedor,
    t.notas
FROM turnos t
JOIN clientes c ON t.cliente_id = c.id
JOIN servicios s ON t.servicio_id = s.id
JOIN proveedores p ON t.proveedor_id = p.id;

2. Vista de Rendimiento Económico (Reporte Mensual)
CREATE OR REPLACE VIEW reporte_mensual_ingresos AS
SELECT 
    p.nombre_negocio,
    DATE_FORMAT(t.fecha_hora_inicio, '%Y-%m') AS mes,
    COUNT(t.id) AS total_turnos,
    SUM(CASE WHEN t.estado = 'completado' THEN s.precio_base ELSE 0 END) AS ingresos_reales,
    SUM(CASE WHEN t.estado = 'cancelado' THEN 1 ELSE 0 END) AS total_cancelados
FROM turnos t
JOIN servicios s ON t.servicio_id = s.id
JOIN proveedores p ON t.proveedor_id = p.id
GROUP BY p.nombre_negocio, mes;

3. Vista de Auditoría (Backoffice)
CREATE OR REPLACE VIEW vista_auditoria_turnos AS
SELECT 
    t.id AS turno_id,
    t.create_date,
    u_creador.email AS creado_por_email,
    t.modify_date,
    u_modificador.email AS modificado_por_email,
    t.estado AS estado_final
FROM turnos t
LEFT JOIN usuarios u_creador ON t.create_by = u_creador.id
LEFT JOIN usuarios u_modificador ON t.modify_by = u_modificador.id;