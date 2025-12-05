CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor') NOT NULL,
    secret_key VARCHAR(255) UNIQUE, -- Secret key để truy cập admin
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng ghi log hoạt động admin
CREATE TABLE admin_activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_user_id INT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id)
);

-- Bảng người dùng thông thường (chỉ để lưu session)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('user') DEFAULT 'user',
    browser_fingerprint VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng session người dùng
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_data JSON, -- Lưu trữ câu hỏi đã làm, kết quả thi, lịch sử
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng danh mục câu hỏi
CREATE TABLE question_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name NVARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng loại bằng lái
CREATE TABLE license_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name NVARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng câu hỏi
CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_text TEXT NOT NULL,
    image_url VARCHAR(500) NULL,
    license_type_id INT,
    category_id INT,
    is_liability_question BOOLEAN DEFAULT FALSE,
    explanation TEXT,
    created_by INT, -- Admin/editor tạo câu hỏi
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (license_type_id) REFERENCES license_types(id),
    FOREIGN KEY (category_id) REFERENCES question_categories(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bảng đáp án
CREATE TABLE question_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT,
    answer_key CHAR(1) NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Bảng loại bài thi
CREATE TABLE exam_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name NVARCHAR(100) NOT NULL,
    description TEXT,
    time_limit INT DEFAULT 20,
    question_count INT DEFAULT 35,
    license_type_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (license_type_id) REFERENCES license_types(id)
);

-- Bảng bài thi
CREATE TABLE exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_type_id INT,
    user_session_id INT,
    questions JSON,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    time_spent INT DEFAULT 0,
    score DECIMAL(5,2) DEFAULT 0,
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    wrong_answers INT DEFAULT 0,
    passed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (exam_type_id) REFERENCES exam_types(id),
    FOREIGN KEY (user_session_id) REFERENCES user_sessions(id) ON DELETE CASCADE
);

-- Bảng câu trả lời trong bài thi
CREATE TABLE exam_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT,
    question_id INT,
    selected_answer CHAR(1),
    is_correct BOOLEAN DEFAULT FALSE,
    is_marked BOOLEAN DEFAULT FALSE,
    time_spent INT DEFAULT 0,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Bảng danh mục biển báo
CREATE TABLE traffic_sign_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name NVARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng biển báo giao thông
CREATE TABLE traffic_signs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    sign_code VARCHAR(20) NOT NULL,
    name NVARCHAR(200) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT,
    meaning TEXT,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES traffic_sign_categories(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bảng tài liệu học tập
CREATE TABLE study_materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title NVARCHAR(255) NOT NULL,
    content LONGTEXT,
    material_type ENUM('tip', 'experience', 'law', 'technique') NOT NULL,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    created_by INT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bảng khóa học
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name NVARCHAR(100) NOT NULL,
    license_type_id INT,
    description TEXT,
    duration VARCHAR(100),
    price DECIMAL(12,2) DEFAULT 0,
    discount_price DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (license_type_id) REFERENCES license_types(id)
);

-- Bảng đăng ký học
CREATE TABLE registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name NVARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    course_id INT,
    desired_schedule NVARCHAR(200),
    status ENUM('new', 'contacted', 'paid', 'studying', 'completed') DEFAULT 'new',
    notes TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT, -- Admin/editor cập nhật
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (updated_by) REFERENCES admin_users(id)
);

-- Bảng liên hệ
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name NVARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    subject NVARCHAR(200),
    message TEXT,
    status ENUM('new', 'replied', 'resolved') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    FOREIGN KEY (updated_by) REFERENCES admin_users(id)
);

-- Bảng thống kê câu hỏi
CREATE TABLE question_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT,
    total_attempts INT DEFAULT 0,
    correct_attempts INT DEFAULT 0,
    wrong_attempts INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Bảng lịch sử câu hỏi người dùng
CREATE TABLE user_question_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_session_id INT,
    question_id INT,
    answered_correctly BOOLEAN,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_session_id) REFERENCES user_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Bảng thống kê tổng quan
CREATE TABLE site_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL UNIQUE,
    total_exams INT DEFAULT 0,
    total_registrations INT DEFAULT 0,
    total_contacts INT DEFAULT 0,
    pass_rate DECIMAL(5,2) DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================== TẠO DỮ LIỆU MẪU ====================

-- Tạo Secret Key mặc định
SET @SECRET_KEY = 'ADMIN_SECRET_2024_KEY';

-- Thêm dữ liệu vào bảng question_categories
INSERT INTO question_categories (name, description, sort_order) VALUES 
('Khái niệm và quy tắc', 'Các khái niệm cơ bản và quy tắc giao thông đường bộ', 1),
('Văn hóa, đạo đức', 'Văn hóa giao thông và đạo đức người lái xe', 2),
('Kỹ thuật lái xe', 'Kỹ thuật điều khiển phương tiện và xử lý tình huống', 3),
('Cấu tạo và sửa chữa', 'Kiến thức về cấu tạo xe và sửa chữa cơ bản', 4),
('Biển báo hiệu', 'Hệ thống biển báo đường bộ', 5),
('Sa hình', 'Giải các thế sa hình và tình huống giao thông', 6);

-- Thêm dữ liệu vào bảng license_types
INSERT INTO license_types (code, name, description) VALUES 
('B', 'Bằng lái xe ô tô', 'Bằng lái xe ô tô dưới 9 chỗ, xe tải dưới 3.5 tấn'),
('A1', 'Bằng lái xe mô tô', 'Bằng lái xe mô tô dưới 175cm³');
