export async function onRequestPost(context: any) {
  const { DATABASE_URL } = context.env
  const body = await context.request.json()
  const { name, email, message } = body

  const { neon } = await import('@neondatabase/serverless')
  const sql = neon(DATABASE_URL)

  await sql`
    CREATE TABLE IF NOT EXISTS kontaktet (
      id SERIAL PRIMARY KEY,
      emri TEXT,
      emaili TEXT,
      mesazhi TEXT,
      created_at TIMESTAMP DEFAULT now()
    )
  `
  await sql`
    INSERT INTO kontaktet (emri, emaili, mesazhi)
    VALUES (${name}, ${email}, ${message})
  `

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
