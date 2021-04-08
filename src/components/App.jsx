import React, { useState, useEffect } from "react"
import Transaction from "../abis/Transactions.json"
import Web3 from "web3"
import { BrowserRouter, Route } from "react-router-dom"
import { Dashboard } from "./Dashboard"
import { SellProduct } from "./SellProduct"

export const App = () => {
	const [account, setAccount] = useState(null)
	const [transactions, setTransactions] = useState(null)

	useEffect(() => {
		;(async () => {
			if (window.ethereum) {
				window.web3 = new Web3(window.ethereum)
				await window.ethereum.enable()
			} else if (window.web3) {
				window.web3 = new Web3(window.web3.currentProvider)
			} else {
				window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
			}

			const web3 = window.web3
			const accounts = await web3.eth.getAccounts()
			setAccount(accounts[0])
			const networkId = await web3.eth.net.getId()
			const networkData = Transaction.networks[networkId]
			if (networkData) {
				setTransactions(web3.eth.Contract(Transaction.abi, networkData.address))
			} else {
				window.alert("Transaction contract not deployed to detected network.")
			}
		})()
	}, [])

	return (
		<BrowserRouter>
			<Route path='/' exact render={() => <Dashboard transactions={transactions} />} />
			<Route
				path='/sell'
				exact
				render={() => <SellProduct transactions={transactions} account={account} />}
			/>
		</BrowserRouter>
	)
}