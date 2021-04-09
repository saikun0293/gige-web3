import { useEffect, useState } from "react"

export const useAllProducts = (transactions, filterByOption) => {
	const [products, setProducts] = useState([])

	useEffect(() => {
		;(async () => {
			const totalProducts = await transactions.methods.totalProducts().call()

			const productsReceived = Array.from({ length: totalProducts }, (_, idx) =>
				transactions.methods.fetchProduct(idx).call()
			)

			const productsCollected = (await Promise.all(productsReceived)).filter(filterByOption)
			setProducts(productsCollected)
		})()
	}, [transactions, setProducts, filterByOption])

	return [products, setProducts]
}
