import React, { useRef } from "react"
import { useUserInfo } from "../utils/userInfo.hook"

export const SellProduct = ({ transactions, account }) => {
	const { userInfo } = useUserInfo(transactions, account, "/signUp")

	const productNameRef = useRef()
	const imageUrl1Ref = useRef()
	const imageUrl2Ref = useRef()
	const descriptionRef = useRef()
	const locatipnRef = useRef()
	const priceRef = useRef()

	console.log(userInfo)

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
