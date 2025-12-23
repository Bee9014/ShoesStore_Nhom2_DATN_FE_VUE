// Khi nào đưa lên mạng thì đổi dòng này thành link server thật
export const BACKEND_URL = 'http://localhost:8080'; 

/**
 * Hàm hỗ trợ lấy link ảnh chuẩn
 * @param {string} path - Đường dẫn ảnh lưu trong DB (vd: /uploads/abc.png)
 * @returns {string} - Đường dẫn đầy đủ (vd: http://localhost:8080/uploads/abc.png)
 */
export const getImageUrl = (path) => {
    if (!path) return '/default-avatar.png'; // Ảnh mặc định nếu null
    if (path.startsWith('http')) return path; // Nếu là link Google/Facebook thì giữ nguyên
    
    // Xóa dấu / ở đầu nếu có để tránh bị double //
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    return `${BACKEND_URL}/${cleanPath}`;
}