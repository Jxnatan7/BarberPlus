import Router from "next/router"

export default function Home() {
  try {
    Router.push("/dashboard")
  } catch (error) {
    console.log(error);
  }
  return (
    <>
    
    </>
  )
}