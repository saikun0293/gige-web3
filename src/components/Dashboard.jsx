import React, { useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { useAllProducts, useDataInfo } from "../utils"

export const Dashboard = ({ transactions, fetchUserInfo }) => {
	const { data: userInfo, error: userInfoError } = useDataInfo(fetchUserInfo)
	const [products, setProducts] = useAllProducts(
		transactions,
		useCallback(({ seller, owner }) => owner === seller, [])
	)

	useEffect(() => {
		transactions.events.ProductCreated({}).on("data", event => {
			console.log(event)
			setProducts(prevProducts => [...prevProducts, event.returnValues])
		})
	}, [transactions.events, setProducts])

	useEffect(() => {
		transactions.events.ProductBought({}).on("data", event => {
			console.log(event)
			setProducts(prevProducts =>
				prevProducts.filter(product => product.id !== event.returnValues.id)
			)
		})
	}, [transactions.events, setProducts])

	console.log(products)
	console.log(userInfo)
	console.log(userInfoError)

	return (
		<div>
			<h1>Dashboard</h1>
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
