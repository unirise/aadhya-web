import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema } from '../../schemas/formSchemas'

function ContactForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    })

    const onSubmit = async (data) => {
        try {
            console.log('Form Data:', data)
            // TODO: Add your form submission logic here
            // Example: await apiService.submitContactForm(data)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            alert('Form submitted successfully!')
            reset()
        } catch (error) {
            console.error('Form submission error:', error)
            alert('Error submitting form. Please try again.')
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>Contact Form</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                This is a sample form with React Hook Form + Zod validation
            </p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Name Field */}
                <div>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                        Name *
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register('name')}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                        placeholder="Enter your name"
                    />
                    {errors.name && (
                        <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                            {errors.name.message}
                        </span>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                        Email *
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {/* Subject Field */}
                <div>
                    <label htmlFor="subject" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                        Subject *
                    </label>
                    <input
                        id="subject"
                        type="text"
                        {...register('subject')}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: errors.subject ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                        placeholder="Enter subject"
                    />
                    {errors.subject && (
                        <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                            {errors.subject.message}
                        </span>
                    )}
                </div>

                {/* Message Field */}
                <div>
                    <label htmlFor="message" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                        Message *
                    </label>
                    <textarea
                        id="message"
                        {...register('message')}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: errors.message ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            resize: 'vertical',
                        }}
                        placeholder="Enter your message"
                    />
                    {errors.message && (
                        <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                            {errors.message.message}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: isSubmitting ? '#9ca3af' : '#1d4ed8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    )
}

export default ContactForm
