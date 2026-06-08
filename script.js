// GANTI 2 BARIS INI PAKE URL + KEY DARI SUPABASE KAMU
const SUPABASE_URL = 'https://hiuccvouljvmjektfihb.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdWNjdm91bGp2bWpla3RmaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MDYzMzYsImV4cCI6MjA5NjM4MjMzNn0.6VYHsF2WyoeNvT1JpZr1OjkfttGJNNp-JuZSe7HKyg8'

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
const chatBox = document.getElementById('chatBox')
const namaInput = document.getElementById('namaInput')
const pesanInput = document.getElementById('pesanInput')

// Load chat lama
async function loadChat() {
  const { data } = await supabase
    .from('chat')
    .select('*')
    .eq('room', 'rootchat')
    .order('created_at', { ascending: true })
    .limit(100)
  
  chatBox.innerHTML = ''
  data.forEach(tampilPesan)
  chatBox.scrollTop = chatBox.scrollHeight
}

// Tampil 1 pesan
function tampilPesan(p) {
  const div = document.createElement('div')
  div.className = 'pesan'
  div.innerHTML = `<b>${p.nama}:</b> ${p.pesan}`
  chatBox.appendChild(div)
}

// Kirim pesan
async function kirimPesan() {
  const nama = namaInput.value.trim() || 'Anon'
  const pesan = pesanInput.value.trim()
  if(!pesan) return
  
  await supabase.from('chat').insert([{ nama, pesan, room: 'rootchat' }])
  pesanInput.value = ''
}

// Enter buat kirim
pesanInput.addEventListener('keypress', e => {
  if(e.key === 'Enter') kirimPesan()
})

// Dengerin chat baru real-time
supabase.channel('rootchat')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat', filter: 'room=eq.rootchat' }, 
    payload => {
      tampilPesan(payload.new)
      chatBox.scrollTop = chatBox.scrollHeight
    }
  )
  .subscribe()

loadChat()
