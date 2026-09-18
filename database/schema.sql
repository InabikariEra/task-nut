CREATE DATABASE IF NOT EXISTS equipment_borrowing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE equipment_borrowing;

CREATE TABLE roles (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(80) NOT NULL
);

CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    role_id TINYINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) NULL UNIQUE,
    department VARCHAR(150) NULL,
    status ENUM('ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE categories (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    item_type ENUM('EQUIPMENT', 'BOOK', 'OTHER') NOT NULL DEFAULT 'EQUIPMENT',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    item_type ENUM('EQUIPMENT', 'BOOK', 'OTHER') NOT NULL DEFAULT 'EQUIPMENT',
    description TEXT NULL,
    total_quantity INT UNSIGNED NOT NULL DEFAULT 1,
    available_quantity INT UNSIGNED NOT NULL DEFAULT 1,
    location VARCHAR(180) NULL,
    status ENUM(
        'AVAILABLE',
        'BORROWED',
        'MAINTENANCE',
        'UNAVAILABLE'
    ) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_items_category FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT chk_item_quantity CHECK (
        available_quantity <= total_quantity
    )
);

CREATE TABLE rooms (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    building VARCHAR(120) NOT NULL,
    floor VARCHAR(30) NOT NULL,
    capacity INT UNSIGNED NOT NULL,
    status ENUM(
        'AVAILABLE',
        'MAINTENANCE',
        'UNAVAILABLE'
    ) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE borrowings (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    request_code VARCHAR(40) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM(
        'PENDING',
        'APPROVED',
        'BORROWED',
        'RETURNED',
        'REJECTED',
        'OVERDUE',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    borrowed_at DATE NOT NULL,
    due_at DATE NOT NULL,
    returned_at DATE NULL,
    purpose VARCHAR(255) NOT NULL,
    approved_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_borrowings_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_borrowings_approver FOREIGN KEY (approved_by) REFERENCES users (id),
    CONSTRAINT chk_borrowing_dates CHECK (due_at >= borrowed_at)
);

CREATE TABLE borrowing_items (
    borrowing_id BIGINT UNSIGNED NOT NULL,
    item_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    PRIMARY KEY (borrowing_id, item_id),
    CONSTRAINT fk_borrowing_items_borrowing FOREIGN KEY (borrowing_id) REFERENCES borrowings (id) ON DELETE CASCADE,
    CONSTRAINT fk_borrowing_items_item FOREIGN KEY (item_id) REFERENCES items (id)
);

CREATE TABLE returns (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    borrowing_id BIGINT UNSIGNED NOT NULL UNIQUE,
    processed_by BIGINT UNSIGNED NOT NULL,
    condition_status ENUM('NORMAL', 'DAMAGED', 'LOST') NOT NULL DEFAULT 'NORMAL',
    note VARCHAR(500) NULL,
    returned_at DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_returns_borrowing FOREIGN KEY (borrowing_id) REFERENCES borrowings (id),
    CONSTRAINT fk_returns_processor FOREIGN KEY (processed_by) REFERENCES users (id)
);

CREATE TABLE fines (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    borrowing_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    late_days INT UNSIGNED NOT NULL DEFAULT 0,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status ENUM('UNPAID', 'PAID', 'WAIVED') NOT NULL DEFAULT 'UNPAID',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fines_borrowing FOREIGN KEY (borrowing_id) REFERENCES borrowings (id),
    CONSTRAINT fk_fines_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE room_bookings (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    booking_code VARCHAR(40) NOT NULL UNIQUE,
    room_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    user_count INT UNSIGNED NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'COMPLETED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_room_bookings_room FOREIGN KEY (room_id) REFERENCES rooms (id),
    CONSTRAINT fk_room_bookings_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT chk_room_booking_time CHECK (end_time > start_time)
);

CREATE TABLE audit_logs (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    before_data JSON NULL,
    after_data JSON NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX idx_items_status ON items (status);

CREATE INDEX idx_borrowings_user_status ON borrowings (user_id, status);

CREATE INDEX idx_borrowings_due_at ON borrowings (due_at);

CREATE INDEX idx_room_bookings_room_date ON room_bookings (room_id, booking_date);

CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id);

INSERT INTO
    roles (code, name)
VALUES ('ADMIN', 'ผู้ดูแลระบบ'),
    ('STAFF', 'เจ้าหน้าที่'),
    (
        'USER',
        'นักเรียน / ผู้ใช้งาน'
    );

INSERT INTO
    categories (name, description, item_type)
VALUES (
        'คอมพิวเตอร์',
        'Notebook และอุปกรณ์คอมพิวเตอร์',
        'EQUIPMENT'
    ),
    (
        'โสตทัศนูปกรณ์',
        'อุปกรณ์สำหรับการนำเสนอ',
        'EQUIPMENT'
    ),
    (
        'อุปกรณ์อิเล็กทรอนิกส์',
        'บอร์ดและชุดทดลอง',
        'EQUIPMENT'
    ),
    (
        'หนังสือเรียน',
        'หนังสือและสื่อการเรียนรู้',
        'BOOK'
    );

INSERT INTO
    rooms (
        code,
        name,
        building,
        floor,
        capacity
    )
VALUES (
        'LAB-101',
        'ห้องปฏิบัติการคอมพิวเตอร์ 1',
        'อาคาร A',
        '1',
        40
    ),
    (
        'LAB-202',
        'ห้องปฏิบัติการคอมพิวเตอร์ 2',
        'อาคาร A',
        '2',
        35
    ),
    (
        'MT-301',
        'ห้องประชุม 1',
        'อาคารกลาง',
        '3',
        20
    );

INSERT INTO
    items (
        category_id,
        code,
        name,
        item_type,
        total_quantity,
        available_quantity,
        location
    )
SELECT id, 'EQ-NT-001', 'Notebook Lenovo', 'EQUIPMENT', 12, 8, 'อาคาร A ชั้น 2'
FROM categories
WHERE
    name = 'คอมพิวเตอร์';

INSERT INTO
    items (
        category_id,
        code,
        name,
        item_type,
        total_quantity,
        available_quantity,
        location
    )
SELECT id, 'EQ-PR-004', 'Projector Epson', 'EQUIPMENT', 6, 2, 'อาคาร B ชั้น 1'
FROM categories
WHERE
    name = 'โสตทัศนูปกรณ์';

INSERT INTO
    items (
        category_id,
        code,
        name,
        item_type,
        total_quantity,
        available_quantity,
        location
    )
SELECT id, 'BOOK-001', 'หนังสือโครงสร้างข้อมูล', 'BOOK', 8, 8, 'ห้องสมุดชั้น 2'
FROM categories
WHERE
    name = 'หนังสือเรียน';

INSERT INTO
    users (
        role_id,
        name,
        email,
        password_hash,
        student_id,
        department
    )
SELECT id, 'memm', 'suparuek.mem@gmail.com', '$2b$12$un3gu5yGVLnNXVv7jLRjCuusVw.u1EuoQpYN6VV0R76ySrXd05POG', 'ST-MEMM-01', 'เทคโนโลยีสารสนเทศ'
FROM roles
WHERE
    code = 'ADMIN';