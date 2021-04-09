import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useUserInfo } from "../utils/userInfo.hook"

export const History = ({ transactions, account }) => {
	const { userInfo } = useUserInfo(transactions, account, "/signUp")

	const [products, setProducts] = useState([])

	useEffect(() => {
		;(async () => {
			const totalProducts = await transactions.methods.totalProducts().call()
			console.log(totalProducts)

			const productsReceived = Array.from({ length: totalProducts }, (_, idx) =>
				transactions.methods.fetchProduct(idx).call()
			)

			const productsCollected = (await Promise.all(productsReceived)).filter(
				({ seller, owner }) => owner !== seller && owner === account
			)

			setProducts(productsCollected)
		})()
	}, [transactions, account])

	console.log(products)
	console.log(userInfo)

	return (
		<div>
			<h1>History</h1>
			<br />
			{products.map(product => (
				<p key={product.id}>
					{JSON.stringify(product, null, "\t")}
					<button>
						<Link to={`/product/${product.id}`}>Checkout</Link>
					</button>
					<hr />
				</p>
			))}
		</div>
	)
}
