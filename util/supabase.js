import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://avmsimuqocpmckpfiddi.supabase.co'
const supabase = createClient(
  supabaseUrl,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNTUwNzc4NCwiZXhwIjoxOTUxMDgzNzg0fQ.9dbQO7BgYiVfKzzWTts-hQB5r7UIiPJpjhX9wNlvxtk'
)

export default supabase
