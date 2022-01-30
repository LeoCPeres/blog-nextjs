import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <Link href="/">
        <img src="/logo.svg" alt="logo" />
      </Link>
    </header>
  )
}
