import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wsczflfhtsppaepdxxft.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzY3pmbGZodHNwcGFlcGR4eGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA5MzkzNjQsImV4cCI6MjAxNjUxNTM2NH0.wgJCXBSLyHDojkfCx1M2uoqKm89f6e7OxgTp9TFqyjo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})