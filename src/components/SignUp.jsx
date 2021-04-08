import React, { useRef } from "react"
import { useHistory } from "react-router-dom"

export const SignUp = ({ transactions, account }) => {
	const history = useHistory()

	const nameRef = useRef()
	const emailRef = useRef()
	const phoneRef = useRef()

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				transactions.methods
					.signUp(nameRef.current.value, emailRef.current.value, phoneRef.current.value)
					.send({ from: account })
					.on("receipt", receipt => {
						console.log(receipt)
						history.push("/")
					})
					.on("error", error => {
						console.error(error)
					})
			}}
		>
			<input type='text' ref={nameRef} placeholder='Name' />
			<input type='text' ref={emailRef} placeholder='Email' />
			<input type='text' ref={phoneRef} placeholder='Phone' />
			<input type='submit' />
		</form>
	)
}
