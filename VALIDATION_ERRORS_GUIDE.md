# Hướng Dẫn Sử Dụng Validation Errors

## Tổng Quan

Hệ thống validation errors được thiết kế để:
- Backend Spring Boot bắt lỗi validation và trả về JSON chuẩn
- Frontend Vue.js hiển thị lỗi cụ thể ngay dưới từng ô input
- Tự động clear lỗi khi user bắt đầu nhập lại

## Backend (Spring Boot)

### 1. GlobalExceptionHandler đã được cấu hình

File: `src/main/java/com/fpl/edu/shoeStore/common/handler/GlobalExceptionHandler.java`

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Map<String, String>>builder()
                        .success(false)
                        .statusCode(400)
                        .message("Dữ liệu không hợp lệ")
                        .data(errors)
                        .build());
    }
}
```

### 2. Cách Sử Dụng Trong DTO

Ví dụ: `RegisterRequestDto.java`

```java
public class RegisterRequestDto {
    
    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 3, max = 50, message = "Họ tên phải từ 3-50 ký tự")
    private String fullname;
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email sai định dạng")
    private String email;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải có 10 chữ số")
    private String phone;
    
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;
}
```

### 3. Sử Dụng @Valid Trong Controller

```java
@PostMapping("/register")
public ResponseEntity<ApiResponse<UserResponse>> register(
        @Valid @RequestBody RegisterRequestDto dto) {
    // Code logic
}
```

**Lưu ý:** `@Valid` annotation là BẮT BUỘC để kích hoạt validation!

### 4. Response Format

Khi có lỗi validation, backend trả về:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Dữ liệu không hợp lệ",
  "data": {
    "fullname": "Họ tên không được để trống",
    "email": "Email sai định dạng",
    "phone": "Số điện thoại phải có 10 chữ số"
  }
}
```

---

## Frontend (Vue.js)

### 1. useValidationErrors Composable

File: `src/composables/useValidationErrors.js`

Composable đã được tạo sẵn với các functions:
- `setErrors(errorData)` - Set lỗi từ API
- `clearErrors()` - Clear tất cả lỗi
- `clearFieldError(fieldName)` - Clear lỗi của 1 field
- `hasError(fieldName)` - Check field có lỗi không
- `getError(fieldName)` - Lấy message lỗi của field
- `handleApiError(error)` - Xử lý axios error tự động

### 2. Cách Sử Dụng Trong Component

#### Step 1: Import composable

```vue
<script setup>
import { useValidationErrors } from '@/composables/useValidationErrors'

const { 
  errors, 
  clearErrors, 
  clearFieldError, 
  hasError, 
  getError, 
  handleApiError 
} = useValidationErrors()
</script>
```

#### Step 2: Thêm class và error message vào template

```vue
<template>
  <!-- Thêm :class và error span -->
  <div class="input-group" :class="{ 'has-error': hasError('email') }">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      v-model="formData.email"
      @input="clearFieldError('email')"
    >
    <span v-if="hasError('email')" class="field-error">
      {{ getError('email') }}
    </span>
  </div>
</template>
```

**Giải thích:**
- `:class="{ 'has-error': hasError('email') }"` - Thêm class `has-error` khi có lỗi
- `@input="clearFieldError('email')"` - Clear lỗi khi user nhập
- `<span class="field-error">` - Hiển thị message lỗi

#### Step 3: Xử lý error trong submit function

```javascript
const handleSubmit = async () => {
  clearErrors() // Clear previous errors
  
  try {
    const response = await api.post('/api/auth/register', formData.value)
    // Handle success
  } catch (error) {
    // Use composable to handle error automatically
    const errorMessage = handleApiError(error)
    // Display general error message
    console.error(errorMessage)
  }
}
```

### 3. CSS Styles (Đã được thêm vào RegisterPage)

```css
/* Input có lỗi */
.input-group.has-error input {
  border-color: #dc3545;
  background-color: #fff5f5;
}

/* Message lỗi */
.field-error {
  display: block;
  color: #dc3545;
  font-size: 13px;
  margin-top: 6px;
  font-weight: normal;
}
```

---

## Ví Dụ Hoàn Chỉnh

