import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

export default function Denied() {

  const router = useRouter();

  async function goToHomePage() {
    router.push("/");

  }


  useEffect(() => {
    if (window.ethereum.selectedAddress === null) {
      router.push("/");
    }
  }
  )

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 style={{ color: 'white', textAlign:"center"}} >
          Access Denied, Probably The Reason is:<br />"You Don't Have A Passport Nft"<br />
        </h1>
        <button className="btn btn-primary mt-2" onClick={goToHomePage}>
          Go To Home Page
        </button>
      </main>
    </div>
  )
}