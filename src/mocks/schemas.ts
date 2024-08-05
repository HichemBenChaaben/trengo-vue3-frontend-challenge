import { z } from 'zod'

const ContactTypeEnum = ['sms', 'phone', 'chat', 'other'] as const

const channelSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(ContactTypeEnum)
})

export type ChannelSchema = z.infer<typeof channelSchema>
export const ChannelArraySchema = z.array(channelSchema)
