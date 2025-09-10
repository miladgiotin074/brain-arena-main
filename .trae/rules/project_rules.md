# Project Rules

## Page Component Usage

### Import & Basic Usage
```tsx
import { Page } from '@/components/Page';

// Home/Main pages (no back button)
<Page back={false}>{content}</Page>

// Other pages (with back button - default)
<Page>{content}</Page>
```

### Key Points
- ✅ **ALWAYS** wrap all page content with `<Page>`
- ✅ Use `back={false}` only for main/entry pages
- ✅ Default behavior shows back button
- ✅ Manages Telegram back button automatically

---

## Navigation Between Pages

### Import & Setup
```tsx
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const router = useRouter();
```

### Navigation Pattern
```tsx
const handleNavigateToPage = useCallback(() => {
  console.log('Navigating to [page-name]...');
  router.push('/route-path');
}, [router]);

<button onClick={handleNavigateToPage}>Navigate</button>
```

### Complete Example
```tsx
'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Page } from '@/components/Page';

export default function HomePage() {
  const router = useRouter();

  const handleNavigateToSecondPage = useCallback(() => {
    console.log('Navigating to second page...');
    router.push('/second-page');
  }, [router]);

  return (
    <Page back={false}>
      <button onClick={handleNavigateToSecondPage}>
        Open Second Page
      </button>
    </Page>
  );
}
```

### Key Points
- ✅ **ALWAYS** use `useRouter` from `next/navigation`
- ✅ **ALWAYS** wrap handlers with `useCallback`
- ✅ Add `console.log` for debugging
- ✅ Use descriptive handler names: `handleNavigateTo[PageName]`
- ✅ Include `[router]` in useCallback dependencies

### Template
```tsx
const handleNavigateTo[PageName] = useCallback(() => {
  console.log('Navigating to [page-name]...');
  router.push('/route-path');
}, [router]);
```

---

**Remember**: این قوانین برای consistency در تمام پروژه الزامی است.