import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

export default function Denied() {

    const router = useRouter();

    

    useEffect (() => {
        if (window.ethereum.selectedAddress === null) {
            router.push("/");
        }}
    )

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 style={{color:'white'}} >
          Access Denied, Probably The Reason is: <br /> "You Don't Have A Passport Nft"
        </h1>
      </main>
    </div>
  )
}