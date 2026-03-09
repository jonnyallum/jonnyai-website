import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Resend SMTP details from .env
SMTP_HOST = "smtp.resend.com"
SMTP_PORT = 465
SMTP_USER = "resend"
SMTP_PASS = "re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"
FROM_EMAIL = "crm@jonnyai.co.uk"
TO_EMAIL = "jonnyallum@gmail.com"

msg = MIMEMultipart()
msg['From'] = FROM_EMAIL
msg['To'] = TO_EMAIL
msg['Subject'] = "CRM SMTP Test"

body = "This is a test email from the Jonny AI CRM setup."
msg.attach(MIMEText(body, 'plain'))

try:
    server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
    server.login(SMTP_USER, SMTP_PASS)
    text = msg.as_string()
    server.sendmail(FROM_EMAIL, TO_EMAIL, text)
    server.quit()
    print("Email sent successfully!")
except Exception as e:
    print(f"Failed to send email: {e}")
