import React, { useRef } from "react"

export const SellProduct = ({ transactions, account }) => {
	const nameRef = useRef()
	const imageUrlRef = useRef()
	const descriptionRef = useRef()
	const priceRef = useRef()

	return (
		<form
			onSubmit={async event => {
				event.preventDefault()
				transactions.methods
					.sellProduct(
						nameRef.current.value,
						imageUrlRef.current.value,
						descriptionRef.current.value,
						priceRef.current.value
					)
					.send({ from: account })
					.once("receipt", res => {
						console.log(JSON.stringify(res, null, "\t"))
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
