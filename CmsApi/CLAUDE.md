## Project Context
- .NET Core Web API สำหรับ CMS
- Database: PostgreSQL (ใช้ Npgsql.EntityFrameworkCore.PostgreSQL)
- Environment Variables: จัดการด้วย dotenv.net
- Authentication: ใช้ Cookie Authentication เท่านั้น (ไม่ใช่ JWT)

## Coding Rules
- คืนค่า API เป็น DTOs เสมอ
- ดึง `UserId` ของคนที่ Login ผ่าน `HttpContext.User`

## Coding Conventions
- ใช้ Dependency Injection
- ห้ามเรียกใช้ DbContext ใน Controllers โดยตรง ให้เรียกผ่าน Service Interface
- คืนค่าจาก API เป็น DTOs (Data Transfer Objects) เสมอ โดยใช้ `sealed record`
- ตัวแปร Private ให้ขึ้นต้นด้วย `_` (เช่น `_postService`)