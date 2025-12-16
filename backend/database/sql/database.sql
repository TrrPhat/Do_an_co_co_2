-- ==================== SCHEMA ====================

CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor') NOT NULL,
    secret_key VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('user') DEFAULT 'user',
    browser_fingerprint VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE question_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name NVARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE license_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name NVARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_text TEXT NOT NULL,
    image_url VARCHAR(500) NULL,
    license_type_id INT,
    category_id INT,
    is_liability_question BOOLEAN DEFAULT FALSE,
    explanation TEXT,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (license_type_id) REFERENCES license_types(id),
    FOREIGN KEY (category_id) REFERENCES question_categories(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

CREATE TABLE question_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT,
    answer_key CHAR(1) NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Pivot: nhiều hạng cho 1 câu hỏi
CREATE TABLE IF NOT EXISTS question_license_types (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    license_type_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_question_license (question_id, license_type_id),
    KEY idx_license (license_type_id),
    CONSTRAINT question_license_types_question_id_foreign FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT question_license_types_license_type_id_foreign FOREIGN KEY (license_type_id) REFERENCES license_types(id) ON DELETE CASCADE
);

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

CREATE TABLE traffic_sign_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name NVARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    updated_by INT,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (updated_by) REFERENCES admin_users(id)
);

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

CREATE TABLE question_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT,
    total_attempts INT DEFAULT 0,
    correct_attempts INT DEFAULT 0,
    wrong_attempts INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE user_question_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_session_id INT,
    question_id INT,
    answered_correctly BOOLEAN,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_session_id) REFERENCES user_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

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

-- ==================== SEED ====================

SET @SECRET_KEY = 'ADMIN_SECRET_2024_KEY';

INSERT INTO question_categories (name, description, sort_order) VALUES 
('Khái niệm và quy tắc', 'Các khái niệm cơ bản và quy tắc giao thông đường bộ', 1),
('Văn hóa, đạo đức', 'Văn hóa giao thông và đạo đức người lái xe', 2),
('Kỹ thuật lái xe', 'Kỹ thuật điều khiển phương tiện và xử lý tình huống', 3),
('Cấu tạo và sửa chữa', 'Kiến thức về cấu tạo xe và sửa chữa cơ bản', 4),
('Biển báo hiệu', 'Hệ thống biển báo đường bộ', 5),
('Sa hình', 'Giải các thế sa hình và tình huống giao thông', 6)
ON DUPLICATE KEY UPDATE description=VALUES(description), sort_order=VALUES(sort_order);

INSERT INTO license_types (code, name, description) VALUES 
('B', 'Bằng lái xe ô tô', 'Bằng lái xe ô tô dưới 9 chỗ, xe tải dưới 3.5 tấn'),
('A1', 'Bằng lái xe mô tô', 'Bằng lái xe mô tô dưới 175cm³')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- ==================== MAPPING LICENSE ↔ QUESTION ====================
-- Yêu cầu: Chạy các khối bên dưới SAU KHI đã import đủ 600 câu hỏi vào bảng questions.

-- Backfill B từ cột questions.license_type_id
SET @B_ID := (SELECT id FROM license_types WHERE code='B' LIMIT 1);
INSERT IGNORE INTO question_license_types (question_id, license_type_id)
SELECT q.id, @B_ID FROM questions q WHERE q.license_type_id = @B_ID;

-- Gắn 250 câu A1 vào pivot (chỉ insert những id có trong questions)
SET @A1_ID := (SELECT id FROM license_types WHERE code='A1' LIMIT 1);
CREATE TEMPORARY TABLE IF NOT EXISTS tmp_a1_ids (question_id INT PRIMARY KEY);
TRUNCATE TABLE tmp_a1_ids;
INSERT INTO tmp_a1_ids (question_id) VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(19),(20),(21),(22),(24),(26),(27),(28),(29),(30),(31),(32),(33),(34),(35),(36),(37),(38),(39),(40),(41),
(43),(44),(45),(46),(47),(48),(49),(51),(52),(53),(54),(56),(57),(59),(63),(64),(65),(66),(67),(68),(69),(70),(71),(72),(73),(74),(75),(76),(77),(80),(81),
(87),(88),(90),(91),(92),(93),(94),(96),(97),(98),(99),(100),(102),(103),(107),(109),(110),(111),(119),(123),(124),(125),(126),(137),(138),(140),(141),(142),
(145),(146),(151),(155),(163),(167),(178),(182),(185),(187),(189),(191),(192),(193),(194),(195),(200),(206),(215),(219),(232),(233),(240),(241),(242),(254),
(255),(257),(258),(259),(260),(261),(303),(304),(305),(306),(307),(313),(314),(315),(317),(318),(322),(323),(324),(325),(326),(329),(330),(335),(345),(346),
(347),(348),(349),(350),(351),(354),(360),(362),(364),(366),(367),(368),(369),(370),(371),(372),(373),(374),(375),(376),(377),(380),(381),(382),(386),(387),
(389),(390),(391),(393),(394),(395),(397),(398),(400),(401),(411),(412),(413),(415),(419),(422),(427),(430),(431),(432),(433),(434),(435),(437),(438),(439),
(440),(441),(442),(445),(450),(451),(452),(454),(455),(457),(458),(459),(460),(461),(474),(475),(476),(478),(486),(487),(490),(492),(495),(499),(500),(503),
(504),(505),(507),(508),(509),(517),(520),(525),(527),(528),(529),(538),(539),(540),(543),(548),(553),(556),(559),(560),(562),(565),(567),(568),(583),(592),(600);

