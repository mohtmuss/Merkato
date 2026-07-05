import os


def send_verification_email(to_email, code):
    """Sends the code via Resend in production; prints to console in dev."""
    api_key = os.environ.get("RESEND_API_KEY")

    if not api_key:
        # Dev mode: no email service configured, print the code instead
        print("=" * 50)
        print(f"  VERIFICATION CODE for {to_email}: {code}")
        print("=" * 50)
        return

    import resend
    resend.api_key = api_key
    resend.Emails.send({
        "from": os.environ.get("EMAIL_FROM", "Merkato <onboarding@resend.dev>"),
        "to": to_email,
        "subject": "Your Merkato verification code",
        "html": f"""
            <div style="font-family: sans-serif; max-width: 400px;">
              <h2 style="color: #f97316;">Merkato</h2>
              <p>Your verification code is:</p>
              <h1 style="letter-spacing: 8px;">{code}</h1>
              <p style="color: #888;">This code expires in 10 minutes.</p>
            </div>
        """,
    })