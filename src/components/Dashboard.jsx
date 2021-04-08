import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

export const Dashboard = ({ transactions, account }) => {
	const history = useHistory()

	const [products, setProducts] = useState([])

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
		transactions.events.ProductCreated({}).on("data", event => {
			console.log(event)
			setProducts(prevProducts => [...prevProducts, event.returnValues])
		})
	}, [transactions.events])

	useEffect(() => {
		;(async () => {
			const totalProducts = await transactions.methods.totalProducts().call()
			console.log(totalProducts)

			const productsCollected = Array.from({ length: totalProducts }, (_, idx) =>
				transactions.methods.products(idx).call()
			)

			setProducts(await Promise.all(productsCollected))
		})()
	}, [transactions])

	console.log(products)
	console.log(account)

	return (
		<div>
			{products.map((product, idx) => (
				<div key={idx}>{JSON.stringify(product, null, "\t")}</div>
			))}
		</div>
	)
}
