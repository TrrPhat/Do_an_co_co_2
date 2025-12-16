<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('study_materials')->insertOrIgnore([
            [
                'title' => 'Mẹo Thi Lý Thuyết Bằng Lái Xe 2025: Cách Học 600 Câu Để Đậu 100%',
                'content' => 'GIỚI THIỆU CHUNG

Từ ngày 1/6/2025, kỳ thi sát hạch cấp Giấy phép lái xe (GPLX) tại Việt Nam sẽ áp dụng bộ 600 câu hỏi lý thuyết mới do Bộ Công an ban hành. Bộ đề mới này tập trung nhiều hơn vào tình huống thực tế và nhóm câu điểm liệt – khiến việc học mẹo hay học vẹt trở nên kém hiệu quả.

Với người học các hạng B2, B1 và C, bài viết này sẽ hướng dẫn bạn cách học nhanh, nhớ lâu và tự tin thi đậu ngay lần đầu, kèm theo các mẹo thực hành hiệu quả.

CÁCH TIẾP CẬN HIỆU QUẢ:
1. Chia nhỏ ôn tập: Học 100 câu/ngày (3 ngày cho 600 câu), lặp lại mỗi ngày.
2. Flashcard: Ghi từ khóa (như "nghiêm cấm", "giảm tốc độ"), kiểm tra nhanh.
3. Luyện đề: 2-3 đề/ngày, tập trung điểm liệt, ghi chú sai sót.
4. Học hiểu, không học vẹt: Bộ đề mới yêu cầu tư duy và vận dụng.
5. Thực hành song song: Không chỉ lý thuyết mà còn lái thử trên đường thực tế.',
                'material_type' => 'tip',
                'image_url' => null,
                'sort_order' => 1,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Nhóm Khái Niệm (Câu 1-304): Mẹo Ôn Tập Hiệu Quả',
                'content' => 'NHÓM KHÁI NIỆM (CÂU 1-304)

NHÌN Ý TRẢ LỜI:
- "Nghiêm cấm, bị nghiêm cấm": Chọn hành vi nguy hiểm (Câu 1-6, 33)
- "Không được": Lệnh cấm (Câu 7-31, 66)
- "Bắt buộc": Nghĩa vụ (Câu 285)
- "Phải có phép": Cơ quan thẩm quyền (Câu 57, 63, 184)
- "Giảm tốc độ": Tình huống nguy hiểm (Câu 161, 165, 224, 225)
- "Về số thấp": Dốc/trơn (Câu 218, 221)

CHÚ Ý TỪ ĐẦU CÂU:
- "Phải": Chọn dài nhất (Câu 130, 256)
- "Quan sát": Chọn dài nhất (Câu 110, 213, 258)
- "Nhường": Chọn dài nhất (Câu 128)

CHIẾN LƯỢC:
1. Đọc kỹ từng từ trong câu hỏi
2. Xác định từ khóa chính (nghiêm cấm, không được, phải, etc.)
3. Loại trừ đáp án rõ ràng sai
4. Chọn đáp án logic nhất dựa trên quy tắc giao thông
5. Nếu không chắc, chọn đáp án dài nhất (thường chi tiết hơn)',
                'material_type' => 'tip',
                'image_url' => null,
                'sort_order' => 2,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Nhóm Biển Báo (Câu 305-486): 5 Loại Biển & 6 Quy Tắc Cấm',
                'content' => 'NHÓM BIỂN BÁO (CÂU 305-486)

5 LOẠI BIỂN BÁO:
1. Biển Nguy Hiểm (tam giác vàng) - Cảnh báo tình huống nguy hiểm
2. Biển Cấm (vòng đỏ) - Cấm hành động cụ thể
3. Biển Hiệu Lệnh (vòng xanh) - Bắt buộc tuân thủ
4. Biển Chỉ Dẫn (vuông xanh) - Thông tin hữu ích
5. Biển Phụ (trắng-đen) - Bổ sung thông tin cho biển chính

6 QUY TẮC CẤM QUAN TRỌNG:
1. Cấm xe nhỏ → cấm xe lớn (trừ mô tô)
2. Cấm xe lớn → không cấm xe nhỏ
3. Cấm 2 bánh → cấm 3 bánh → không cấm 4 bánh
4. Cấm rẽ trái → cấm quay đầu
5. Mở lái → trả lái theo mốc
6. Vạch vàng: Phân chiều; vạch trắng: Phân làn

MẸO NHẬN DIỆN NHANH:
- Có ngoặc kép → tên biển
- Không ngoặc → ý nghĩa (Câu 425-428)
- Biển 2 mũi tên → quay đầu được (Câu 430)
- Vạch vàng: Phân chiều; vạch trắng: Phân làn (Câu 478-480)',
                'material_type' => 'tip',
                'image_url' => null,
                'sort_order' => 3,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Nhóm Sa Hình (Câu 487-600): 5 Bước Xử Lý & Mẹo Chọn Nhanh',
                'content' => 'NHÓM SA HÌNH (CÂU 487-600)

5 BƯỚC XỬ LÝ SA HÌNH:
Bước 1: Xét xe trong giao lộ - Nếu có xe đang đi → nhường
Bước 2: Xét xe ưu tiên - PCCC, quân sự, công an, cứu thương → nhường
Bước 3: Xét đường ưu tiên - Biển báo chỉ đường ưu tiên → tuân thủ
Bước 4: Xét xe bên phải không vướng (ngã 4) - Xe bên phải → nhường
Bước 5: Xét rẽ phải → thẳng → trái → quay đầu - Ưu tiên theo thứ tự

MẸO CHỌN NHANH:
- CSGT: Chọn 3 (Câu 487-488)
- Xe PCCC/quân sự: Chọn 2 (Câu 492-495, 500)
- Xe công an: Chọn 1/4 (xe đi trước, Câu 496-498)
- Hình đua xe: Đếm bánh cuối, trừ 1 (Câu 567-569)

NGUYÊN TẮC VÀNG:
- Phải trước, trái sau
- Ưu tiên xe công cộng, xe cứu hộ
- Luôn quan sát gương trước khi thay đổi hướng
- Dừng hẳn trước vạch khi không chắc chắn',
                'material_type' => 'technique',
                'image_url' => null,
                'sort_order' => 4,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Mẹo Thi Đánh Rơi Đáp Án Nhanh Chóng - Nhóm Khái Niệm',
                'content' => 'MẸO TỰA NHANH CHÓNG - NHÓM KHÁI NIỆM

HẠNG GPLX & ĐIỀU KIỆN:
- B1: "không hành nghề"
- B2: 2 (năm kinh nghiệm)
- C: 3 (năm kinh nghiệm)
- D: 1 (năm kinh nghiệm)
- E: 2 (năm kinh nghiệm)
- FC: 2 (năm kinh nghiệm)
- FE: 1 (năm kinh nghiệm)

CON SỐ QUAN TRỌNG:
Chọn lớn nhất khi: Tốc độ tối đa, Khoảng cách an toàn, Thời gian lái liên tục, Niên hạn

TUỔI TỐI ĐA:
- Nam: 55 tuổi
- Nữ: 50 tuổi

NIÊN HẠN GPLX:
- Chở người: 20 năm
- Chở hàng: 25 năm

GIỚI HẠN LÁI XE:
- Không quá 10 tiếng/ngày
- Không quá 4 tiếng liên tục

CSGT - TÍN HIỆU:
- Giơ 2 tay: 4 (dừng hẳn)
- Giơ 1 tay: 3 (chờ)

TỐC ĐỘ TRONG KHU VỰC ĐÔNG DÂN CƯ:
- Có dải phân cách: 60 km/h
- Không dải phân cách: 50 km/h',
                'material_type' => 'tip',
                'image_url' => null,
                'sort_order' => 5,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Mẹo Thi Kỹ Thuật Máy Và Thiết Bị Ô Tô',
                'content' => 'MẸO THI KỸ THUẬT MÁY VÀ THIẾT BỊ Ô TÔ

CẤU TẠOÔ TÔ - CÂU HỎI & ĐÁP ÁN:
- Hộp số: Chuyển động lùi (Câu 296)
- Dây đai: Hãm giữ chặt (Câu 290, 302)
- Kính chắn gió: An toàn (Câu 283)
- Động cơ diesel không nổ: Nhiên liệu lẫn không khí (Câu 304)
- Vòng xuyến: Nhường trái; không vòng: Nhường phải (Câu 116)
- Động cơ: Nhiệt năng thành cơ năng (Câu 292)
- Hệ thống bôi trơn: Cung cấp dầu (Câu 293)
- Truyền lực: Truyền mô men (Câu 294)
- Phanh: Giảm tốc độ (Câu 298)
- Lái: Thay đổi hướng (Câu 297)
- Ly hợp: Truyền/ngắt động cơ (Câu 295)
- Động cơ 4 kỳ: 4 hành trình (Câu 291)
- Ắc quy: Tích điện (Câu 300)
- Túi khí: Giữ người, giảm va đập (Câu 303)
- Máy phát: Phát điện (Câu 301)',
                'material_type' => 'technique',
                'image_url' => null,
                'sort_order' => 6,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Mẹo Xử Lý Câu Điểm Liệt Hiệu Quả',
                'content' => 'MẸO XỬ LÝ CÂU ĐIỂM LIỆT HIỆU QUẢ

ĐỊNH NGHĨA ĐIỂM LIỆT:
Câu điểm liệt: Sai 1 câu là rớt (không đậu)
- Thường liên quan đến hành vi nguy hiểm
- Ví dụ: vượt đèn đỏ, lái xe khi say rượu

NHẬN DIỆN CÂU ĐIỂM LIỆT:
Tìm từ khóa: "Nghiêm cấm", "Không được", "Bị phạt", "Hành vi nguy hiểm"

HÀNH VI NGUY HIỂM PHỔ BIẾN:
1. Vượt đèn đỏ - Phạt: 800.000 - 1.200.000 VNĐ (2025)
2. Lái xe khi say rượu - Phạt: Rất cao, tạm giữ bằng
3. Không tuân thủ biển báo - Phạt: 300.000 - 500.000 VNĐ
4. Không nhường đường cho xe ưu tiên - Phạt: 200.000 - 300.000 VNĐ
5. Chở quá tải - Phạt: 500.000 - 1.000.000 VNĐ

CHIẾN LƯỢC ÔN TẬP:
1. Học thuộc mức phạt
2. Hiểu lý do đằng sau mỗi quy tắc
3. Liên tưởng tình huống thực tế
4. Lặp lại câu điểm liệt nhiều lần
5. Không chủ quan với câu dễ',
                'material_type' => 'tip',
                'image_url' => null,
                'sort_order' => 7,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Mẹo Ôn Tập Và Thi Hiệu Quả - Lịch Trình 10-14 Ngày',
                'content' => 'MẸO ÔN TẬP VÀ THI HIỆU QUẢ - LỊCH TRÌNH 10-14 NGÀY

LỊCH TRÌNH ÔN TẬP KHUYẾN NGHỊ:
Ngày 1-3: Nhóm Khái Niệm (Câu 1-304) - Học 100 câu/ngày
Ngày 4-6: Nhóm Biển Báo (Câu 305-486) - Học 60 câu/ngày
Ngày 7-9: Nhóm Sa Hình (Câu 487-600) - Học 40 câu/ngày
Ngày 10-14: Ôn Tập Toàn Bộ - Luyện 3 đề/ngày

PHƯƠNG PHÁP HỌC HIỆU QUẢ:
1. Flashcard: Ghi từ khóa, kiểm tra nhanh mỗi ngày
2. Luyện Đề: 2-3 đề/ngày, tập trung câu điểm liệt
3. Học Nhóm: Học cùng bạn bè, giải thích cho nhau
4. Ôn Lại Thường Xuyên: Ôn lại câu sai 3 lần

TRÁNH SAI LẦM:
❌ Không học dồn dập trước ngày thi
❌ Không bỏ qua nhóm câu điểm liệt
❌ Không học vẹt
❌ Không bỏ qua thực hành

CHUẨN BỊ TRƯỚC NGÀY THI:
1. Kiểm tra sức khỏe - Đảm bảo không căng thẳng, ngủ đủ 7-8 tiếng
2. Chuẩn Bị Tâm Lý - Tự tin vào kiến thức đã học
3. Chuẩn Bị Thực Tế - Biết địa chỉ trung tâm sát hạch, đến sớm 30 phút',
                'material_type' => 'experience',
                'image_url' => null,
                'sort_order' => 8,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Mẹo Làm Bài Thi Trên Máy Tính - 3 Bước Chiến Thắng',
                'content' => 'MẸO LÀM BÀI THI TRÊN MÁY TÍNH - 3 BƯỚC CHIẾN THẮNG

BƯỚC 1: CHUẨN BỊ TRƯỚC KHI BẮT ĐẦU
- Nhập họ tên chính xác
- Chọn hạng xe (B2, B1, C)
- Kiểm tra lại thông tin
- Tổng 35 câu hỏi, thời gian: 20 phút (37 giây/câu)
- Điểm đạt: 23/35 câu đúng (65%)
- 1 câu điểm liệt sai = rớt

BƯỚC 2: LÀM BÀI THI HIỆU QUẢ
Chiến Lược Làm Bài:
1. Ưu tiên câu điểm liệt - Làm trước các câu về hành vi nguy hiểm
2. Làm câu dễ trước - Tăng tự tin, tiết kiệm thời gian
3. Bỏ qua câu khó - Không dành quá 37 giây/câu
4. Đọc Kỹ Câu Hỏi - Đọc từng từ cẩn thận, xác định từ khóa
5. Chọn Đáp Án - Chọn đáp án logic nhất, nếu không chắc chọn dài nhất

BƯỚC 3: HOÀN THÀNH & KIỂM TRA
- Nếu còn thời gian, quay lại câu khó
- Đọc lại câu hỏi và đáp án
- Tick nhanh các câu còn lại thay vì bỏ trống
- Kiểm tra kết quả ngay, xem số câu đúng/sai

NHỮNG ĐIỀU KHÔNG NÊN LÀM:
❌ Không đọc lướt câu hỏi
❌ Không dành quá nhiều thời gian cho 1 câu
❌ Không thay đổi đáp án liên tục
❌ Không bỏ trống câu hỏi',
                'material_type' => 'technique',
                'image_url' => null,
                'sort_order' => 9,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Câu Hỏi Mẫu & Cách Giải Thích Chi Tiết - Bộ Đề 600 Câu',
                'content' => 'CÂU HỎI MẪU & CÁCH GIẢI THÍCH CHI TIẾT

CÂU 102 – TỐC ĐỘ TỐI ĐA TRONG KHU VỰC ĐÔNG DÂN CƯ
Câu Hỏi: "Khi lái xe ô tô trong khu vực đông dân cư, loại đường có dải phân cách, tốc độ tối đa là bao nhiêu?"
Đáp Án Đúng: 60 km/h
Giải Thích: Khu vực đông dân cư + có dải = 60 km/h; Nếu không có dải = 50 km/h
Lý do: Bảo vệ người đi bộ, trẻ em, người già

CÂU 130 – TRÁCH NHIỆM NHƯỜNG ĐƯỜNG TRONG GIAO LỘ KHÔNG CÓ BIỂN
Câu Hỏi: "Xe nào phải nhường đường trong giao lộ không có biển báo?"
Đáp Án Đúng: Xe bên trái nhường xe bên phải
Giải Thích: Giao lộ không ưu tiên → nguyên tắc "phải trước – trái sau"
Mẹo Nhớ: Đây là nguyên tắc vàng khi làm câu sa hình

CÂU 218 – KỸ THUẬT XỬ LÝ KHI XUỐNG DỐC DÀI, TRƠN
Câu Hỏi: "Khi xuống dốc dài, trơn bạn cần làm gì?"
Đáp Án Đúng: Về số thấp, dùng phanh động cơ, không rà phanh liên tục
Giải Thích: Dốc dài → phanh sẽ nóng; Số thấp → giữ tốc độ; Phanh động cơ → sử dụng lực cản
Mẹo Nhớ: Gặp từ khóa "dốc" → chọn "về số thấp"',
                'material_type' => 'experience',
                'image_url' => null,
                'sort_order' => 10,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Lưu Ý Khi Ôn Luyện Bộ Đề 600 Câu Mới - Tránh Sai Lầm',
                'content' => 'LƯU Ý KHI ÔN LUYỆN BỘ ĐỀ 600 CÂU MỚI - TRÁNH SAI LẦM

LƯU Ý 1: KHÔNG HỌC DỒN DẬP TRƯỚC NGÀY THI
Vấn Đề: Ôn luyện quá nhiều trong thời gian ngắn, dễ gây quá tải
Giải Pháp: Chia nhỏ thời gian học, mỗi ngày 1-2 giờ, duy trì đều đặn 10-14 ngày

LƯU Ý 2: TẬP TRUNG VÀO NHÓM CÂU ĐIỂM LIỆT
Vấn Đề: Câu điểm liệt quyết định bạn đậu hay trượt
Giải Pháp: Dành thời gian ôn kỹ, ghi nhớ các hành vi nguy hiểm, hiểu hậu quả

LƯU Ý 3: HỌC HIỂU, KHÔNG HỌC VẸT
Vấn Đề: Bộ đề mới yêu cầu tư duy và vận dụng
Giải Pháp: Hiểu bản chất của từng câu hỏi, liên tưởng tình huống thực tế

LƯU Ý 4: THỰC HÀNH SONG SONG VỚI LÝ THUYẾT
Vấn Đề: Chỉ học lý thuyết không đủ
Giải Pháp: Lái thử trên các tuyến đường thực tế, quan sát biển báo

LƯU Ý 5: KIỂM TRA SỨC KHỎE TRƯỚC KHI THI
Vấn Đề: Căng thẳng, thiếu ngủ ảnh hưởng hiệu suất
Giải Pháp: Đảm bảo sức khỏe tốt, ngủ đủ 7-8 tiếng, ăn uống đầy đủ

LƯU Ý 6: TRÁNH PHỤ THUỘC VÀO MẸO HỌC TRÊN MẠNG
Vấn Đề: Một số mẹo trên mạng xã hội không chính xác
Giải Pháp: Ưu tiên học từ nguồn chính thức, thực hành để tự rút kinh nghiệm

KẾT LUẬN:
Ôn luyện bộ đề 600 câu mới đòi hỏi kế hoạch học tập hợp lý, tập trung vào câu điểm liệt, hiểu sâu không học vẹt, thực hành song song, sức khỏe tốt và tâm lý ổn định.',
                'material_type' => 'tip',
                'image_url' => null,
                'sort_order' => 11,
                'created_by' => null,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        DB::table('study_materials')
            ->whereIn('title', [
                'Mẹo Thi Lý Thuyết Bằng Lái Xe 2025: Cách Học 600 Câu Để Đậu 100%',
                'Nhóm Khái Niệm (Câu 1-304): Mẹo Ôn Tập Hiệu Quả',
                'Nhóm Biển Báo (Câu 305-486): 5 Loại Biển & 6 Quy Tắc Cấm',
                'Nhóm Sa Hình (Câu 487-600): 5 Bước Xử Lý & Mẹo Chọn Nhanh',
                'Mẹo Thi Đánh Rơi Đáp Án Nhanh Chóng - Nhóm Khái Niệm',
                'Mẹo Thi Kỹ Thuật Máy Và Thiết Bị Ô Tô',
                'Mẹo Xử Lý Câu Điểm Liệt Hiệu Quả',
                'Mẹo Ôn Tập Và Thi Hiệu Quả - Lịch Trình 10-14 Ngày',
                'Mẹo Làm Bài Thi Trên Máy Tính - 3 Bước Chiến Thắng',
                'Câu Hỏi Mẫu & Cách Giải Thích Chi Tiết - Bộ Đề 600 Câu',
                'Lưu Ý Khi Ôn Luyện Bộ Đề 600 Câu Mới - Tránh Sai Lầm',
            ])
            ->delete();
    }
};
