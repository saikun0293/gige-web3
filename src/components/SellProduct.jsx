import React, { useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"

export const SellProduct = ({ transactions, account }) => {
	const history = useHistory()

	const productNameRef = useRef()
	const imageUrl1Ref = useRef()
	const imageUrl2Ref = useRef()
	const descriptionRef = useRef()
	const locatipnRef = useRef()
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
						productNameRef.current.value,
						imageUrl1Ref.current.value,
						imageUrl2Ref.current.value,
						descriptionRef.current.value,
						locatipnRef.current.value,
						Number(priceRef.current.value)
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
			<input type='text' placeholder='Product Name' ref={productNameRef} />
			<input type='text' placeholder='Image URL 1' ref={imageUrl1Ref} />
			<input type='text' placeholder='Image URL 2' ref={imageUrl2Ref} />
			<input type='text' placeholder='Description of Product' ref={descriptionRef} />
			<input type='text' placeholder='Location' ref={locatipnRef} />
			<input type='number' placeholder='Price' ref={priceRef} />
			<input type='submit' />
		</form>
	)
}
