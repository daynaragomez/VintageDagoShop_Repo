-- Add users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- Password hash generated with bcryptjs: bcrypt.hashSync('admin123', 10)
INSERT INTO users (email, password_hash, role) VALUES 
  ('admin@vintagedago.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/IjmFG4kYLHXN8p5Q7dqYz5BqYMZjPa', 'admin')
ON DUPLICATE KEY UPDATE email=email;
