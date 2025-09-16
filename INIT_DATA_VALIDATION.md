# Telegram Init Data Validation

این پروژه از validation استاندارد Telegram برای init data استفاده می‌کند تا امنیت برنامه را تضمین کند.

## 🔐 ویژگی‌های امنیتی

- **Signature Validation**: تأیید امضای دیجیتال Telegram
- **Expiration Check**: بررسی انقضای داده‌ها (پیش‌فرض: 24 ساعت)
- **Hash Verification**: تأیید یکپارچگی داده‌ها
- **Bot Token Verification**: تأیید هویت ربات

## 📁 فایل‌های مرتبط

### Backend (Server-side)
- `src/lib/initDataValidator.ts` - توابع اصلی validation
- `src/lib/middleware/initDataMiddleware.ts` - Middleware برای API routes
- `src/app/api/users/route.ts` - مثال استفاده در API

### Frontend (Client-side)
- `src/lib/telegramAuth.ts` - توابع کمکی برای ارسال init data
- `src/services/userService.ts` - سرویس به‌روزرسانی شده

## 🚀 نحوه استفاده

### 1. تنظیم Environment Variables

در فایل `.env.local` خود، bot token را تنظیم کنید:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
```

### 2. استفاده در API Routes

```typescript
import { validateTelegramInitData } from '@/lib/middleware/initDataMiddleware';

export async function POST(request: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  
  // Validate init data
  const validation = await validateTelegramInitData(request, botToken);
  
  if (validation instanceof NextResponse) {
    return validation; // Error response
  }
  
  // Use validated data
  const user = validation.user;
  // ...
}
```

### 3. استفاده با Higher-Order Function

```typescript
import { withInitDataValidation } from '@/lib/middleware/initDataMiddleware';

const handler = async (request: NextRequest, validatedData: any) => {
  const user = validatedData.user;
  // Your logic here
};

export const POST = withInitDataValidation(handler, process.env.TELEGRAM_BOT_TOKEN!);
```

### 4. Client-side Authentication

```typescript
import { authenticatedRequest } from '@/lib/telegramAuth';

// Automatic init data inclusion
const response = await authenticatedRequest('/api/users', {
  method: 'POST',
  body: JSON.stringify(userData)
});
```

## 🛡️ انواع خطاها

- `AUTH_DATE_INVALID`: تاریخ احراز هویت نامعتبر
- `HASH_INVALID`: Hash نامعتبر یا موجود نیست
- `SIGNATURE_INVALID`: امضا نامعتبر است
- `EXPIRED`: داده‌های init منقضی شده‌اند

## ⚙️ تنظیمات پیشرفته

### تغییر مدت انقضا

```typescript
const result = await validateInitData(initData, botToken, {
  expiresIn: 3600 // 1 hour instead of 24 hours
});
```

### غیرفعال کردن بررسی انقضا

```typescript
const result = await validateInitData(initData, botToken, {
  expiresIn: 0 // No expiration check
});
```

## 🔍 Debug و Troubleshooting

### بررسی وجود Init Data

```typescript
import { hasTelegramInitData, getTelegramInitData } from '@/lib/telegramAuth';

if (!hasTelegramInitData()) {
  console.log('No init data available');
} else {
  console.log('Init data:', getTelegramInitData());
}
```

### لاگ‌های مفید

- ✅ `Init data validation successful`
- ❌ `Init data validation failed: [error message]`
- 🔐 `Authenticating with Telegram data: [user data]`

## 📚 مراجع

- [Telegram Mini Apps Documentation](https://docs.telegram-mini-apps.com/)
- [Init Data Validation](https://docs.telegram-mini-apps.com/packages/telegram-apps-init-data-node#validate)
- [@tma.js/init-data-node Package](https://www.npmjs.com/package/@tma.js/init-data-node)

## ⚠️ نکات امنیتی

1. **هرگز bot token را در client-side قرار ندهید**
2. **همیشه init data را در server-side validate کنید**
3. **از HTTPS در production استفاده کنید**
4. **مدت انقضای مناسب تنظیم کنید**
5. **لاگ‌های امنیتی را مانیتور کنید**