export async function onRequestPost(context: any) {
  const { DATABASE_URL, WEB3FORMS_KEY, NOTIFY_EMAIL } = context.env

  let body: any
  try {
    body = await context.request.json()
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { name, email, message } = body || {}
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ success: false, error: 'missing_fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 1) Ruaje kontaktin në databazën Neon
  let dbOk = false
  let dbError: string | null = null
  try {
    if (!DATABASE_URL) throw new Error('DATABASE_URL nuk është konfiguruar')
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
    dbOk = true
  } catch (err: any) {
    dbError = err?.message || 'db_error'
    console.error('Neon DB error:', dbError)
  }

  // 2) Dërgo njoftim me email (Web3Forms — nuk kërkon verifikim domain-i)
  let emailOk = false
  let emailError: string | null = null
  if (WEB3FORMS_KEY) {
    try {
      const emailRes = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Mesazh i ri nga ${name} — Gold Studio`,
          from_name: 'Gold Studio Website',
          to: NOTIFY_EMAIL || 'goldstudioproduction@gmail.com',
          name,
          email,
          message,
        }),
      })
      const emailData: any = await emailRes.json().catch(() => ({}))
      emailOk = !!emailData.success
      if (!emailOk) emailError = emailData.message || 'email_failed'
    } catch (err: any) {
      emailError = err?.message || 'email_error'
      console.error('Email notify error:', emailError)
    }
  } else {
    emailError = 'WEB3FORMS_KEY nuk është konfiguruar'
  }

  // Konsiderohet sukses nëse të paktën NJËRA nga dy metodat funksionoi,
  // që useri të mos shohë kurrë gabim nëse njëra prej tyre dështon.
  if (dbOk || emailOk) {
    return new Response(JSON.stringify({ success: true, dbOk, emailOk }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.error('Kontakti dështoi plotësisht:', { dbError, emailError })
  return new Response(JSON.stringify({ success: false, dbError, emailError }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  })
}
