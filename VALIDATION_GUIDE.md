# Request Validation with Zod

This boilerplate includes `zod` for type-safe request validation. Here's how to use it in your API routes.

## Why Validation Matters

Without proper request validation, your API is vulnerable to:
- **Injection attacks** (SQL, NoSQL, XSS)
- **Data corruption** from malformed inputs
- **Server crashes** from unexpected data types
- **Performance issues** from oversized payloads

## Installation

Zod is already included:
```bash
npm install zod
```

## Example: AI API Route

See `src/app/api/ai/route.ts` for a complete example:

```typescript
import { z } from "zod";

// Define validation schema
const AIRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt cannot be empty")
    .max(10000, "Prompt too long")
    .trim(),
  systemPrompt: z
    .string()
    .max(2000, "System prompt too long")
    .trim()
    .optional(),
});

export async function POST(req: Request) {
  // Parse JSON
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Validate with zod
  const validation = AIRequestSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Use validated data
  const { prompt, systemPrompt } = validation.data;
  // ... rest of your logic
}
```

## Common Validation Patterns

### Email validation
```typescript
const EmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});
```

### Enum validation
```typescript
const StatusSchema = z.object({
  status: z.enum(["draft", "published", "archived"]),
});
```

### Nested objects
```typescript
const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  settings: z.object({
    notifications: z.boolean(),
    theme: z.enum(["light", "dark"]),
  }),
});
```

### Array validation
```typescript
const TagsSchema = z.object({
  tags: z.array(z.string()).min(1).max(10),
});
```

## Best Practices

1. **Validate at the API boundary** - All user input should be validated before processing
2. **Use `.trim()` for strings** - Remove whitespace to prevent confusion
3. **Set reasonable limits** - Prevent DOS attacks with max lengths
4. **Return helpful errors** - Use `validation.error.flatten()` for client-friendly errors
5. **Type safety** - Zod infers TypeScript types automatically

## Security Benefits

- **SQL Injection Prevention**: Validate/sanitize before database queries
- **XSS Prevention**: Trim and validate string lengths
- **Type Safety**: Catch type mismatches before they cause errors
- **Rate Limiting**: Combine with rate limiting for defense in depth

## Further Reading

- [Zod Documentation](https://zod.dev/)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
