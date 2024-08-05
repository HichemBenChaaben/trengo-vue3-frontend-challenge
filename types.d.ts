type Maybe<T> = T | undefined
type Nullable<T> = T | null

type ContactType = 'sms' | 'email' | 'whatsapp' | 'phone' | 'chat' | 'other'

export interface Channel {
  id: string
  name: string
  type: ContactType
}
