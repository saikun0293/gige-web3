import React, { useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"

export const SellProduct = ({ transactions, account }) => {
	const history = useHistory()

	const nameRef = useRef()
	const imageUrlRef = useRef()
	const descriptionRef = useRef()
	const priceRef = useRef()

	useEffect(() => {
		;(async () => {
			try {
				const res = await transactions.methods.fetchUserInfo().call({ from: account })
				console.log(res)
			} catch (err) {
				console.log(err)
				history.push("/signUp")
			}
		})()
	}, [account, transactions.methods, history])

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				transactions.methods
					.sellProduct(
						nameRef.current.value,
						imageUrlRef.current.value,
						descriptionRef.current.value,
						priceRef.current.value
					)
					.send({ from: account })
					.on("receipt", receipt => {
						console.log(receipt)
					})
					.on("error", error => {
						console.error(error)
					})
			}}
		>
			<input type='text' placeholder='Name' ref={nameRef} />
			<input type='text' placeholder='Image URL' ref={imageUrlRef} />
			<input type='text' placeholder='Description of Product' ref={descriptionRef} />
			<input type='number' placeholder='Price' ref={priceRef} />
			<input type='submit' />
		</form>
	)
}
