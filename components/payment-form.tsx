"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CreditCard, Lock } from 'lucide-react'

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Please enter a valid card number'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Please enter a valid expiry date (MM/YY)'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Please enter a valid CVV'),
  cardholderName: z.string().min(2, 'Please enter the cardholder name')
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void
  onBack: () => void
  initialData?: Partial<PaymentFormData>
}

export function PaymentForm({ onSubmit, onBack, initialData }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData
  })

  const handleFormSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    onSubmit(data)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Security Notice */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Card Number */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number *</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="cardNumber"
              {...register('cardNumber')}
              placeholder="1234 5678 9012 3456"
              className={`pl-10 ${errors.cardNumber ? 'border-destructive' : ''}`}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value)
                setValue('cardNumber', formatted)
              }}
              maxLength={19}
            />
          </div>
          {errors.cardNumber && (
            <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input
              id="expiryDate"
              {...register('expiryDate')}
              placeholder="MM/YY"
              className={errors.expiryDate ? 'border-destructive' : ''}
              onChange={(e) => {
                const formatted = formatExpiryDate(e.target.value)
                setValue('expiryDate', formatted)
              }}
              maxLength={5}
            />
            {errors.expiryDate && (
              <p className="text-sm text-destructive">{errors.expiryDate.message}</p>
            )}
          </div>

          {/* CVV */}
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV *</Label>
            <Input
              id="cvv"
              {...register('cvv')}
              placeholder="123"
              type="password"
              className={errors.cvv ? 'border-destructive' : ''}
              maxLength={4}
            />
            {errors.cvv && (
              <p className="text-sm text-destructive">{errors.cvv.message}</p>
            )}
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="space-y-2">
          <Label htmlFor="cardholderName">Cardholder Name *</Label>
          <Input
            id="cardholderName"
            {...register('cardholderName')}
            placeholder="Enter the name on the card"
            className={errors.cardholderName ? 'border-destructive' : ''}
          />
          {errors.cardholderName && (
            <p className="text-sm text-destructive">{errors.cardholderName.message}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Processing Payment...' : 'Complete Booking'}
        </Button>
      </div>

      {/* Payment Security Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• All payments are processed securely through our payment partners</p>
        <p>• Your card information is encrypted and never stored on our servers</p>
        <p>• You will receive a receipt via email after successful payment</p>
      </div>
    </form>
  )
} 