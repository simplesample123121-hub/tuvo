"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const attendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  gender: z.string().min(1, 'Please select your gender'),
  age: z.string().min(1, 'Please enter your age'),
  address: z.string().min(10, 'Please enter your complete address')
})

type AttendeeFormData = z.infer<typeof attendeeSchema>

interface BookingFormProps {
  onSubmit: (data: AttendeeFormData) => void
  initialData?: Partial<AttendeeFormData>
}

export function BookingForm({ onSubmit, initialData }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: initialData
  })

  const handleFormSubmit = async (data: AttendeeFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter your full name"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter your email address"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="Enter your phone number"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select onValueChange={(value) => setValue('gender', value)} defaultValue={watch('gender')}>
            <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            {...register('age')}
            placeholder="Enter your age"
            min="1"
            max="120"
            className={errors.age ? 'border-destructive' : ''}
          />
          {errors.age && (
            <p className="text-sm text-destructive">{errors.age.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          {...register('address')}
          placeholder="Enter your complete address"
          rows={3}
          className={errors.address ? 'border-destructive' : ''}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            required
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Continue to Payment'}
      </Button>
    </form>
  )
} 