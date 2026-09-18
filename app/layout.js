import './globals.css'

export const metadata = {
  title: 'English Project Portfolio',
  description: 'Glassmorphism portfolio with Groq AI integration',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