INSERT IGNORE INTO question_license_types (question_id, license_type_id)
SELECT q.id, @A1_ID
FROM questions q
INNER JOIN tmp_a1_ids t ON t.question_id = q.id;

-- ==================== SAMPLE STUDY MATERIALS ====================
-- Tham khảo, biên soạn lại nội dung từ các nguồn người dùng cung cấp. Có thể chỉnh sửa/ cập nhật trong Admin sau này.
INSERT INTO study_materials (title, content, material_type, image_url, sort_order, created_by, is_published)
VALUES
(
  '11 bài thi sa hình sát hạch lái xe ô tô – mẹo và kỹ thuật',
  'Tổng quan\n- Bài 1 đến Bài 11 bám sát trình tự sa hình.\n\nKỹ thuật chung\n- Vào số mượt, giữ tua máy ổn định, quan sát gương liên tục.\n- Đi chậm – chắc – không đánh lái gấp.\n\nMột số điểm mấu chốt\n1) Xuất phát: dừng trước vạch, bật xi-nhan trái 3 giây, nhả côn/ga nhẹ.\n2) Dừng nhường đường: dừng trước vạch, quan sát cả hai bên.\n3) Dừng và khởi hành ngang dốc: nhả phanh tay dứt khoát, phối hợp côn/ga chống tụt.\n4) Qua đường vuông góc: lấy lái sớm, bám điểm mốc trên gương.\n5) Ghép xe vào nơi đỗ: mở lái – trả lái theo mốc thân xe/gương, căn bánh sau qua vạch.\n6) Qua ngã tư có đèn: tuân thủ tốc độ – vạch dừng, không cố vượt đèn vàng.\n7) Đường quanh co/đường hẹp: đi số thấp, mở lái từng nhịp ngắn.\n8) Qua đường sắt: dừng hẳn trước vạch khi có tín hiệu, quan sát.\n9) Tăng số – giảm số: thao tác êm, không giật cục.\n10) Kết thúc: xi-nhan phải, dừng đúng vị trí, về N, kéo phanh tay.\n\nLưu ý điểm liệt\n- Côn – phanh – xi-nhan sai quy trình.\n- Vượt tốc độ tối đa trong bài.\n- Tụt dốc quá quy định hoặc chèn vạch nhiều lần.\n',
  'technique',
  NULL,
  1,
  NULL,
  1
),
(
  'Hướng dẫn thi thực hành lái xe máy A1 – quy trình & lưu ý',
  'Nội dung bài thi\n- Xuất phát – dừng nhường đường – vòng số 8 – đi đường hẹp – đường gồ ghề – đường zíc zắc – kết thúc.\n\nKỹ thuật cốt lõi\n- Giữ ga đều, không phanh trước khi đánh lái, nhìn xa – bám điểm.\n- Vào số 1 ổn định, không đảo lái nhanh.\n\nMẹo tránh lỗi\n- Chạm vạch: mở lái sớm hơn một nhịp, không nhìn xuống bánh trước.\n- Chết máy: ga nhẹ trước khi nhả côn, giữ vòng tua ổn định.\n- Mất thăng bằng: kẹp gối – ép xe, nhìn theo quỹ đạo.\n\nKết thúc\n- Tắt xi-nhan, về N, dựng chân chống.\n',
  'experience',
  NULL,
  2,
  NULL,
  1
),
(
  'Ý nghĩa các đèn cảnh báo trên ô tô – cách xử lý nhanh',
  'Nhóm cảnh báo động cơ\n- Check Engine: cảm biến – hệ thống nhiên liệu – đánh lửa; giảm tốc, đưa xe kiểm tra.\n- Nhiệt độ nước làm mát: dừng xe an toàn, kiểm tra mức nước, không mở nắp khi nóng.\n\nNhóm phanh – an toàn\n- ABS: hệ thống chống bó cứng gặp lỗi, phanh vẫn hoạt động nhưng không còn ABS.\n- Phanh tay/áp suất dầu phanh: kiểm tra phanh tay, bổ sung dầu phanh, đưa xe đi bảo dưỡng.\n\nHệ thống điện – sạc\n- Đèn ắc quy: kiểm tra dây cu-roa, máy phát, cực pin.\n\nKhuyến nghị\n- Quan sát màu đèn: đỏ – dừng an toàn; vàng – cần kiểm tra sớm.\n- Đọc sổ tay xe để biết ký hiệu riêng từng hãng.\n',
  'technique',
  NULL,
  3,
  NULL,
  1
);

-- Kết thúc file
