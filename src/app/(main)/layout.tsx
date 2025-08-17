import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main id="main-content" role="main">{children}</main>
      <Footer />
    </>
  )
}