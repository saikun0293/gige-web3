import React, { useState, useEffect } from "react"

export const Dashboard = ({ transactions }) => {
	const [products, setProducts] = useState([])

	useEffect(() => {
		;(async () => {
			if (transactions) {
				const totalProducts = await transactions.methods.totalProducts().call()
				console.log(totalProducts)

				const productsCollected = []
				for (let pos = 0; pos < totalProducts; ++pos)
					productsCollected.push(await transactions.methods.products(pos).call())

				setProducts(productsCollected)
			}
		})()
	}, [transactions])

	console.log(products)

	return <div>Dashboard</div>
}