### Backend Controller

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequestDto dto) {
        
        UserResponse user = authService.register(dto);
        
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .statusCode(200)
                .message("Đăng ký thành công")
                .data(user)
                .build());
    }
}
```

### Frontend Component

```vue
<template>
  <form @submit.prevent="handleRegister">
    <!-- Username -->
    <div class="input-group" :class="{ 'has-error': hasError('username') }">
      <label for="username">Tên đăng nhập</label>
      <input
        type="text"
        id="username"
        v-model="formData.username"
        @input="clearFieldError('username')"
      >
      <span v-if="hasError('username')" class="field-error">
        {{ getError('username') }}
      </span>
    </div>
    
    <!-- Email -->
    <div class="input-group" :class="{ 'has-error': hasError('email') }">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        v-model="formData.email"
        @input="clearFieldError('email')"
      >
      <span v-if="hasError('email')" class="field-error">
        {{ getError('email') }}
      </span>
    </div>
    
    <button type="submit">Đăng ký</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useValidationErrors } from '@/composables/useValidationErrors'
import api from '@/utils/api'

const { clearErrors, clearFieldError, hasError, getError, handleApiError } = useValidationErrors()

const formData = ref({
  username: '',
  email: ''
})

const handleRegister = async () => {
  clearErrors()
  
  try {
    const response = await api.post('/api/auth/register', formData.value)
    console.log('Success:', response.data)
  } catch (error) {
    const errorMessage = handleApiError(error)
    console.error(errorMessage)
  }
}
</script>
```

---

## Validation Annotations Thường Dùng

### Spring Boot

| Annotation | Mô tả | Ví dụ |
|------------|-------|-------|
| `@NotNull` | Không được null | `@NotNull(message = "Không được null")` |
| `@NotBlank` | Không null/empty/whitespace | `@NotBlank(message = "Không được trống")` |
| `@NotEmpty` | Không null/empty | `@NotEmpty(message = "Không được rỗng")` |
| `@Size` | Giới hạn độ dài | `@Size(min=3, max=50, message="3-50 ký tự")` |
| `@Email` | Format email | `@Email(message = "Email sai định dạng")` |
| `@Pattern` | Regex pattern | `@Pattern(regexp="^[0-9]{10}$")` |
| `@Min` | Giá trị tối thiểu | `@Min(value=18, message="Tối thiểu 18")` |
| `@Max` | Giá trị tối đa | `@Max(value=100, message="Tối đa 100")` |

---

## Troubleshooting

### 1. Backend không bắt lỗi validation

**Nguyên nhân:** Thiếu `@Valid` annotation

**Giải pháp:** Thêm `@Valid` trước `@RequestBody`

```java
public ResponseEntity<?> create(@Valid @RequestBody MyDto dto) { ... }
```

### 2. Frontend không hiển thị lỗi cụ thể

**Kiểm tra:**
1. Response từ backend có đúng format không?
2. `handleApiError()` có được gọi trong catch block?
3. Console có log errors không?

**Debug:**
```javascript
catch (error) {
  console.log('Error Response:', error.response) // Check response
  console.log('Validation Errors:', errors.value) // Check errors object
  const msg = handleApiError(error)
}
```

### 3. CSS không hiển thị

**Kiểm tra:**
1. Class `has-error` có được thêm vào element không? (DevTools → Elements)
2. CSS scoped có đúng không?
3. CSS selector có conflict không?

---

## Best Practices

### 1. Message Lỗi Rõ Ràng

❌ **Tránh:**
```java
@NotBlank(message = "Invalid")
```

✅ **Nên:**
```java
@NotBlank(message = "Họ tên không được để trống")
```

### 2. Validation Ở Cả 2 Tầng

- **Frontend:** Validation cơ bản (required, format) để UX tốt
- **Backend:** Validation đầy đủ để security

### 3. Clear Errors Khi User Nhập

Luôn clear lỗi khi user bắt đầu sửa:

```vue
<input @input="clearFieldError('email')" />
```

### 4. Reuse Composable

Sử dụng `useValidationErrors` cho tất cả forms, không duplicate logic.

---

## Các Form Khác Cần Áp Dụng

Áp dụng pattern này cho:
- LoginPage.vue ✅ (Đã cập nhật: RegisterPage.vue)
- CreateProductForm
- UpdateUserForm
- CheckoutForm
- Tất cả form có validation từ backend

---

## Tài Liệu Tham Khảo

- [Spring Boot Validation](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#validation)
- [Vue 3 Composition API](https://vuejs.org/guide/reusability/composables.html)
- [Axios Error Handling](https://axios-http.com/docs/handling_errors)
