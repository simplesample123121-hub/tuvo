import { formatPrice } from './utils'
import jsPDF from 'jspdf'
import sharp from 'sharp'

export interface TicketData {
  bookingId: string
  eventName: string
  eventDate: string
  eventLocation: string
  customerName: string
  customerEmail: string
  ticketType: string
  quantity: number
  amount: number
  imageUrl?: string
  qrPngBase64?: string
}

export async function generateTicketPdfBuffer(data: TicketData): Promise<Buffer> {
  // Use jsPDF to avoid font metrics issues with pdfkit in serverless
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Header
  doc.setFillColor('#1877F2')
  doc.rect(0, 0, pageWidth, 60, 'F')
  doc.setTextColor('#FFFFFF')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('TUVO TICKET', 40, 38)

  // Card container
  const cardX = 40
  const cardY = 90
  const cardW = pageWidth - 80
  doc.setDrawColor('#e5e7eb')
  doc.roundedRect(cardX, cardY, cardW, 620, 12, 12)

  // Event image
  let y = cardY + 20
  const imageMaxW = cardW - 60
  const imageX = cardX + 30
  if (data.imageUrl) {
    try {
      const res = await fetch(data.imageUrl)
      let contentType = res.headers.get('content-type') || 'image/jpeg'
      let buf = Buffer.from(await res.arrayBuffer())
      // Convert unsupported formats (e.g. webp) to JPEG for jsPDF
      if (!/png|jpeg|jpg/i.test(contentType)) {
        try {
          buf = await sharp(buf).jpeg({ quality: 85 }).toBuffer()
          contentType = 'image/jpeg'
        } catch {}
      }
      const base64 = buf.toString('base64')
      const format = contentType.includes('png') ? 'PNG' : 'JPEG'
      const dataUrl = `data:${contentType};base64,${base64}`
      // Calculate image size while preserving aspect ratio, max height 180
      // To estimate dimensions, rely on sharp metadata when possible
      let drawW = imageMaxW
      let drawH = 180
      try {
        const meta = await sharp(buf).metadata()
        if (meta.width && meta.height) {
          const maxW = imageMaxW
          const maxH = 180
          const ratio = Math.min(maxW / meta.width, maxH / meta.height)
          drawW = Math.round((meta.width || maxW) * ratio)
          drawH = Math.round((meta.height || maxH) * ratio)
        }
      } catch {}
      const drawX = imageX + Math.max(0, Math.floor((imageMaxW - drawW) / 2))
      doc.addImage(dataUrl, format as any, drawX, y, drawW, drawH)
      y += drawH + 20
    } catch {
      y += 20
    }
  }

  // Details
  doc.setTextColor('#111827')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(String(data.eventName), imageX, y)
  y += 26

  doc.setFont('helvetica', 'normal')
  doc.setTextColor('#6b7280')
  doc.setFontSize(11)
  doc.text(`Date: ${new Date(data.eventDate).toDateString()}`, imageX, y)
  y += 16
  doc.text(`Location: ${data.eventLocation}`, imageX, y)
  y += 16
  doc.text(`Attendee: ${data.customerName}`, imageX, y)
  y += 16
  doc.text(`Email: ${data.customerEmail}`, imageX, y)
  y += 16
  doc.text(`Ticket: ${data.ticketType} x ${data.quantity}`, imageX, y)
  y += 16
  // Avoid special currency symbols to ensure cross-font compatibility
  doc.text(`Amount: INR ${Number(data.amount).toFixed(2)}`, imageX, y)
  y += 24

  doc.setDrawColor('#e5e7eb')
  doc.line(imageX, y, cardX + cardW - 30, y)
  y += 16
  doc.setTextColor('#6b7280')
  doc.text(`Booking ID: ${data.bookingId}`, imageX, y)

  // QR code if present
  if (data.qrPngBase64) {
    try {
      const qrW = 140
      const qrX = cardX + cardW - 30 - qrW
      const qrY = y - 40
      doc.addImage(String(data.qrPngBase64), 'PNG', qrX, qrY, qrW, qrW)
      doc.setFontSize(9)
      doc.setTextColor('#94a3b8')
      doc.text('Scan to verify', qrX + 20, qrY + qrW + 12)
    } catch {}
  }

  // Footer
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor('#94a3b8')
  doc.text('Please carry a valid ID. Non-transferable. For support: support@tuvo.com', 40, pageHeight - 40, { maxWidth: pageWidth - 80 })

  const arrayBuffer = doc.output('arraybuffer') as ArrayBuffer
  return Buffer.from(arrayBuffer)
}


