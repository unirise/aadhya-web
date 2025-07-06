# Form Integration Guide - React Hook Form + Zod

This project is set up with React Hook Form and Zod for robust form handling and validation.

## 🚀 Quick Start

### Using Pre-built Forms

```javascript
// Import any pre-built form
import ContactForm from './components/forms/ContactForm'
import LoginForm from './components/forms/LoginForm'

// Use in your component
<ContactForm />
<LoginForm />
```

### Creating Custom Forms

```javascript
import { useZodForm } from "./hooks/useZodForm";
import { contactFormSchema } from "./schemas/formSchemas";

function MyForm() {
  const { register, handleSubmit, errors, isSubmitting } = useZodForm(
    contactFormSchema,
    { name: "", email: "" },
    async (data) => {
      // Your submit logic
      console.log(data);
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

## 📁 File Structure

```
src/
├── schemas/
│   └── formSchemas.js      # Zod validation schemas
├── components/
│   └── forms/
│       ├── ContactForm.jsx # Sample contact form
│       └── LoginForm.jsx   # Sample login form
├── hooks/
│   └── useZodForm.js      # Custom form hook with utilities
```

## 🔧 Available Schemas

Pre-built validation schemas ready to use:

- `contactFormSchema` - Name, email, subject, message
- `loginFormSchema` - Email, password, remember me
- `userRegistrationSchema` - Full registration with password confirmation
- `searchFormSchema` - Search with categories and sorting

## 📝 Example Usage

### Basic Form with Validation

```javascript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "../schemas/formSchemas";

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(contactFormSchema),
});
```

### Custom Schema

```javascript
import { z } from "zod";

const mySchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  age: z.number().min(18, "Must be 18 or older"),
});
```

### Form Submission

```javascript
const onSubmit = async (data) => {
  try {
    // Your API call here
    await apiService.submitForm(data);
    alert("Success!");
  } catch (error) {
    alert("Error: " + error.message);
  }
};
```

## 🎨 Styling

Use the provided `formStyles` object for consistent styling:

```javascript
import { formStyles } from "../hooks/useZodForm";

<div style={formStyles.container}>
  <form style={formStyles.form}>
    <div style={formStyles.field}>
      <label style={formStyles.label}>Name</label>
      <input style={formStyles.input} {...register("name")} />
    </div>
  </form>
</div>;
```

## 🔧 Features Included

✅ **Form Validation** - Zod schema validation
✅ **Error Handling** - Real-time error messages
✅ **Loading States** - Submit button loading states
✅ **Custom Hooks** - `useZodForm` for easy setup
✅ **Styling Utilities** - Consistent form styling
✅ **Pre-built Forms** - Contact and login forms ready
✅ **TypeScript Support** - Type inference from schemas

## 🎯 Current Status

✅ React Hook Form installed and configured
✅ Zod validation schemas created
✅ Custom form hooks ready
✅ Sample forms implemented
✅ Form utilities and styling ready
✅ Documentation complete

Your forms are ready to use! Just import and customize as needed.
