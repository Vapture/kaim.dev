import Link from 'next/link'

export default function FourOhFour() {
  return <>
    <h1>404 - Pardon! Perhaps page perished.</h1>
    <Link href="/">
      <a>
        Proceed.
      </a>
    </Link>
  </>
}