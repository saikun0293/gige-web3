import React, { useCallback } from "react"
import { Link } from "react-router-dom"
import { useDataInfo, useAllProducts } from "../utils"

export const History = ({ transactions, account, fetchUserInfo }) => {
	const { data: userInfo } = useDataInfo(fetchUserInfo, "/signUp")
	const [products] = useAllProducts(
		transactions,
		useCallback(({ seller, owner }) => owner !== seller && owner === account, [account])
	)

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
