import 'react-native-url-polyfill/auto'
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://rpnaooluhkwjcpwkzedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwbmFvb2x1aGt3amNwd2t6ZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQxOTExNTksImV4cCI6MjAxOTc2NzE1OX0.NUJJVg4QIxPtMHf0UNnrlXcRks0dYufJNIM1rkldPiE';

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;