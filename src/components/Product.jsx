import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"

export const Product = ({ transactions, account }) => {
	const history = useHistory()
	const { id: productId } = useParams()

	const [product, setProduct] = useState(null)
	const [seller, setSeller] = useState(null)

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

	useEffect(() => {
		;(async () => {
			try {
				const product = await transactions.methods.fetchProduct(productId).call()
				setProduct(product)
				const userInfo = await transactions.methods.fetchUserInfo().call({ from: product.seller })
				setSeller(userInfo)
			} catch (err) {
				history.push("/")
			}
		})()
	}, [transactions, productId, history])

	console.log(product)
	console.log(seller)

	return (
		<div>
			<button
				onClick={() => {
					transactions.methods
						.buyProduct(productId)
						.send({ from: account, value: window.web3.utils.toWei(product.price, "Ether") })
						.on("receipt", receipt => {
							console.log(receipt)
							history.push("/")
						})
						.on("error", error => {
							console.log(error.message)
						})
				}}
			>
				Buy Product
			</button>
		</div>
	)
}
